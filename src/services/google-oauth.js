/**
 * Inicio Google mediante Supabase Auth + OAuth PKCE. Sin SDK adicional.
 * El verificador se conserva en cookie HttpOnly/SameSite=Lax durante 10 minutos;
 * la sesión se entrega al mismo origen mediante una respuesta no-cache con CSP.
 */
import crypto from 'node:crypto';
import { config } from '../config.js';
import { getSupabaseState, authExchangeCode, authUser } from './supabase.js';
import { ensureProfile } from './accounts.js';

const COOKIE = 'dlorgia_google_pkce';
const TEN_MINUTES = 600;
const SESSION_KEY = 'dlorgia:remote:session:v1';

const base64url = (buffer) => Buffer.from(buffer).toString('base64url');
const random = () => base64url(crypto.randomBytes(32));

export function oauthPublicOrigin() {
  try {
    const url = new URL(config.publicUrl || '');
    const localhost = ['localhost', '127.0.0.1'].includes(url.hostname);
    if (url.username || url.password || url.search || url.hash || url.pathname !== '/') return null;
    if (url.protocol !== 'https:' && !(localhost && url.protocol === 'http:')) return null;
    return url.origin;
  } catch { return null; }
}

export function googleOAuthEnabled() {
  return Boolean(config.googleOauthEnabled && getSupabaseState().authConfigured && getSupabaseState().databaseConfigured && oauthPublicOrigin());
}

export function googleOAuthStatus() {
  return { available: googleOAuthEnabled() };
}

function cookieFor(state, verifier, secure, returnTo) {
  const value = base64url(JSON.stringify({ state, verifier, returnTo }));
  return `${COOKIE}=${value}; Path=/api/auth/google; HttpOnly; SameSite=Lax; Max-Age=${TEN_MINUTES}${secure ? '; Secure' : ''}`;
}
function expireCookie(secure) {
  return `${COOKIE}=; Path=/api/auth/google; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`;
}
function readCookie(req) {
  const part = String(req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE + '='));
  if (!part) return null;
  try {
    const value = JSON.parse(Buffer.from(part.slice(COOKIE.length + 1), 'base64url').toString('utf8'));
    if (!/^[A-Za-z0-9_-]{43}$/.test(value.state) || !/^[A-Za-z0-9_-]{43}$/.test(value.verifier)) return null;
    return value;
  } catch { return null; }
}

function constantEqual(a, b) {
  if (!a || !b) return false;
  const aa = Buffer.from(String(a)), bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}
function safeJson(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
function htmlEscape(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
function writeHtml(res, status, html, cookie, nonce) {
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, private',
    'Pragma': 'no-cache',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': `default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'`,
    'Set-Cookie': cookie
  });
  res.end(html);
}
function page(title, body, nonce, script = '') {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${htmlEscape(title)} · D’Lorgia Orienta</title><style nonce="${nonce}">body{margin:0;min-height:100svh;display:grid;place-items:center;background:#f6f2e9;color:#183e35;font:16px/1.6 system-ui,sans-serif}.card{max-width:440px;margin:20px;padding:32px;border-radius:28px;border:1px solid #d5e2d8;background:#fffdfa;box-shadow:0 20px 65px #183e351c}h1{font:600 35px/1.1 Georgia,serif;margin:8px 0 15px}p{color:#50685b}a{display:inline-block;padding:12px 20px;background:#183e35;color:white;text-decoration:none;border-radius:12px;font-weight:700}</style></head><body><main class="card"><small>D’LORGIA · ACCESO SEGURO</small><h1>${htmlEscape(title)}</h1>${body}</main>${script ? `<script nonce="${nonce}">${script}</script>` : ''}</body></html>`;
}
function failure(res, message, secure, status = 400) {
  const nonce = random();
  writeHtml(res, status, page('No pudimos completar el acceso', `<p>${htmlEscape(message)}</p><a href="/app">Volver a D’Lorgia</a>`, nonce), expireCookie(secure), nonce);
}

export function startGoogleOAuth(req, res) {
  if (!googleOAuthEnabled()) {
    const nonce = random();
    const secure = oauthPublicOrigin()?.startsWith('https:') || false;
    writeHtml(res, 503, page('Google aún no está disponible', '<p>Puedes crear tu cuenta con correo mientras activamos este acceso.</p><a href="/app">Acceder con correo</a>', nonce), expireCookie(secure), nonce);
    return;
  }
  const origin = oauthPublicOrigin();
  const secure = origin.startsWith('https:');
  const returnTo = new URL(req.url, origin).searchParams.get('return_to') === 'admin' ? 'admin' : 'app';
  const state = random(), verifier = random();
  const challenge = base64url(crypto.createHash('sha256').update(verifier).digest());
  const callback = new URL('/api/auth/google/callback', origin);
  callback.searchParams.set('state', state);
  const authorize = new URL('/auth/v1/authorize', config.supabaseUrl);
  authorize.searchParams.set('provider', 'google');
  authorize.searchParams.set('redirect_to', callback.href);
  authorize.searchParams.set('code_challenge', challenge);
  authorize.searchParams.set('code_challenge_method', 's256');
  res.writeHead(302, { Location: authorize.href, 'Set-Cookie': cookieFor(state, verifier, secure, returnTo), 'Cache-Control':'no-store', 'Referrer-Policy':'no-referrer' });
  res.end();
}

export async function finishGoogleOAuth(req, res, url) {
  const secure = oauthPublicOrigin()?.startsWith('https:') || false;
  const stored = readCookie(req);
  if (!stored || !constantEqual(stored.state, url.searchParams.get('state'))) {
    failure(res, 'El intento de ingreso no coincide. Inicia nuevamente el acceso con Google.', secure);
    return;
  }
  if (url.searchParams.has('error')) {
    failure(res, 'El acceso fue cancelado o no fue autorizado. Puedes intentarlo de nuevo.', secure);
    return;
  }
  const code = url.searchParams.get('code');
  if (!code || code.length > 1024) {
    failure(res, 'El enlace de acceso no contiene una confirmación válida. Vuelve a intentarlo.', secure);
    return;
  }
  try {
    const session = await authExchangeCode(code, stored.verifier);
    if (!session?.access_token || !session?.refresh_token) throw new Error('Sesión incompleta');
    const user = session.user || await authUser(session.access_token);
    if (!user?.id || !user?.email) throw new Error('La cuenta no devolvió un correo válido');
    // La app NUNCA decide el rol. Lo concede la lista autorizada / BD existente.
    const profile = await ensureProfile(user, { email: user.email, name: user.user_metadata?.full_name || user.user_metadata?.name || '' });
    const destination = stored.returnTo === 'admin' && profile?.role === 'admin' ? '/admin' : '/app';
    const safeSession = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: Number(session.expires_in || 3600),
      token_type: 'bearer'
    };
    const nonce = random();
    const script = `try{localStorage.setItem(${safeJson(SESSION_KEY)},JSON.stringify(${safeJson(safeSession)}));sessionStorage.removeItem(${safeJson(SESSION_KEY)});location.replace(${safeJson(destination + '?google=connected')})}catch(e){document.querySelector('#oauth-result').textContent='Tu navegador no permitió guardar la sesión. Regresa al acceso e inténtalo otra vez.'}`;
    writeHtml(res, 200, page('Acceso verificado', '<p id="oauth-result">Preparando tu espacio personal…</p><a href="/app">Ir a la aplicación</a>', nonce, script), expireCookie(secure), nonce);
  } catch (error) {
    // No exponer datos de respuesta de GoTrue, credenciales o tokens al usuario.
    console.error('[GOOGLE OAUTH] No se pudo completar el intercambio:', error?.message);
    failure(res, 'No fue posible iniciar tu sesión en este momento. Revisa tu conexión y vuelve a intentarlo.', secure, 502);
  }
}
