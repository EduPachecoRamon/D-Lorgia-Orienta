/** Origen de autenticación controlado por servidor (nunca por Host/X-Forwarded-Host).
 * En producción no se generan enlaces a localhost, aunque APP_PUBLIC_URL esté mal configurada.
 */
import { config } from '../config.js';

function parsedOrigin(value, allowLocal) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (url.username || url.password || url.search || url.hash || url.pathname !== '/') return null;
    if (url.protocol !== 'https:' && !(allowLocal && isLocal && url.protocol === 'http:')) return null;
    if (isLocal && !allowLocal) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function resolveAuthPublicOrigin(preferredUrl, renderUrl, hosted = false) {
  const preferred = parsedOrigin(preferredUrl, !hosted);
  // Si APP_PUBLIC_URL apunta a localhost por error en Render, usar su URL pública real.
  return preferred || parsedOrigin(renderUrl, !hosted) || null;
}

export function isHostedAuth() {
  return Boolean(process.env.RENDER || process.env.RENDER_EXTERNAL_URL || process.env.NODE_ENV === 'production');
}

export function authPublicOrigin() {
  return resolveAuthPublicOrigin(config.publicUrl, process.env.RENDER_EXTERNAL_URL || '', isHostedAuth());
}

export function confirmationRedirectUrl() {
  const origin = authPublicOrigin();
  if (!origin && isHostedAuth()) {
    throw new Error('No se puede enviar la confirmación: configura APP_PUBLIC_URL con el dominio HTTPS de D’Lorgia.');
  }
  return origin ? `${origin}/app` : null;
}
