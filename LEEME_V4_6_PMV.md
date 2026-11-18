# D’Lorgia Orienta v4.6 — PMV viable, roles y galería oficial

**Punto de partida:** ZIP completo v4.5. No es un parche aislado.

## Páginas y marcos de trabajo

### Públicos (sin cuenta)

- `/conoce`: la propuesta de valor, accesos a la app y a servicios y sedes.
- `/experiencias`: 12 fotografías referenciadas en el sitio oficial, por categoría. Abre las páginas oficiales para ampliar información.
- `/sedes`: Huancayo, Piura y Pucallpa; enlaces de contacto oficiales.
- `/ayuda`: acceso, registro, orientación, citas e instalación PWA.

### Pacientes

- `/app`: registro, inicio de sesión, bienvenida, Orientador, catálogo, detalle de tratamiento, Asesor, seguimiento, evaluaciones y Mi espacio.
- El catálogo ahora ofrece fotos contextualizadas y enlaces a la galería oficial.
- El registro de un usuario **nunca** asigna rol de administrador. Si Supabase requiere confirmar correo, el acceso espera la verificación. Si Supabase entrega sesión inmediata, la app la utiliza.

### Administradores

- `/admin`: Resumen, Citas, Pacientes, Orientaciones, Tratamientos, Configuración, Atención y **Equipo y permisos**.
- La sección **Equipo y permisos** incluye un directorio con paginación de 25 cuentas, cambios de rol con confirmación, defensa contra retirada del propio acceso y auditoría.
- Todas las rutas de cambio de rol requieren sesión válida y rol `admin`, verificados por el backend.
- No es necesario crear otra tabla ni pagar una plataforma adicional de cuentas: se utiliza Supabase Auth con `public.profiles.role`.

## Cómo asignar administradores por primera vez

1. En Render conserva `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` y `SUPABASE_SECRET_KEY` (solo en el servidor).
2. Configura `DLORGIA_ADMIN_EMAILS` con el correo verificado de la gerencia para el primer acceso. Nunca publiques claves de servicio ni contraseñas.
3. La gerencia crea su cuenta desde `/app` y confirma el correo si Supabase lo pide.
4. La gerencia accede a `/admin` con la misma cuenta.
5. Los demás miembros crean sus cuentas normalmente; desde **Equipo y permisos** se les asigna rol de administrador cuando corresponda.
6. Para retirar acceso, usar la misma sección, excepto la cuenta propia y las cuentas principales protegidas por `DLORGIA_ADMIN_EMAILS`.

**Importante:** no se debe permitir elegir «admin» durante el registro ni convertir ese rol mediante parámetros de usuario. Supabase RLS prohíbe que los pacientes actualicen su columna `role`.

## Fotografías y derechos

Las 12 referencias fotográficas están **enlazadas directamente** al dominio de `www.dlorgia.com`; no se copiaron al ZIP. Esto evita consumo de almacenamiento y mantiene enlaces a la fuente oficial. Si una imagen falla por cambio de URL, política de hotlinking o pérdida de conexión, se utiliza el fondo artístico local de D’Lorgia incluido previamente. Algunas fotos pueden no abrirse si el sitio restringe enlaces desde terceros.

Para publicar una versión comercial, solicitar autorización de D’Lorgia para usar/almacenar sus fotografías, obtener un paquete de imágenes aprobado y sustituir los enlaces remotos por copias optimizadas. Verificar precios, direcciones y disponibilidad con la empresa; no se garantiza que los contenidos públicos permanezcan iguales.

Fuentes consultadas para estructura e imágenes:
- https://www.dlorgia.com/
- https://www.dlorgia.com/especialidades/
- https://www.dlorgia.com/conocenos/
- https://www.dlorgia.com/contactanos/
- https://www.dlorgia.com/tratamientos-faciales/

## Viabilidad del PMV

El objetivo del piloto no es «una clínica automatizada», sino **orientar a las personas, organizar solicitudes y facilitar la atención**.

| Componente | Piloto de bajo costo | Límite a vigilar |
|---|---|---|
| Render Free | $0/mes si se respetan las condiciones | Suspende el servidor después de inactividad; no garantiza atención 24/7 |
| Supabase Free | $0/mes si se respetan las cuotas | Límite de DB/Auth, proyectos inactivos, no garantizado para producción |
| API de IA | Solo modelos/cupos gratuitos cuando estén disponibles | Uso, cuotas y reglas actuales; no siempre gratis |
| PWA instalable | $0 de inscripción en tiendas | No equivale automáticamente a publicación en Play Store o App Store |
| Fotografías referenciadas | Sin storage adicional | Dependencia de la fuente + autorización para publicación comercial |

**No asumir** capacidad de 1.000 usuarios simultáneos sin carga real. El directorio del Admin usa paginación, pero otras listas heredadas siguen teniendo `limit=200` y requieren ampliación para operaciones de gran escala. Los costos de desarrollo, supervisión humana, mantenimiento, privacidad y comunicaciones no son cero.

## Validación funcional realizada

- Pruebas unitarias y de integridad del proyecto ejecutadas mediante `npm test`.
- Prueba de integración HTTP con Supabase **simulado**: acceso paciente denegado al Admin (`403`), promoción de rol por un Admin, acceso posterior y protección de autodegradación (`409`).
- HTTP 200 para `/conoce`, `/experiencias`, `/sedes`, `/ayuda`, `/admin`, `/app` y recursos nuevos.
- Prueba visual completa en Chromium no disponible en este entorno: quedó pendiente capturar y comparar móvil/escritorio y verificar carga de fotos en el navegador real.

## Instalación

1. Descomprimir el ZIP sobre una copia del repositorio (respetar `.git` y `.env`).
2. `npm test` y `npm start`.
3. No requiere nuevas migraciones SQL si ya se aplicó el esquema v4 de roles y la migración v4.2; si tu base no tiene esos objetos, aplicar `supabase/schema.sql` en una base nueva o las migraciones correspondientes con respaldo.
4. Subir a GitHub y desplegar en Render.
5. Recargar `/app` y `/admin` una vez para actualizar el service worker v4.6.
6. Probar con dos correos distintos: uno en `DLORGIA_ADMIN_EMAILS` y otro no incluido.
7. Revisar `/experiencias` desde un navegador con conexión; solicitar fotos aprobadas si los enlaces oficiales no funcionan.
