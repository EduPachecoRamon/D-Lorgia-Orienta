# Instalar D’Lorgia v4.4 · Atelier

1. Conserva una copia de seguridad de `main`, tu `.git` y cualquier archivo `.env` privado.
2. Copia el contenido de la carpeta `DLorgia-Orienta-v4.4-ATELIER/` sobre la raíz de tu repositorio actual.
3. Mantén las variables de Supabase ya configuradas en Render: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` y `DLORGIA_ADMIN_EMAILS`. No copies credenciales al frontend.
4. Ejecuta `npm test` (49/49 es el resultado de referencia de esta entrega).
5. Comprueba `/app` y `/admin` antes de desplegar en producción, idealmente en una rama o entorno de vista previa.
6. Publica en GitHub y despliega en Render.
7. Después del despliegue, vuelve a cargar `/app` y `/admin`. La caché v4.4 reemplaza el conjunto anterior; en clientes atascados una recarga forzada del navegador puede actualizar el service worker.

**Base de datos**: no requiere migración nueva. Si una instalación previa aún no ejecutó `supabase/v4_2_migration.sql`, Pulse Analytics seguirá limitado a datos disponibles hasta instalar aquella migración opcional.

## Revisión manual recomendable

- Paciente, escritorio: el marco permanece centrado y no aparece hueco bajo la barra inferior.
- Paciente, móvil: menú inferior visible y anclado incluso tras desplazarse hasta el final de Mi espacio.
- Navegación: Inicio, Tratamientos, Orientador, Asesor, Seguimiento y Mi espacio.
- Ajustes de accesibilidad: aumentar texto, contraste y detener movimiento; recargar y comprobar persistencia.
- Admin: login, sidebar, banner, métricas, citas, pacientes, tratamientos y notificaciones.
- Errores: comprobar red desconectada, formularios incompletos y sesión caducada sin mostrar información técnica.
