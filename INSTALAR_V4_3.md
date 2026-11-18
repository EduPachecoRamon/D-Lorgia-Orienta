# Instalar D’Lorgia v4.3 · Identity & Polish

1. Realiza una copia de seguridad de tu repositorio actual.
2. Descomprime este paquete y copia los archivos de **D-Lorgia-App-v4.3-IDENTITY** a la raíz de `D-Lorgia-App`. Conserva tu carpeta `.git` y tus archivos `.env` privados si están en local.
3. Ejecuta `npm test` → deben pasar **43 pruebas**.
4. Sube los cambios a GitHub y permite que Render complete el despliegue.
5. Abre `/app` y `/admin` con una recarga completa; la nueva caché `dlorgia-orienta-v430-identity` evita servir hojas de estilo de v4.2 por error.
6. Verifica las pantallas con el acceso real y comprueba la conexión a Supabase desde Configuración Admin.

**No hay nuevas variables de entorno ni migraciones SQL para los cambios de identidad v4.3.**

Las tipografías Fraunces y Manrope se cargan desde Google Fonts cuando existe conexión. El sitio mantiene alternativas tipográficas si no pueden descargarse.
