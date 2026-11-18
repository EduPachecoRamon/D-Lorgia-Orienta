# D’Lorgia Orienta v4.9 · Experiencia institucional

Esta versión parte de v4.8. Conserva la autenticación existente (correo y Google OAuth preparado), roles validados en servidor, Orientador, Asesor, solicitudes de evaluación y panel administrativo. No introduce bases de datos, servicios de IA ni pagos nuevos.

## Cambios implementados

1. **Portada /:** se reemplazaron las imágenes SVG abstractas por seis **referencias distintas a fotografías actualmente publicadas en `www.dlorgia.com`**. No se descargó ninguna fotografía al ZIP. La portada tiene una presentación breve, valor para el paciente y dos acciones: crear cuenta o ingresar.
2. **Cubo de aristas:** las seis caras están inicialmente transparentes; las tres caras de función se iluminan y muestran una explicación al pasar el cursor, usar teclado o tocar. El panel de texto adicional describe Orientador, Asesor y Evaluación. Se respetan las preferencias de movimiento reducido.
3. **Ritmo visual:** portada clara, galería editorial blanca, cubo verde profundo, guía verde salvia y CTA institucional; las secciones no son tres tarjetas repetidas.
4. **Acceso /app:** se quitó de la interfaz «Explorar como invitado» para evitar confundir registro con prueba local. Se mantiene Google y el cambio explícito entre Ingresar / Crear cuenta, con conservación del correo y correo de verificación cuando corresponde. No se crean cuentas con contraseña de manera silenciosa tras fallar un ingreso.
5. **Guía /guia:** nueva ruta pública con tres pasos interactivos: crear cuenta, orientarse, solicitar evaluación. Enlazada desde portada, acceso y ayuda. No requiere login.
6. **Catálogo:** si se agotaron los recursos fotográficos diferentes, se usa un bloque informativo por categoría, en lugar de repetir una misma foto de forma engañosa. Las URLs externas fallidas no se sustituyen por arte abstracto.
7. **Identidad complementaria:** pequeñas mejoras en páginas públicas y Admin, usando referencias fotográficas del sitio oficial o fondos limpios sin fotos de IA.
8. **PWA:** cache `dlorgia-orienta-v490-institucional`, incluye nuevas rutas y CSS/JS. Google OAuth, datos y permisos originales no se modificaron.

## Lo que **NO** incluye

- **No contiene fotografías oficiales descargadas**: usa referencias remotas al sitio de la empresa (pueden cambiar o fallar). Para una versión estable, D’Lorgia debe autorizar y entregar los archivos originales, y el usuario debe ejecutar el importador detallado en `FOTOGRAFIAS_D_LORGIA_V49.md`.
- **No incluye resultados clínicos ni fotos de pacientes generadas con IA.** No se deben usar fotos de pacientes o antes/después sin consentimiento específico.
- El visual del cubo no reemplaza el testeo real. La prueba automatizada de Chromium no pudo completarse porque el navegador de este entorno bloquea la vista local.
- La integración Google OAuth real requiere las credenciales y dominios ya configurados en Supabase/Render. Este ZIP no guarda ni cambia secretos.

## Rutas clave

- `/` — portada institucional nueva
- `/app?mode=register` — registro
- `/app?mode=login` — inicio
- `/guia` — ayuda inicial paso a paso
- `/experiencias` — catálogo de fotos públicas de D’Lorgia
- `/ayuda` — preguntas frecuentes
- `/admin` — equipo autorizado

## Probar localmente

```bash
npm test
npm run start
```

Después revisar `/`, `/guia`, `/app?mode=register`, `/app?mode=login`, `/experiencias`, `/admin`. Comprueba con un usuario nuevo y con otro ya registrado, y verifica que Google no convierte cuentas en administradores.

## Desplegar en GitHub / Render

Sube **todo el contenido** de la carpeta raíz del proyecto a `main`, no el ZIP sin descomprimir ni una carpeta contenedora adicional. Si puedes, usa GitHub Desktop para reemplazar todos los archivos y crear un único commit. Render conservará `npm test` como build y `npm run start` como start. Verifica `78/78` pruebas, estado `live` y rutas públicas antes de entregar el PMV.

No elimines las variables de entorno existentes de Render y no pegues Client Secret u otras claves privadas en GitHub.

## Viabilidad del piloto

Las páginas públicas, el cubo y la guía son HTML/CSS/JS estáticos. La función de búsqueda del catálogo sigue siendo local. La caché PWA usa el mismo hosting. **No se incorporó un servicio de pago nuevo.** El costo real depende de los límites de Render Free, Supabase Free y de cualquier consumo del proveedor de IA, y debe monitorearse durante el testeo.
