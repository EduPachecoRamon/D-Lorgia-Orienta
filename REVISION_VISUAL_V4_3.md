# Control de calidad de D’Lorgia v4.3

## Comprobado

- `npm test`: **43 de 43 pruebas aprobadas**.
- `node --check` de servidor, JavaScript de pacientes y Admin: sintaxis correcta.
- Dos vistas de acceso en Chromium: paciente y Admin a 390 × 844 y 1280 × 900 píxeles.
- Navegación de invitado en una simulación de navegador: login → onboarding sin errores de JavaScript.
- Opacidad real de motivos grandes durante la animación: **0.045 constante**, con `transform` variable.
- Movimiento reducido: el motor oculta los motivos decorativos.
- Archivos de estilos y scripts declarados en el service worker actualizado.
- Cambios visuales aislados del backend y contratos API.

## Comprobar antes de publicar

- Inicio de sesión real y administración con Supabase conectado.
- Orientador completo y generación de resultados reales.
- Registro y modificación de citas reales, control de duplicados y persistencia tras recarga.
- Medición Lighthouse y pruebas manuales de teclado / lector de pantalla.
- Carga de fuentes desde redes del usuario; rendimiento móvil en dispositivos físicos.

## Archivos centrales

`public/assets/dlorgia-tokens.css`, `dlorgia-typography.css`, `dlorgia-components.css`, `dlorgia-motion.css`, `dlorgia-patient.css`, `dlorgia-admin.css`, `dlorgia-feedback.js`, `dlorgia-ambient.js` y `dlorgia-signature.svg`.
