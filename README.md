# D’Lorgia Orienta · v4.7 Connected

Web app / PWA de orientación estética, exploración de tratamientos, solicitud de evaluación y panel administrativo para D’Lorgia.

**Empieza por [LEEME_V4_7_CONNECTED.md](LEEME_V4_7_CONNECTED.md)** para activar Google Sign-In, Search Console, fotos autorizadas y comprobar la instalación.

## Funciones destacadas

- Registro Supabase Auth con email y **Google OAuth PKCE listo para configurar**, sin cuentas administrativas automáticas.
- Dos roles (`patient`, `admin`) validados en el backend. Gestión de permisos desde Admin.
- Búsqueda gratis en el catálogo y galería; fotografías oficiales enlazadas con respaldo.
- Páginas de promoción `/conoce`, `/experiencias`, `/sedes`, `/ayuda` con SEO público y mapa del sitio.
- **Admin → Difusión** con enlaces copiables para campañas y material original del proyecto.
- Orientador, Asesor, citas, preferencias y seguimiento preservados.
- PWA Android/Chrome instalable sin publicar en una tienda.

## Ejecución

```bash
npm test
npm start
```

Rutas: `/app`, `/admin`, `/conoce`, `/experiencias`, `/sedes`, `/ayuda`, `/robots.txt`, `/sitemap.xml` (este último requiere `APP_PUBLIC_URL`).

La implementación mantiene la infraestructura existente; el PMV puede evaluarse dentro de límites gratuitos, pero eso no garantiza disponibilidad continua ni una carga específica de usuarios simultáneos. Fotografías de D’Lorgia requieren autorización para alojamiento propio; Google OAuth necesita configuración del propietario.


## Preparación de integraciones v4.7.1

Ver `CONFIGURACION_GUIADA_GOOGLE.md` para Google Cloud, Supabase, Render, Search Console y fotos oficiales. Verificar el sitio público con `npm run check:integrations -- https://tu-dominio`, sin necesitar credenciales.
