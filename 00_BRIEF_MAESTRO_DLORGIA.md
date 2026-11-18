# D’Lorgia Orienta — Brief maestro de producto, identidad y calidad

**Fecha de consolidación:** 13 de noviembre de 2026  
**Etapa propuesta:** v4.3 · Identity & Polish  
**Estado:** documento estratégico y técnico. No implica que los cambios de v4.3 ya estén implementados.

## 1. Contexto y objetivo

D’Lorgia Orienta es una experiencia digital de orientación y gestión vinculada al cuidado estético y al bienestar. Tiene dos superficies: una app para pacientes/usuarios y un panel administrativo. La versión funcional descrita en las conversaciones previas es v4.2 Pulse, construida sobre frontend web, backend Node.js, Supabase Auth y PostgreSQL. **Esta descripción procede del historial del proyecto; no sustituye una inspección del repositorio desplegado.**

### Problemas prioritarios detectados por quienes usan la app

1. **Falta de organización general:** navegación, jerarquías, espaciado, componentes y densidad visual inconsistentes.
2. **Animaciones ambientales que se rompen:** iconos descendentes con superposiciones, opacidad/transparencia inconsistentes, fallos de capas y diferencias entre vistas.
3. **Mensajes técnicos o molestos:** errores que hablan como backend, aparecen prematuramente o son demasiado pequeños y poco claros.
4. **Identidad poco distintiva:** la experiencia resulta agradable, pero genérica. Necesita una firma visual, una familia tipográfica memorable, símbolos propios y un lenguaje único, sin comprometer usabilidad.
5. **Fragilidad de cambios anteriores:** se añadieron efectos y estilos por versión sin un sistema de diseño compartido ni pruebas visuales suficientes.

### Resultado deseado

Una aplicación final de cara al paciente y al administrador, elegante, reconocible, ordenada, accesible, estable y verificada. Los textos visibles para usuarios no deben incluir mensajes de desarrollo ni notas de implementación. Las aclaraciones técnicas sí pertenecen a documentación, registros internos y reportes de pruebas.

## 2. Dirección visual recomendada: «Editorial Wellness»

Concepto: **una estética editorial de cuidado personal con la precisión de un producto digital serio**.

- **Calidez:** superficies claras y crema, trato humano, información comprensible.
- **Elegancia:** verde bosque, dorado dosificado, composición editorial y tipografía con personalidad.
- **Claridad:** controles predecibles, recorridos simples, un foco principal por pantalla.
- **Firma de marca:** motivos SVG diseñados expresamente para D’Lorgia; se distinguen de iconos funcionales genéricos.
- **Consistencia:** mismo lenguaje entre paciente y admin, con densidad distinta: paciente más contemplativo; admin más informativo.

### Referencias e interpretación — no copiar literalmente

| Referencia | Qué aprender | Qué NO copiar |
|---|---|---|
| Aesop — https://www.aesop.com/ | fotografía editorial, espacio negativo, tonos cálidos | estructura de ecommerce o identidad de otra marca |
| Linear — https://linear.app/now/behind-the-latest-design-refresh | jerarquía, navegación sobria, iconos y separadores discretos | densidad excesiva o estética oscura por defecto |
| Headspace — https://www.headspace.com/ | tono cercano, ilustración con personalidad | lenguaje infantil o paleta saturada |
| Notion Calendar — https://www.notion.com/product/calendar | agendas fáciles de escanear, acciones contextuales | complejidad de calendario no necesaria |
| Land-book — https://land-book.com/ | descubrimiento visual por sectores/estilos | implementar efectos solo por verse llamativos |
| Mobbin — https://mobbin.com/ | patrones reales de formularios, perfiles y flujos | clonación de pantallas ajenas |
| Godly — https://godly.design/ | exploración de composición y motion | efectos pesados sin utilidad |

## 3. Decisiones propuestas de identidad visual

**Tipografía:** Fraunces para titulares de marca y momentos clave; Manrope para navegación, botones, inputs, tablas, ayudas y párrafos. Ambas familias constan en Fontsource con licencia OFL-1.1. No incluir archivos de fuentes en este kit: instalar mediante paquetes legales o proveedores apropiados. Preferir fuentes variables cuando la carga y soporte lo justifiquen; probar cambios de layout al cargar y ajustar fallbacks.

- https://fontsource.org/fonts/fraunces/about
- https://fontsource.org/fonts/manrope/about
- https://web.dev/articles/font-best-practices

**Paleta preliminar (no homologada hasta medición en interfaces reales):**

| Uso | Color |
|---|---|
| Verde principal | `#183E35` |
| Crema base | `#F6F2E9` |
| Dorado decorativo | `#B88B50` |
| Salvia sutil | `#DAE6DB` |
| Tinta profunda | `#1A3029` |

El dorado decorativo sobre crema **no alcanza** el contraste recomendado para texto normal; usarlo en motivos/bordes o sobre fondos oscuros después de medir. Para texto principal usar verde o tinta. WCAG 2.2 AA: contraste de 4.5:1 para texto normal y 3:1 para texto grande, con las excepciones de la norma.

**Iconos:** Lucide como lenguaje de controles (`https://lucide.dev/`), con tamaños y trazos estables. La firma D’Lorgia debe ser original (motivos abstractos, hoja/estrella/brújula propios). No usar emojis como iconografía primaria de navegación. Documentar licencias.

**Jerarquía:** un solo H1 visible por vista; H2 para secciones; etiquetas secundarias solo cuando añadan orientación; una acción principal por pantalla. Los datos operativos no deben verse como decoración.

## 4. Organización del producto

### App de paciente

Orden recomendado para revisar mediante pruebas con usuarios: **Inicio → Explorar tratamientos → Orientador Personal → Evaluación/cita → Seguimiento → Mi espacio**. El Asesor conversacional debe quedar ubicado con un propósito claro y no duplicar al Orientador. No imponer este menú sin auditar qué pantallas actuales existen y qué tareas priorizan los usuarios.

- Inicio: propuesta de valor breve, acción primaria y estado de progreso si existe.
- Tratamientos: categorías legibles, filtros previsibles, una ficha profunda sin saturación.
- Orientador: flujo paso a paso; guardado de progreso; recomendaciones comprensibles y no diagnósticas.
- Citas: horario, sede, confirmación inequívoca y prevención de reservas duplicadas.
- Mi espacio: estado de citas, orientaciones y opciones de cuenta sin mensajes técnicos.

### Panel Admin

Priorizar: **Resumen → Citas → Pacientes → Orientaciones → Tratamientos → Configuración**. Contexto operativo visible, navegación consistente, filtros comprensibles, tamaños de fuente útiles y densidad controlada. Las acciones de mayor impacto deben pedir confirmación o permitir deshacer cuando sea seguro.

## 5. Sistema de animación ambiental fiable

Crear **un motor compartido** (`dlorgia-ambient.js` y `dlorgia-motion.css`) en lugar de varias implementaciones independientes.

- SVG reutilizables con `viewBox`, atributos de `fill/stroke` explícitos y aspecto coherente.
- Contenedor fijo detrás del contenido con capas definidas; `pointer-events:none`; `aria-hidden:true` para motivos decorativos.
- Cada motivo debe disponer de opacidad propia, `opacity` no heredada de una capa de contenido; **no** modificar la opacidad del contenedor principal de la app.
- Animar `transform` y `opacity`; evitar animar `top`, `left`, ancho, alto o filtros pesados cuando produzcan layout/paint frecuente.
- Propuesta de inicio: 8–12 motivos en escritorio y 4–6 en móvil, duración 25–45 s, baja opacidad; ajustar por medición, nunca por intuición solamente.
- Comprobar superposición: stacking contexts, `isolation`, `z-index`, `position`, `overflow`, `mask`, transforms de padres, service worker y caché de CSS.
- Opciones de movimiento reducido según `prefers-reduced-motion`, y prueba explícita con «reducir movimiento».
- Animar iconos de ambiente de forma continua, pero no animar controles que interrumpan lectura o interacción.

**Fuente técnica:** https://web.dev/articles/animations-guide ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion

## 6. Errores, mensajes y tono

Los mensajes deben dirigirse a personas reales. Separar validación de formulario, problemas del servicio, fallos de red y acciones administrativas.

| Situación | Mensaje de interfaz recomendado | Acción |
|---|---|---|
| Datos de acceso incorrectos | «No pudimos iniciar sesión. Revisa tus datos o recupera el acceso.» | Reintentar / Recuperar |
| Formulario incompleto | «Indica tu correo para continuar.» | Enfocar el campo |
| Cita ya ocupada | «Ese horario ya no está disponible. Elige otro para continuar.» | Ver otros horarios |
| Red desconectada | «Perdimos la conexión. Tus respuestas siguen aquí; inténtalo otra vez.» | Reintentar |
| Guardado incierto | «No pudimos confirmar si se guardó. Revisa el estado antes de enviarlo de nuevo.» | Ver estado |
| Operación administrativa completada | «Cita confirmada.» | Ver detalle |
| Sin datos | «Todavía no tienes citas. Cuando solicites una, aparecerá aquí.» | Explorar citas |

Reglas:
- Mostrar validaciones al enviar el formulario o cuando exista un motivo útil; evitar mensajes de error prematuros por tocar campos.
- Errores de campo justo junto al input, vinculados con `aria-describedby` y `aria-invalid`.
- En formularios con varios errores, resumen al principio + foco accesible.
- No borrar campos al fallar la validación.
- Para un fallo persistente usar aviso inline; para éxito simple usar toast no invasivo; modales solo para decisiones irreversibles o críticas.
- No filtrar al frontend rutas internas, SQL, claves, mensajes técnicos o trazas.
- Mensajes visibles legibles, no tipografía diminuta de 9px en zonas funcionales.
- No afirmar «guardado» si el backend no confirmó el resultado; contemplar reintentos e idempotencia.

Fuentes: https://www.nngroup.com/articles/error-message-guidelines/ ; https://design-system.service.gov.uk/components/error-message/ ; https://www.carbondesignsystem.com/building-blocks/core/components/notification/guidelines

## 7. Accesibilidad y rendimiento como requisitos, no como extras

- WCAG 2.2 AA como objetivo; no afirmar conformidad sin pruebas manuales y automáticas.
- Contraste 4.5:1 para texto normal, 3:1 para texto grande; iconos funcionales también necesitan contraste significativo.
- Navegación completa por teclado, foco visible, orden lógico de tabulación, estados anunciados cuando corresponda.
- Botones y campos táctiles suficientemente grandes; no bloquear zoom; formularios y calendarios en móvil.
- Evitar Cumulative Layout Shift por fuentes, imágenes sin dimensiones y entradas animadas.
- Probar pantallas de 360, 390, 768, 1280 y 1440 px, con textos largos y datos nulos.
- No depender del movimiento, el color o los iconos para comunicar estados.

Fuentes: https://www.w3.org/TR/WCAG22/ ; https://web.dev/articles/font-best-practices ; https://web.dev/articles/cls

## 8. Arquitectura de calidad propuesta

No migrar a un framework distinto por estética. Primero auditar las dependencias y el código actual.

Una estructura incremental razonable sería:

```text
public/assets/
  dlorgia-tokens.css
  dlorgia-typography.css
  dlorgia-layout.css
  dlorgia-components.css
  dlorgia-motion.css
  dlorgia-ambient.js
  dlorgia-feedback.js
```

Añadir componentes/estados mediante reutilización en ambas superficies sin reescribir backend ni contratos API. Adquirir baselines de capturas antes de cambios y protegerlos con tests.

### Barrera de calidad antes de entregar ZIP

1. Corroborar el ZIP/repo real, no inferir su contenido.
2. Ejecutar los tests existentes y documentar fallos heredados.
3. Comparar Inicio, Catálogo, Orientador, Citas, Mi espacio y Admin en escritorio/móvil.
4. Playwright E2E: login, navegación, Orientador, registro de cita, admin autoriza y confirma, error de red, sesión caducada.
5. Playwright visual snapshots: antes/después, en entornos reproducibles; desactivar animaciones no deterministas durante snapshot.
6. Lighthouse CI: vigilar accesibilidad, rendimiento y CLS, sin fijar umbrales arbitrarios sin línea base.
7. Revisar consola del navegador, endpoints y contrato de datos reales.
8. Comprobar `prefers-reduced-motion`, teclado y lectura.
9. Garantizar que la actualización del service worker no muestra recursos antiguos.
10. Documento de cambios solo en archivos técnicos; interfaz sin avisos tipo «demo» o «versión beta» salvo que corresponda al producto real.

Fuentes: https://playwright.dev/docs/test-snapshots ; https://github.com/GoogleChrome/lighthouse-ci ; https://storybook.js.org/docs/writing-tests/

## 9. Seguridad y privacidad (especialmente importantes para un producto de cuidado)

- Supabase secret/service role exclusivamente en backend; el navegador nunca recibe secretos.
- Autorización por rol en servidor y RLS apropiadas; no suponer que esconder botones es seguridad.
- Mínima exposición de respuestas personales y preferencias de pacientes en analíticas; usar agregados cuando sea suficiente.
- No asumir que «orientación» equivale a diagnóstico o recomendación médica profesional.
- Registros técnicos y auditoría sin datos sensibles innecesarios.
- Confirmar tratamiento de errores de red, duplicados y retención de datos antes de publicar.

## 10. Material que mejora de verdad la calidad de asistentes IA

**Lo más útil NO es otra lista genérica de prompts.** Es mantener un repositorio claro de verdad:

1. `00_BRIEF_MAESTRO_DLORGIA.md` — metas y restricciones.
2. `01_REFERENCIAS_VERIFICADAS.md` — fuentes oficiales clasificadas y justificación.
3. `02_SISTEMA_DE_DISENO.md` — tokens, componentes y reglas.
4. `dlorgia.tokens.json` — datos de diseño consumibles por herramientas.
5. `AGENTS.md` — instrucciones pequeñas y repetibles para Copilot, Codex y otras IAs de código.
6. Capturas Figma del estado actual, capturas de errores y el ZIP/repo exacto — imprescindibles para arreglos sin supuestos.

Para pedir cualquier cambio al asistente: **objetivo, contexto de archivos, restricciones y criterios verificables de terminado**. Tras cada cambio: screenshot, test, chequeo de accesibilidad y explicación de regresiones. Para tareas repetidas, formalizar guías en archivos y no depender de una conversación extensa.

Referencias: https://learn.chatgpt.com/guides/best-practices ; https://www.agentsmd.ai/ ; https://www.w3.org/community/design-tokens/

## 11. Prioridades de ejecución

**P0:** congelar una línea base verificable, resolver errores de animación/stacking/caché, eliminar mensajes técnicos visibles, recuperar navegación clara.

**P1:** tipografía y tokens compartidos; iconografía consistente; rediseño de jerarquías Inicio/Orientador/Admin; sistema central de feedback.

**P2:** microinteracciones estables; gráficos y ornamentos de marca; pruebas visuales y de flujo; optimizaciones de rendimiento y accesibilidad.

**Evitar:** instalar 3 frameworks visuales, copiar sitios ajenos, efectos no medidos, reestructurar rutas sin tests, falsos indicadores «conectado», números de ejemplo presentados como datos reales o suponer que un test de servidor cubre la experiencia de navegador.

## 12. Qué falta validar cuando se retome el trabajo de implementación

- Confirmar versión exacta del ZIP/repo, rutas y assets desplegados.
- Auditoría de páginas, CSS acumulado, animations actual y caché/service worker.
- Capturas del diseño actual y del Figma original (si existe) para preservar lo que funciona.
- Comprobar resultados reales de Contraste, CLS, FPS, carga de fuentes y breakpoints.
- Validar contenido de los mensajes con personas usuarias.

**Estado del documento:** investigación y decisiones propuestas, no resultados de una auditoría del sitio en vivo.
