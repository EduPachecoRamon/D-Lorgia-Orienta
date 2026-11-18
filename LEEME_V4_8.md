# D’Lorgia Orienta v4.8 — Primera experiencia

## Cambios
- `/` ahora es una portada pública independiente con descripción de valor, galería ilustrada y cubo 3D interactivo (hover, foco de teclado y táctil mediante pestañas).
- `/app` conserva Google Sign-In y correo, pero muestra **solo** el acceso mientras el usuario no haya ingresado; el resto de pantallas queda fuera de la vista.
- `?mode=register` abre directamente Crear cuenta; `?mode=login` abre Ingresar. Cambiar de modo conserva el correo cuando corresponde.
- Google crea o recupera una cuenta mediante Supabase; para email/contraseña, un error de ingreso ofrece registro sin crear cuentas en secreto.
- Ilustraciones locales originales SVG, que **no son fotos clínicas ni resultados de pacientes**. Para fotos reales, solicitar autorización escrita y usar `node scripts/instalar-fotos-autorizadas.mjs <carpeta>`.
- `service-worker.js` y caché PWA actualizados. El registro del SW ahora fuerza revisión de la nueva versión.
- Se preservan rutas, Google OAuth, roles y datos de la versión 4.7.1.

## Qué falta para una publicación oficial
1. Confirmar con D’Lorgia derechos y archivos de imágenes reales, además de nombre/logo y textos oficiales.
2. Probar en teléfonos reales el acceso por Google y por correo, la confirmación de correo y las rutas principales.
3. No se ejecutan migraciones SQL nuevas. No se requieren suscripciones adicionales por estas mejoras.

## Ejecutar
`npm test` y `npm start`. Acceder a `/` para la portada, `/app?mode=register` para crear cuenta, `/app?mode=login` para ingresar.

**Privacidad y seguridad:** no guardar secretos OAuth en GitHub, no conceder Admin desde el formulario, no prometer diagnóstico médico. El nuevo cubo no consulta servicios externos.

## Fotografías opcionales para portada
Con autorización de la empresa, nombrar los archivos `portada-piel.webp`, `portada-cuidado.webp`, `portada-orientacion.webp`, `portada-consulta.webp`, `portada-evaluacion.webp` y `portada-empresa.webp` (también JPEG/PNG). El importador los copiará al sitio y sustituirá las ilustraciones SVG. No incluyas fotografías de pacientes sin autorización válida.
