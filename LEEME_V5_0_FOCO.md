# D’Lorgia Orienta v5.0 — Focus PMV

## Qué cambió y por qué

El producto ya **no abre una portada promocional independiente**. Las rutas `/`, `/app` y la antigua `/portada.html` sirven la interfaz de la app. Si una persona no tiene sesión, ve el acceso con correo/Google. Si ya tiene sesión, ve su recorrido.

### 1. Inicio enfocado en el problema del usuario
- **Una tarea principal:** «Empezar mi orientación». La app pregunta por preferencias y organiza información general; no diagnostica.
- Explorar tratamientos es una alternativa secundaria, no cinco tareas principales a la vez.
- Cuando existe una orientación guardada aparecen las opciones de catálogo, Asesor y evaluación. **Antes no compiten por atención.**
- Se conserva una fotografía referenciada al dominio oficial de D’Lorgia. No se han producido fotos de pacientes ni de tratamientos con IA. Si no carga, hay fondo de respaldo.

### 2. Bienvenida animada y accesible de tres pasos
- Se muestra solo a la primera entrada de cada cuenta al navegador (marca almacenada por usuario).
- Navegación «Siguiente», «Atrás», «Ahora no» y cierre; el paso final lleva al Orientador.
- El segundo paso incorpora un **cubo de aristas** con caras que se iluminan al pasar ratón, recibir foco o tocar. Cada cara explica Orientador, Asesor o Evaluación.
- El tutorial se puede repetir desde **Configuración** o **Mi espacio → Preferencias**.
- No bloquea nuevos ingresos si se cierra; respeta `prefers-reduced-motion`.

### 3. Progreso con contexto, no diagnóstico
- Los antiguos paneles grandes de «plan» y «continuidad» ya no ocupan la página Inicio.
- El diálogo de avance aparece **después de guardar una orientación**, o mediante «Ver mi avance» cuando ya hay una.
- Cuenta cuatro acciones digitales reales: cuenta, perfil de orientación, evaluación solicitada y recordatorio guardado. El porcentaje NO es progreso médico ni clínico.
- Si la evaluación aún no está confirmada por D’Lorgia, no se promete que exista una cita.

### 4. Diseño común pero con identidad por área
- Paleta institucional verde/crema/dorado y Fraunces/Manrope.
- Inicio editorial y fotográfico; Orientador con encabezado verde, Catálogo claro, Asesor salvia, Seguimiento cálido.
- Configuración siempre accesible en la barra superior de la app con controles de accesibilidad, ayuda, repetición de la bienvenida y modo **marco de teléfono** opcional en escritorio.
- Ajustado para móvil 390px y escritorio 1440px mediante render estático en Chromium. No se pudo completar navegación visual sobre HTTP local por bloqueo del navegador del entorno.

## Integraciones conservadas
- OAuth Google con Supabase, roles administradores definidos por servidor, inicio por correo, catálogo, asesor, orientación, citas y Admin: no se alteraron sus contratos.
- Supabase y Render no requieren variables nuevas por estos cambios.
- PWA: caché `dlorgia-orienta-v500-enfoque` y recurso `foco-v50.css` actualizados.

## Publicación en GitHub
1. Haz una copia de seguridad del repositorio actual.
2. Descomprime el ZIP completo. **Sube el contenido interno**, no la carpeta envolvente ni el ZIP como único archivo.
3. Verifica que estén `package.json`, `public/index.html`, `public/assets/foco-v50.css`, `public/assets/app-v400.js`, `public/service-worker.js`, `src/server.js` y la carpeta `test` en sus ubicaciones exactas.
4. Confirma que `package.json` dice `5.0.0`.
5. Render (rama `main`, `npm test`, `npm run start`) debería construir de forma automática. No desactives pruebas.
6. En Chrome, actualiza la PWA y, si se ve la versión anterior, cierra la app instalada y recarga la página para renovar su service worker.

## Pruebas realizadas
- **83/83 tests Node.js aprobados** en el entorno local (incluye mock HTTP, OAuth antiguo, rutas y suite v5.0).
- Chromium pudo renderizar el HTML/CSS estáticos a 1440×900 y 390×844, sin desbordamiento horizontal en ambos; inspección estática de la bienvenida hecha.
- La navegación HTTP de Chromium fue bloqueada por políticas de este entorno, por lo cual **no** afirmamos que el flujo UI completo con OAuth y el servidor real esté verificado visualmente.

## Comprobación después de publicar
- `https://d-lorgia-app.onrender.com/` debe abrir **acceso** si no hay sesión y **Inicio** si la hay.
- Primera sesión de una cuenta → bienvenida; segunda sesión → no repite; Configuración → sí repite.
- Termina el Orientador → aparece el panel de progreso con valores reales.
- En móvil: encabezado, botón principal, menú inferior, modales, cubo táctil.
- Pide fotos oficiales con autorización para servirlas como archivos locales; las URLs de imágenes actuales son externas y pueden cambiar.
