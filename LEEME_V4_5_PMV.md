# D’Lorgia Orienta v4.5 — PMV · Bienvenida + difusión + atención

D’Lorgia Orienta es una aplicación web progresiva (PWA) para personas interesadas en cuidado estético, con panel de gestión para D’Lorgia. Esta entrega extiende v4.4.2 sin cambiar la estructura de la base de datos.

## Qué añade

- `welcome`: primera pantalla de introducción para nuevos usuarios, con tres pasos y acceso a ayuda.
- Registro: distingue claramente **cuenta creada con sesión inmediata** y **cuenta que requiere confirmar correo**. No se salta la verificación del correo.
- Enlaces de confirmación tipo GoTrue con `#access_token` y `#refresh_token`: se validan ante el backend antes de crear sesión y se elimina el fragmento de la URL.
- `conoce.html` (`/conoce`): página pública para compartir con usuarios potenciales; utiliza imagen original del proyecto.
- `ayuda.html` (`/ayuda`): preguntas frecuentes accesibles sin cuenta.
- Admin → `Atención`: citas pendientes, orientaciones sin evaluación y enlace de difusión listo para copiar.
- `admin-ayuda.html` (`/admin/ayuda`): guía de uso para el equipo.
- Citas: ya no se responde “horario reservado” cuando no hay conexión a PostgreSQL; se ofrece solicitar información directamente al equipo.
- Se retira el aviso de “Conexión restablecida” que aparecía en el primer acceso, incluso sin pérdida de red previa.
- Caché del Service Worker: `dlorgia-orienta-v450-pmv`.

## Instalación sin nuevas suscripciones

1. Actualiza los archivos de este ZIP en el repositorio y mantén las variables actuales en Render.
2. Conserva Supabase (Auth + Postgres). **No hace falta ejecutar migraciones SQL nuevas**.
3. En Supabase → Authentication → Providers → Email, confirma si está activada **Confirm email**. Lo recomendado para cuentas reales es mantenerlo activado.
4. En Supabase → Authentication → URL Configuration establece `Site URL` con la URL real de tu aplicación (ej. `https://tu-dominio/app`) y añade los redirect URLs permitidos. Verifica la URL con tu despliegue real.
5. Ejecuta `npm test`, y luego desplega con tu flujo habitual.
6. Abre `/conoce` para publicidad, `/ayuda` para usuarios nuevos, `/app` para la PWA, `/admin` para operaciones.
7. En Chrome Android, añade la aplicación a pantalla de inicio usando el menú de Chrome, si el navegador ofrece esa función.

## Cómo funciona el registro

- Si Supabase devuelve un token de acceso y `refresh_token`, se inicia sesión y aparece el recorrido.
- Si Supabase exige confirmar correo, se muestra una pantalla de verificación. **El usuario no está autenticado hasta confirmar**. El enlace puede regresar a `/app` con tokens, que la app valida en `/api/auth/me`.
- Si Supabase no está configurado, el modo local sigue disponible para testeo y se etiqueta claramente como **solo en este dispositivo**.

## Recomendación para el PMV académico

El piloto se puede ejecutar sobre planes gratuitos, sujeto a sus límites de uso y disponibilidad. No se debe prometer que soporta 1000 usuarios simultáneos sin una prueba de carga. El panel administrativo todavía carga listas acotadas y requiere paginación/consultas agregadas para un despliegue de mayor escala.

## Pruebas realizadas

`npm test`: **56/56 pruebas aprobadas** en el entorno de esta entrega, incluyendo simulación del contrato HTTP de Supabase para registro. JavaScript validado con `node --check`; endpoints y recursos verificados por HTTP local. **El navegador Chromium de este entorno bloqueó la dirección localhost por una política organizativa; no se considera una prueba visual E2E completada.** No se ha comprobado conexión con Supabase real ni un despliegue de producción desde esta entrega.

## Privacidad

No copies la clave secreta de Supabase al frontend. No publiques datos sensibles en páginas de marketing. El Asesor es informativo y no diagnostica. Las métricas del Admin sobre listas están limitadas a los registros efectivamente cargados.
