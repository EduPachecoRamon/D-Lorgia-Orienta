# D’Lorgia — Fuentes verificadas y materiales recomendados

**Consulta:** 13 de noviembre de 2026. Fuentes web públicas. Enlaces para contrastar decisiones, no para copiar diseños.

## A. Fundamentales · prioridad 1

| Fuente | URL | Uso directo para D’Lorgia |
|---|---|---|
| W3C WCAG 2.2 | https://www.w3.org/TR/WCAG22/ | criterios AA, contraste, foco y accesibilidad |
| NN/g — Error-Message Guidelines | https://www.nngroup.com/articles/error-message-guidelines/ | mensajes legibles, próximos al problema y recuperables |
| GOV.UK — Error Message | https://design-system.service.gov.uk/components/error-message/ | validación de formularios: campo + resumen + conservar datos |
| IBM Carbon — Notification | https://www.carbondesignsystem.com/building-blocks/core/components/notification/guidelines | elegir toast, inline, notificación accionable y modal según gravedad |
| web.dev — High-performance CSS animations | https://web.dev/articles/animations-guide | motion con transform y opacity, evitar paint/layout excesivo |
| MDN — Reduced motion | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion | adaptar animaciones a preferencias de accesibilidad |
| Playwright — Visual comparisons | https://playwright.dev/docs/test-snapshots | impedir regresiones visuales con capturas comparativas |

## B. Diseño consistente y escalable · prioridad 2

| Fuente | URL | Uso |
|---|---|---|
| Design Tokens Community Group (2025.10) | https://www.w3.org/community/design-tokens/ | vocabulario compartido de colores, tipografía y escalas |
| Figma variables | https://help.figma.com/hc/es-419/articles/15339657135383-Gu%C3%ADa-de-variables-en-Figma | mapear diseño visual a tokens CSS |
| IBM Carbon Design System | https://carbondesignsystem.com/ | estados y arquitectura de componentes, sin copiar su aspecto |
| Linear — UI refresh 2026 | https://linear.app/now/behind-the-latest-design-refresh | diseñar navegación calmada, iconos coherentes y menos separadores |
| Notion Calendar | https://www.notion.com/product/calendar | agendas y acciones que se pueden revisar de un vistazo |
| Lucide | https://lucide.dev/ | iconos de acción consistentes; licencia ISC: https://lucide.dev/license |
| Storybook | https://storybook.js.org/docs/writing-tests/ | estados aislados y documentación de componentes; valorar adopción tras auditar stack |

## C. Tipografías y rendimiento

| Recurso | URL | Nota |
|---|---|---|
| Fraunces, datos de licencia | https://fontsource.org/fonts/fraunces/about | serif expresiva, OFL-1.1; títulos |
| Manrope, datos de licencia | https://fontsource.org/fonts/manrope/about | sans legible, OFL-1.1; UI y tablas |
| Font best practices | https://web.dev/articles/font-best-practices | cargas, fallback, CLS y estrategia de font-display |
| CLS web.dev | https://web.dev/articles/cls | reducir cambios inesperados de layout |
| Lighthouse CI | https://github.com/GoogleChrome/lighthouse-ci | checks de regresión en cada publicación |

## D. Inspiración visual; no constituye especificación técnica

| Recurso | URL | Qué observar |
|---|---|---|
| Aesop | https://www.aesop.com/ | composición editorial, tonos cálidos y refinamiento |
| Headspace | https://www.headspace.com/ | personalidad, tono humano y coherencia gráfica |
| Land-book | https://land-book.com/ | páginas de belleza, salud, serif y paletas verdes |
| Mobbin | https://mobbin.com/ | flujos de registro, citas y experiencia móvil |
| Godly | https://godly.design/ | experimentos de motion y marcas memorables |

## E. Contexto para asistentes IA

| Recurso | URL | Decisión |
|---|---|---|
| OpenAI Codex best practices | https://learn.chatgpt.com/guides/best-practices | indicar objetivo, contexto, restricciones y «terminado cuando» |
| AGENTS.md | https://www.agentsmd.ai/ | reglas permanentes en repositorio, no solo en chat |
| AGENTS.md in Codex | https://learn.chatgpt.com/docs/agent-configuration/agents-md | cómo consume guía repo el agente |
| OpenAI AI skills guidance | https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra | mantener instrucciones pequeñas y concretas, no inflar contexto |

## F. Stack de material recomendado (selección, no lista de compras)

**Base mínima y de máximo retorno:** brief + tokens CSS + paleta y tipografía + regla de motion + catálogo de mensajes + capturas Playwright + WCAG 2.2.

**Cuando los componentes se multipliquen:** componentes aislados, Storybook (solo si encaja con el proyecto), checklist UX y regresión visual.

**No prioritario:** librerías de efectos 3D pesados, reescribir Node a otro stack, bibliotecas de animación sin pruebas, plantillas de dashboard genérico.

## G. Materiales propios que conviene reunir

1. ZIP o repositorio exacto en funcionamiento.
2. Referencia Figma original, si está disponible.
3. Capturas de Inicio, Tratamientos, Orientador, Asesor, Mi espacio, Citas y Admin en móvil y escritorio.
4. Video corto de un icono/animación que se rompa.
5. Lista de mensajes reales de error y su contexto.
6. Branding autorizado: logo, nombres de tratamientos, fotos propias, textos oficiales.
7. Pruebas de usuarios y quejas concretas (sin datos identificatorios de pacientes).

Esto aporta más información útil al asistente que cambiar de modelo repetidamente sin contexto. Ninguna herramienta sustituye las pruebas del producto real.
