/**
 * Comprueba endpoints públicos de D’Lorgia sin credenciales y sin modificar datos.
 * Uso: node scripts/comprobar-integraciones.mjs https://dominio-real
 * No indica que Google Cloud ni Supabase estén configurados: sólo verifica señales visibles.
 */
import { URL } from 'node:url';
const requested = process.argv[2] || process.env.APP_PUBLIC_URL || process.env.RENDER_EXTERNAL_URL;
if (!requested) {
  console.error('Indica la URL HTTPS publicada: node scripts/comprobar-integraciones.mjs https://tu-dominio');
  process.exitCode = 1;
} else {
  let origin;
  try {
    const url = new URL(requested);
    const local = ['localhost','127.0.0.1'].includes(url.hostname);
    if (url.pathname !== '/' || url.username || url.password || url.search || url.hash || !(url.protocol === 'https:' || local && url.protocol === 'http:')) throw Error('URL de origen inválida');
    origin = url.origin;
  } catch {
    console.error('Usa el origen HTTPS de la web, sin ruta, usuario ni parámetros.');
    process.exitCode = 1;
  }
  if (origin) {
    const tests = [
      { path:'/health', title:'Servidor' },
      { path:'/api/auth/google/status', title:'Botón Google configurado' },
      { path:'/sitemap.xml', title:'Mapa del sitio' },
      { path:'/robots.txt', title:'robots.txt' },
      { path:'/', title:'Verificación Search Console' },
      { path:'/conoce', title:'Página pública' }
    ];
    for (const item of tests) {
      try {
        const response = await fetch(origin + item.path, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'DLorgia-SanityCheck/1.0' } });
        const body = await response.text();
        let message = `HTTP ${response.status}`;
        if (item.path === '/api/auth/google/status' && response.ok) {
          try { message += JSON.parse(body).available ? ' · habilitado localmente (proveedor real por verificar)' : ' · todavía desactivado'; }
          catch { message += ' · respuesta no válida'; }
        }
        if (item.path === '/' && response.ok) message += body.includes('name="google-site-verification"') ? ' · etiqueta presente' : ' · sin etiqueta de verificación';
        if (item.path === '/sitemap.xml' && response.ok) message += body.includes('<urlset') ? ' · XML correcto' : ' · contenido inesperado';
        console.log(`${response.ok ? '✓' : '○'} ${item.title}: ${message}`);
      } catch (error) {
        console.log(`○ ${item.title}: no disponible (${error.name === 'TimeoutError' ? 'tiempo agotado' : 'conexión fallida'})`);
      }
    }
    console.log('\nEstos resultados NO prueban el login con Google ni la autoridad sobre el dominio. Prueba con cuentas reales autorizadas desde el navegador.');
  }
}
