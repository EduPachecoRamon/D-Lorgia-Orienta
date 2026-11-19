// SEO público centralizado: páginas de difusión, nunca perfiles ni Admin.
const publicPages = Object.freeze({
  '/conoce': { title: 'Conoce D’Lorgia Orienta', description: 'Descubre cómo explorar tratamientos, aclarar dudas y organizar una evaluación profesional con D’Lorgia.' },
  '/experiencias': { title: 'Servicios y experiencias | D’Lorgia Orienta', description: 'Explora servicios de cuidado facial, tecnología, cuerpo y cabello para preparar tu orientación.' },
  '/sedes': { title: 'Sedes y contacto | D’Lorgia Orienta', description: 'Encuentra información pública de las sedes de D’Lorgia y consulta directamente cómo solicitar una evaluación.' },
  '/guia': { title: 'Guía para empezar | D’Lorgia Orienta', description: 'Aprende a crear una cuenta, explorar el Orientador y preparar una evaluación con el equipo de D’Lorgia.' },
  '/ayuda': { title: 'Centro de ayuda | D’Lorgia Orienta', description: 'Aprende a crear tu cuenta, acceder a la aplicación y recorrer las herramientas de orientación y seguimiento.' }
});
export function publicPagesForSitemap(){ return Object.keys(publicPages); }
export function escapeXml(value) { return String(value).replace(/[<>&"']/g, x => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;' })[x]); }
export function sitemapXml(origin) {
  if (!origin) return null;
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    publicPagesForSitemap().map(p => `  <url><loc>${escapeXml(origin + p)}</loc></url>`).join('\n') + '\n</urlset>\n';
}
export function robotsTxt(origin) {
  return `User-agent: *\nDisallow: /\nAllow: /conoce\nAllow: /experiencias\nAllow: /sedes\nAllow: /ayuda\nAllow: /guia\nDisallow: /admin\nDisallow: /app\nDisallow: /api/\nDisallow: /auth/\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`;
}
export function seoHeadFor(pathname, origin) {
  const data = publicPages[pathname];
  if (!data) return '';
  const parts = [
    '<meta name="robots" content="index, follow">',
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="es_PE">',
    `<meta property="og:title" content="${escapeXml(data.title)}">`,
    `<meta property="og:description" content="${escapeXml(data.description)}">`,
    '<meta property="og:image" content="/assets/icons/icon-512.png">',
    '<meta name="twitter:card" content="summary_large_image">'
  ];
  if (origin) {
    parts.push(`<link rel="canonical" href="${escapeXml(origin + pathname)}">`);
    parts.push(`<meta property="og:url" content="${escapeXml(origin + pathname)}">`);
    parts[5] = `<meta property="og:image" content="${escapeXml(origin + '/assets/icons/icon-512.png')}">`;
  }
  return parts.join('');
}

/** Search Console: token público de propiedad URL-prefix, nunca un secreto OAuth. */
export function searchConsoleVerificationTag(rawToken = '') {
  const token = String(rawToken || '').trim();
  if (!/^[A-Za-z0-9_-]{8,200}$/.test(token)) return '';
  return `<meta name="google-site-verification" content="${token}">`;
}
