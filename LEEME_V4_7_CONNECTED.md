# D’Lorgia Orienta v4.7 — Connected

## Qué quedó construido

1. **Google Sign-In con OAuth 2.0 PKCE**: inicia en `/api/auth/google/start`, verifica el intento usando cookie `HttpOnly` y `state`, intercambia el código con Supabase, valida el usuario y crea/recupera su perfil. No se confía en un rol suministrado por el navegador ni se exponen credenciales Google al cliente.
2. **Acceso para paciente y Admin**: el mismo sistema de Supabase Auth; los administradores siguen requiriendo un rol concedido desde el servidor / equipo autorizado. Un paciente que pulse Google desde Admin será enviado a la app del paciente, no se autopromueve.
3. **Acceso tradicional conservado**: email/contraseña, confirmación por correo, recuperación y sesiones existentes. Google aparece solo cuando se configura.
4. **Buscador del catálogo** por nombres, categorías, objetivos y texto de tratamientos. No depende de una API de búsqueda de pago.
5. **Buscador en galería** y filtros de servicios con fotos referenciadas del sitio de D’Lorgia.
6. **SEO público**: metadatos Open Graph, canonical por configuración, `robots.txt` y `sitemap.xml` con cuatro páginas de difusión; pantallas privadas fuera del sitemap.
7. **Admin → Difusión**: mensajes, enlaces a páginas públicas y botones de copiar para campañas en redes/QR. No añade servicios de pago.
8. **Importación local de fotografías autorizadas**: script `scripts/instalar-fotos-autorizadas.mjs` permite sustituir las imágenes hotlink por fotos aprobadas en archivos estáticos.
9. **PWA actualizada**: cache `v470-connected` y nuevas hojas/JS prealmacenados.

## PASOS QUE REQUIEREN ACCESO DEL PROPIETARIO (NO LOS HACE EL ZIP)

### A. Google Cloud

1. Abrir Google Cloud Console / Google Auth Platform.
2. Crear o escoger un proyecto, configurar nombre de producto, correo de soporte y consent screen para usuarios externos, según la política vigente.
3. Crear **OAuth Client ID de tipo Web application**.
4. En **Authorized redirect URIs** registrar la dirección de retorno de Supabase Auth (no la ruta de nuestra aplicación):
   `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
5. Copiar el Client ID y Client Secret **directamente a Supabase**, nunca a este repositorio ni al chat.

### B. Supabase → Authentication

1. Providers → Google → Enable; pegar Client ID y Secret del proyecto Google.
2. URL Configuration → Redirect URLs → añadir:
   `https://<DOMINIO-APP>/api/auth/google/callback*`
3. Dejar el email/contraseña activo si se desea el segundo método.
4. No habilitar autoasignación de administrador; los roles siguen en `public.profiles`.
5. Verificar que `public.profiles` y la configuración existente funcionan antes de probar Google.

### C. Render (variables no secretas nuevas)

```env
APP_PUBLIC_URL=https://<DOMINIO-APP>
GOOGLE_OAUTH_ENABLED=true
```

**IMPORTANTE:** `APP_PUBLIC_URL` es el origen real de la web, sin `/app` ni `/admin` (puede finalizar en `/`). La app acepta HTTPS; para pruebas locales admite HTTP únicamente en localhost/127.0.0.1. Se puede usar `RENDER_EXTERNAL_URL` si Render lo proporciona.

El resto de variables existentes se conserva (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `DLORGIA_ADMIN_EMAILS`). **No imprimir ni subir secretos.**

Después de desplegar, comprobar `/api/auth/google/status`: debe devolver `{"available":true}`. Esto comprueba **solo la configuración local del backend**, no confirma que el proveedor Google esté activo en Supabase.

### D. Prueba real de usuario

1. Abrir `/app` en Chrome/Edge, pulsar **Continuar con Google**.
2. Elegir una cuenta de prueba, autorizar y verificar que el usuario entra y puede completar la bienvenida.
3. En Admin → Equipo y permisos comprobar que esa cuenta aparece como `patient`.
4. Sin conceder rol, intentar `/admin`: **no debe entrar**.
5. Un admin autorizado puede asignar un rol según el proceso ya definido en v4.6; probar la entrada con Google desde `/admin` después de validar el rol.
6. Comprobar citas, Orientador, Asesor, sesión expirada, logout, refresh token y PWA instalada.

## SEO y Google Search

- El archivo `sitemap.xml` se genera en el servidor **solo si** `APP_PUBLIC_URL`/`RENDER_EXTERNAL_URL` es válido.
- Páginas indexables: `/conoce`, `/experiencias`, `/sedes`, `/ayuda`.
- Las páginas de cuenta y Admin se excluyen para evitar mostrar contenido privado en buscadores.
- Cuando exista autorización para la marca, quien controla el dominio deberá **verificarlo en Google Search Console** y enviar `https://<DOMINIO-APP>/sitemap.xml`.
- Estar en el sitemap no garantiza aparecer en Google.
- El buscador **dentro de la app** funciona localmente sobre catálogo/galería y no consume cuota de Google.

## Imágenes de la empresa

- v4.6 ya enlazaba fotografías del sitio oficial; esta versión conserva esas referencias y mejora la búsqueda.
- No hemos descargado ni redistribuido fotos de la empresa: sin autorización no es adecuado hacerlo.
- Si la gerencia entrega fotos con derechos de uso: optimizarlas en JPEG/WebP y guardarlas en una carpeta aparte, con nombres indicados en `public/assets/fotos-oficiales/LEEME.txt`.
- Correr `node scripts/instalar-fotos-autorizadas.mjs /carpeta/imagenes` y verificar que `/conoce`, `/experiencias`, `/sedes` y `/app` las muestran. Los archivos quedarán dentro de `public/assets/fotos-oficiales/`.
- No es necesario contratar Supabase Storage para un catálogo pequeño y estable de fotografías públicas.

## Verificación de desarrollo

```bash
npm test
node --check src/server.js
node --check src/services/google-oauth.js
node --check public/assets/app-v400.js
```

**67/67 pruebas** al crear esta versión, incluidas simulaciones HTTP del callback y seguridad del estado PKCE. **Pendiente:** prueba con Google/Supabase reales después de configurar los servicios en la empresa y prueba visual completa en varios dispositivos. No se ha realizado despliegue automático de esta entrega.


## 4.7.1 · Configuración Search Console y validación

Consultar `CONFIGURACION_GUIADA_GOOGLE.md` para Google Cloud, Supabase, Render, Search Console, fotografías autorizadas y comprobación externa. Configurar `GOOGLE_SITE_VERIFICATION` en Render para inyectar la etiqueta HTML pública de la propiedad URL-prefix; ejecutar `node scripts/comprobar-integraciones.mjs https://tu-dominio` para las verificaciones HTTP sin credenciales.
