# D’Lorgia — Integraciones v4.7.1 · Guía de activación

**Estado al entregar:** código preparado; NO se activaron Google Cloud, Supabase, Render ni Search Console sobre cuentas reales. El acceso a esas cuentas y la aprobación de imágenes corresponden al titular autorizado.

## 1. Primero: crear el acceso con Google

### Google Cloud (proyecto administrado por D’Lorgia)

- Abrir https://console.cloud.google.com/ y seleccionar/crear el proyecto de la empresa.
- En **Google Auth Platform** configurar **Branding** (nombre D’Lorgia Orienta, correo de soporte y datos exigidos), **Audience** (External si entran pacientes) y scopes mínimos de login (`openid`, `email`, `profile`, según la configuración del proveedor).
- En **Clients**, crear un cliente **Web application**.
- En **Authorized redirect URIs**, copiar **exactamente** la URL de callback de Supabase: `https://<PROJECT_REF>.supabase.co/auth/v1/callback` (el valor real aparece en Supabase). **No registrar `/api/auth/google/callback` aquí**.
- Si la aplicación está en modo **Testing**, agregar sólo las cuentas de pruebas autorizadas como Test users. No falsear datos ni saltar controles de Google.
- Guardar el **Client ID** y el **Client Secret** directamente en Supabase; nunca en GitHub, ZIPs ni chats.

### Supabase Auth

- Abrir **Authentication → Providers → Google** y activarlo con el Client ID/Secret.
- Abrir **Authentication → URL Configuration** y agregar a los redirect allowlisted:
  `https://<TU_DOMINIO>/api/auth/google/callback*`
  Si el panel lo permite, es preferible una URL exacta cuando se conozca la política de Supabase: `https://<TU_DOMINIO>/api/auth/google/callback`.
- Definir la URL principal de la app. Mantener email/contraseña como alternativa.
- Verificar que el primer admin esté autorizado en el backend. Google no decide roles y un paciente no debe poder darse privilegios.

### Render

En **Environment**, conservar todas las variables existentes y añadir:

```env
APP_PUBLIC_URL=https://<TU_DOMINIO>
GOOGLE_OAUTH_ENABLED=true
```

- El dominio debe ser el origen real HTTPS sin `/app` ni `/admin`.
- El Client Secret de Google **no va en Render**: está almacenado en Supabase.
- Lanzar un nuevo deploy y probar `https://<TU_DOMINIO>/api/auth/google/status`. `available: true` sólo confirma que la opción local está habilitada.

## 2. SEO y Search Console

- D’Lorgia autoriza qué dominio utilizará para la difusión.
- En https://search.google.com/search-console agregar **propiedad de prefijo de URL** para `https://<TU_DOMINIO>/` (no la propiedad DNS de `onrender.com`, que pertenece a Render).
- Si Google ofrece **etiqueta HTML**, copiar **solo el valor `content` de `google-site-verification`**, que es público, a Render → Environment como:

```env
GOOGLE_SITE_VERIFICATION=VALOR_PUBLICO_DE_GOOGLE
```

- Desplegar: la etiqueta aparecerá en el HTML servido desde `/` y las demás páginas. Pulsar **Verificar** desde la cuenta autorizada de Search Console.
- Enviar `https://<TU_DOMINIO>/sitemap.xml`. Si no hay `APP_PUBLIC_URL` válido, el sitemap devuelve 503.
- No publicar en Google una URL que no pertenezca o no haya sido autorizada por la empresa.

## 3. Fotografías institucionales

- La gerencia entrega o autoriza **por escrito** las fotografías seleccionadas y define qué contenido puede publicarse. Obtener autorización de personas identificables en las fotos cuando corresponda.
- Preparar 12 archivos optimizados `.webp`/`.jpg`/`.png` con nombres admitidos por `scripts/instalar-fotos-autorizadas.mjs`, por ejemplo `colormax-acne.webp`, `botox.webp`.
- Ejecutar localmente: `node scripts/instalar-fotos-autorizadas.mjs /ruta/a/fotos-aprobadas` y luego `npm test`.
- El importador sustituye los enlaces externos por assets locales en las vistas de catálogo y difusión. No se incorpora ninguna foto de terceros al ZIP sin permiso.
- Publicar con los mismos archivos estáticos, sin nuevo pago mensual por alojamiento de imágenes.

## 4. Pruebas obligatorias

- En Render comprobar `/health`, `/api/auth/google/status`, `/sitemap.xml`, `/conoce`, `/robots.txt` y página raíz.
- Para tener un resumen automático: `node scripts/comprobar-integraciones.mjs https://<TU_DOMINIO>`.
- Probar Google con una cuenta de paciente **de prueba**, verificar que se crea `profile.role='patient'`, completar bienvenida y cerrar/volver a abrir sesión.
- Intentar `/admin` desde esa cuenta: debe mostrar acceso denegado; sólo el admin autorizado debe poder abrirlo.
- Probar también correo/contraseña, confirmación, recuperación y sesión expirada.
- Comprobar en Chrome Android que la instalación PWA conserve sesión, diseño e iconos.
- Probar fotografías y descripciones en móvil y escritorio.

## 5. Lo que sigue pendiente por definición

La creación de clientes OAuth, activación del proveedor, cambios de Render, verificación del sitio y permisos de imágenes requieren acceso/autorización de los titulares correspondientes. Son tareas de configuración **real**, no pueden darse por terminadas únicamente por ejecutar el proyecto o pasar pruebas simuladas.

Fuentes oficiales:
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/redirect-urls
- https://developers.google.com/identity/protocols/oauth2/production-readiness/overview
- https://support.google.com/webmasters/answer/9008080
