# Instrucciones duraderas para asistentes que trabajen en D’Lorgia

Objetivo del proyecto: mejorar la experiencia paciente y administrador sin romper lógica funcional, navegación, roles ni contratos API.

**Antes de editar:**
- Inspecciona el repositorio/ZIP real, estructura, `package.json`, tests, assets de ambas apps y service worker.
- Revisa `00_BRIEF_MAESTRO_DLORGIA.md`, `02_SISTEMA_DE_DISENO.md` y `dlorgia.tokens.json` si están en el repo.
- Distingue claramente hallazgos verificados, hipótesis y decisiones propuestas.

**Reglas de producto:**
- La interfaz debe sentirse como un producto final para usuarios; no mostrar en UI notas de desarrollo, nombres de variables, mensajes SQL/stack traces ni cifras inventadas.
- Prioridad: organización, identidad visual, animación fiable, mensajes humanos, accesibilidad, consistencia entre paciente/admin.
- Tipografía propuesta: Fraunces para encabezados; Manrope para interfaz, previa comprobación visual y rendimiento.
- No usar dorado claro para texto pequeño sobre crema.
- Iconos funcionales consistentes; motivos ambientales SVG de marca en capa independiente.
- Respetar `prefers-reduced-motion`. Mantener opacidad de elementos funcionales completamente legible.
- Preservar datos y privacidad: nunca exponer secretos Supabase, ni respuestas sensibles en analytics innecesariamente.
- No confundir orientación estética con diagnóstico médico.
- No migrar de framework solo por diseño.

**Buenas prácticas técnicas:**
- Centraliza tokens, feedback, layout y motion en archivos compartidos; evita duplicar CSS por número de versión.
- Probar estados de carga, vacío, error, éxito, sesión expirada y red desconectada.
- Revisar conflictos de z-index/stacking/overflow y caché de service worker cuando un efecto falle.
- No declarar un endpoint «en vivo» sin prueba externa adecuada. Nunca afirmar que se hizo deploy si no se comprobó.

**Terminado cuando:**
1. Las pruebas existentes pasan o se documentan los fallos heredados.
2. Nuevas funciones se prueban en navegador (no solo `node --check`).
3. Se verifican layouts móvil/escritorio y cambios visuales con capturas reproducibles.
4. Se comprueban foco, teclado, contraste y movimiento reducido.
5. La app paciente y el Admin conservan sus flujos centrales.
6. Las rutas del HTML y los assets resuelven correctamente.
7. Se entrega un ZIP con estructura verificable y una nota de cambios real.

Mantén estas instrucciones cortas. Usa los documentos enlazados para detalles, no acumules reglas redundantes.
