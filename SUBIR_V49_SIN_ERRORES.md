# Publicación segura de D’Lorgia Orienta v4.9

**Repositorio correcto:** https://github.com/EduPachecoRamon/D-Lorgia-Orienta

**Importante:** no se ha publicado esta versión en GitHub/Render. El proyecto adjunto está listo para subir; la integración con Supabase/Google se conserva.

## Opción recomendada: GitHub Desktop

1. Abre GitHub Desktop y clona `EduPachecoRamon/D-Lorgia-Orienta` en una carpeta de tu computadora (si ya está clonado, usa esa carpeta).
2. Descomprime el ZIP **fuera** de la carpeta Git y abre su carpeta interna `DLorgia-Orienta-v4.9-INSTITUCIONAL`.
3. Selecciona **el contenido** de esa carpeta: `public`, `src`, `test`, `scripts`, `package.json`, etc., y cópialo **dentro de la raíz** del repositorio clonado, reemplazando archivos antiguos. No copies la carpeta contenedora ni un ZIP.
4. Verifica en la carpeta del repositorio que existan `public/portada.html`, `public/guia.html`, `public/service-worker.js`, `public/assets/portada-v49.css`, `public/assets/portada-v49.js` y `package.json` con versión `4.9.0`.
5. En GitHub Desktop, revisa que las nuevas rutas estén dentro de `public` y pulsa **Commit to main** con mensaje `v4.9: identidad institucional, guia y cubo interactivo`.
6. Pulsa **Push origin** una sola vez.
7. Render detecta el commit automáticamente. Usa `npm test` en Build y `npm run start` en Start. Espera el estado `Live` y verifica los resultados de las pruebas (78/78 en la evaluación local de esta entrega).

## ¿Qué comprobar después de publicar?

- https://d-lorgia-app.onrender.com/ → portada editorial, fotos referenciadas, cubo interactivo.
- https://d-lorgia-app.onrender.com/app?mode=register → registro, sin botón invitado.
- https://d-lorgia-app.onrender.com/app?mode=login → acceso con correo y Google.
- https://d-lorgia-app.onrender.com/guia → guía pública en tres pasos.
- https://d-lorgia-app.onrender.com/experiencias → catálogo.
- https://d-lorgia-app.onrender.com/admin → panel, solo con cuenta autorizada.

Si algún dispositivo sigue mostrando la PWA anterior, cierra y vuelve a abrir la app e instala la actualización; si continúa, borra la caché del sitio desde la configuración del navegador. Nunca elimines o publiques las claves secretas de Render/Supabase.

## Fotografías reales

Las fotografías de portada todavía son referencias remotas (`www.dlorgia.com`), **no fotos originales empaquetadas**. Por favor revisa `FOTOGRAFIAS_D_LORGIA_V49.md` para conseguir los archivos autorizados y reemplazar los enlaces. El proyecto no paga un servicio fotográfico nuevo.
