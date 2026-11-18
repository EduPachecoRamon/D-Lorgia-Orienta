# D’Lorgia v4.4 — Atelier / Verificación de identidad

## Diagnóstico del problema original

1. El CSS heredado daba al shell del paciente un `padding-bottom:86px`. Esto producía un hueco visible bajo un dock que parecía anclado, pero no lo estaba al marco.
2. La barra inferior empleaba `position:fixed` en el viewport, en vez de ser parte de la estructura flex de la aplicación, creando inconsistencias en escritorio.
3. Una regla tardía cambiaba `.intro-curtain` de `position:fixed` a `position:relative`; la cortina transparente podía permanecer en el flujo y reservar espacio encima de Admin.
4. La clase `.data-flash` anulaba la animación `.reveal` de las tarjetas KPI, que mantenían `opacity:0`; por eso parecían desaparecer.
5. El funnel usaba columnas demasiado estrechas y truncaba etapas importantes.
6. Mi espacio priorizaba un formulario largo antes del estado y el recorrido de la persona.

## Soluciones implementadas

- Shell paciente flex vertical con alto dinámico `100dvh`, un `main` desplazable y un dock inferior dentro del marco, sin relleno fantasma.
- En escritorio: marco centrado de 560 px, borde refinado y fondo ambiental también visible fuera de él; en móvil: marco de ancho completo.
- Capa de motivos dermatológicos SVG no interactiva que cubre el alto completo del shell y preserva su opacidad semántica.
- Imagen original D’Lorgia, optimizada como WebP de menos de 100 KB; fondo editorial con contraste localizado para texto.
- Mi espacio reorganizado con prioridad de información real y privacidad accesible en una sección secundaria, no un aviso que interrumpe al abrir.
- Admin con un hero visual propio, navegación más reconocible, tarjetas KPI visibles, conversiones completas, navegación sin hueco superior y opciones de lectura.

## Verificación ejecutada

- `npm test`: **49/49**.
- Comprobación de sintaxis de `src/server.js`, `public/assets/app-v400.js`, `admin-v420.js` y `dlorgia-admin-a11y.js`: correctas.
- Renderizado de HTML y CSS reales en Chromium a 1440×900, 390×844 y 360×750.
- Verificación geométrica: la barra inferior del paciente conserva la posición vertical antes y después de desplazarse por el contenido; la capa ambiental cubre el marco completo.
- Ejecución del JavaScript real en Chromium usando endpoints simulados en memoria: entrada como invitado, onboarding, Mi espacio con estadísticas, navegación a Tratamientos, accesibilidad; carga y navegación Admin con sesión simulada, alertas y KPIs.
- Consola JS en los flujos anteriores: sin errores no capturados.

## Límites honestos

La automatización con Chromium se ejecutó en un documento de prueba sin navegación externa porque el navegador del entorno bloquea URLs locales. Las capturas y el backend de prueba **no verifican** el despliegue en Render, métricas con la base real, compatibilidad exhaustiva entre navegadores ni cumplimiento WCAG 2.2 completo. Los datos de capturas son simulados para revisar disposición.

## Fuentes que informaron las decisiones

- Google web.dev: https://web.dev/articles/animations-guide (evitar layouts y repintados en animación).
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/ (control del movimiento, tamaño de objetivos y foco visible).
- MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/length#dynamic_viewport_units (viewport dinámico en móviles).
- Aesop: https://www.aesop.com/ (ritmo editorial, no copia de identidad).
- Linear: https://linear.app/now/behind-the-latest-design-refresh (disciplina de interfaz).
- Headspace: https://www.headspace.com/ (cercanía visual en bienestar).

No se incorporaron fotografías ni identidad gráfica de esas marcas. La imagen D’Lorgia en `dlorgia-atmosphere.webp` es una composición nueva generada para este proyecto.
