# D’Lorgia v4.3 — Sistema de diseño inicial (propuesto)

## Identidad

**Nombre conceptual:** D’Lorgia · Editorial Wellness.  
**Promesa de experiencia:** «cuidado con claridad, belleza sin ruido».  
**Personalidad:** serena, cercana, rigurosa, sin tecnicismos en pantallas de usuario.

## Roles tipográficos

- Titular editorial / portada: Fraunces, variable, tamaño adaptativo con `clamp`.
- Interfaz / formularios / tablas: Manrope, normal y semibold, buena altura de línea.
- Nunca usar tipografía ornamental para información clínica, botones pequeños o alertas.
- Evitar saltos de fuente: precarga cuando proceda, fallback métricamente apropiado y evaluar CLS.
- Instalar legalmente familias con OFL-1.1; no distribuir fuentes aquí.

## Escala propuesta

| Token | Valor orientativo | Uso |
|---|---|---|
| `--font-body` | Manrope, system-ui, sans-serif | UI |
| `--font-display` | Fraunces, Georgia, serif | títulos |
| `--text-xs` | 0.875rem | secundario aún legible |
| `--text-base` | 1rem | cuerpo y campos |
| `--text-lg` | 1.125rem | cuerpo destacado |
| `--heading-sm` | clamp(1.5rem,2vw,2rem) | secciones |
| `--heading-lg` | clamp(2.5rem,5vw,4.25rem) | pantalla / editorial |
| `--radius-card` | 1.25rem | superficies |
| `--radius-control` | 0.75rem | inputs y botones |
| `--space-unit` | 0.25rem | ritmo de 4px |

Estas cifras deben validarse en móvil, particularmente por los 8–11 px usados previamente en zonas del Admin.

## Tokens semánticos sugeridos

- `--color-canvas:#F6F2E9`
- `--color-surface:#FFFDF8`
- `--color-brand:#183E35`
- `--color-ink:#1A3029`
- `--color-muted:#526B60` (validar contraste con superficie)
- `--color-accent:#B88B50` (decorativo, no texto pequeño sobre crema)
- `--color-sage:#DAE6DB`
- `--color-border:#CAD6CE` (propuesta a medir)

No usar colores del estado únicamente. Estado = icono + texto + color.

## Motion system

| Tipo | Duración orientativa | Función |
|---|---|---|
| Feedback micro | 100–180 ms | respuesta de botón |
| Transición de panel | 160–240 ms | cambio de sección |
| Entrada de contenido | 180–280 ms | introducir jerarquía sin distraer |
| Fondo descendente | 25–45 s | identidad ambiental |

Estas duraciones son hipótesis de diseño, no estándares obligatorios.

### Reglas de ingeniería

- Solo `transform` y `opacity` para el movimiento frecuente, salvo justificación y prueba en navegador.
- Aislar el fondo del contenido usando una capa propia, sin `opacity` global que atenúe texto.
- No generar nuevos nodos continuamente para simular lluvia: reutilizar un conjunto limitado.
- Bajo `prefers-reduced-motion`, apagar el fondo animado y eliminar transiciones no esenciales.
- Definir propiedades SVG de `fill`, `stroke`, `stroke-width` y `viewBox` para consistencia.
- En capturas automáticas, congelar animations antes de comparación de snapshots.

## Componentes compartidos prioritarios

1. Header (paciente/admin) + navegación responsiva.
2. Botón principal/secundario/terciario, estados hover/focus/disabled/loading.
3. Campo de texto/select/fecha + ayuda y validación.
4. Card editorial, card de tratamiento y tarjeta de resumen admin.
5. Feedback: inline error, éxito, toast, alerta de servicio, vacío y skeleton.
6. Modal/drawer con foco atrapado y restauración de foco.
7. Calendario de citas accesible al teclado.
8. Sistema de motivos SVG, coordinado por página.

## Microcopy de marca

**Tono:** natural, preciso, empático sin infantilizar, sin tecnicismos y sin exageraciones.

- «Descubre tratamientos que se ajusten a tus preferencias.»
- «Tu orientación está lista para explorar.»
- «Revisa los detalles antes de confirmar.»
- «Cita confirmada.»
- «Aún no hay citas programadas.»

No presentar el Orientador como diagnóstico. No prometer disponibilidad hasta recibir confirmación del backend.

## Diseño que se puede verificar

### Un cambio es satisfactorio si:

- mantiene la tarea principal evidente al primer vistazo;
- funciona a 360 px de ancho y a 1440 px;
- conserva foco y recorrido de teclado;
- no provoca errores JS ni bloquea interacción;
- el ambiente no tapa textos ni botonería;
- error y confirmación pueden leerse sin depender de colores o animación;
- respeta permisos del usuario y rutas actuales;
- se acompaña de evidencia visual y pruebas, no solo de una afirmación de que está «listo».


## Decisión v4.4 — Atelier

**Paciente:** shell de dispositivo centrado de máximo 560px; en escritorio ocupa el alto visible menos el margen, en móvil toda la pantalla. Cabecera, experiencia y dock inferior forman parte del layout; solo el contenido central se desplaza. Es una decisión deliberada para mantener el lenguaje de app móvil.

**Jerarquía:** Mi espacio comienza por orientaciones, acceso al recorrido e información personal útil. El formulario completo queda después del contenido de orientación; privacidad, documentos e instalación se agrupan en un desplegable.

**Admin:** visualización ancha independiente, barra lateral verde profundo, banner ilustrado y paneles diseñados para lectura. La identidad es la misma sin forzar el marco móvil en una herramienta administrativa.

**Imagen:** `dlorgia-atmosphere.webp` creada para D’Lorgia, de tonos bosque, cielo, vidrio y hojas. Se utiliza como acento editorial, no en lugar de etiquetas ni como fuente de información.

**Motion:** SVG de célula, hidratación, estructura dermis y flora. Opacidad constante en el símbolo; animar transform en su capa. No introducir opacidad del contenedor que reduzca contraste al contenido.

**Accesibilidad:** valores `a11y-large-text`, `a11y-high-contrast` y `dlorgia-motion-paused` son compartidos en el navegador; el ajuste de movimiento está disponible además de `prefers-reduced-motion`.
