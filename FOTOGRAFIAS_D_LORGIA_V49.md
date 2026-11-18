# Qué fotografías necesito de la gerencia D’Lorgia

**No usar imágenes generadas por IA.** La versión v4.9 contiene únicamente enlaces a fotografías que ya aparecen publicadas en el dominio de D’Lorgia; no almacena esos archivos ni afirma que tengamos sus derechos. Las URLs podrían dejar de funcionar. Para convertir el PMV en un entregable estable, pide a la empresa los archivos originales o autorización expresa para alojarlos en el proyecto.

## Seis fotos prioritarias para reemplazar las referencias remotas

| Uso en la web | Contenido deseado | Nombre del archivo para el importador |
|---|---|---|
| Portada principal | Tecnología o atención al paciente, fotografía propia de D’Lorgia | `foto-colormax-manchas.webp` |
| Foto secundaria portada | Profesional trabajando con un equipo de cuidado facial | `alta-frecuencia-facial-2.jpg` |
| Servicios de piel | Fotografía de tratamiento/ambiente vinculado con acné | `colormax-acne.jpg` |
| Servicios tecnológicos | Foto real del equipo de depilación láser | `foto-depilacion-laser-piernas.webp` |
| Servicios capilares | Foto real de su servicio capilar | `prp.jpg` |
| Cierre de portada | Foto real de atención facial autorizada | `botox.jpg` |

Esos nombres son **claves técnicas** que corresponden a las referencias actuales y permiten reemplazarlas automáticamente. Puedes elegir fotografías distintas de las actuales para esas posiciones, siempre que el contenido sea fiel y haya sido autorizado por la empresa. Envía aparte, si están disponibles, el logotipo original y fotografías de sedes y equipo.

### Requisitos de entrega

- JPG, PNG o WebP; preferir WebP cuando sea posible.
- Ideal: ancho 1200–1600 px para portada y 800–1200 px para tarjetas.
- Ideal: 150–500 KB por imagen, para facilitar el uso en móvil y dentro del plan gratuito.
- Fotografías auténticas, sin marcas de agua de terceros, sin filtros que sugieran resultados clínicos no verificables.
- No compartir fotos identificables de pacientes, procedimientos privados o antes/después sin consentimiento explícito para esa publicación. Priorizar fotografías de instalaciones, equipo y personal que autorice su uso.

## Instalar sin pagar almacenamiento adicional

Guarda las fotos aprobadas en una carpeta **fuera del repositorio**, por ejemplo `C:\FotosDLorgiaAutorizadas` o `/home/usuario/fotos-dlorgia`. Ejecuta:

```bash
node scripts/instalar-fotos-autorizadas.mjs /ruta/a/fotos-dlorgia
```

El script valida extensiones y firmas básicas, copia únicamente archivos reconocidos a `public/assets/fotos-oficiales/` y sustituye las referencias exactas en la portada, páginas públicas y catálogo (y los fondos institucionales donde coincida la URL). Revisa el sitio en un navegador después del cambio y publica la nueva versión en GitHub.

Para evitar la publicación accidental de contenido no autorizado, **no subas a GitHub fotos que la gerencia todavía no haya aprobado**.

## ¿Por qué no incluimos directamente una copia de las fotos de la web oficial?

Las fotos son propiedad o material autorizado de la empresa, y el proyecto debe respetar sus permisos y consentimiento de imagen. En esta entrega las utilizamos como **referencias enlazadas al dominio oficial** y dejamos preparado el reemplazo local. El logotipo y fotos originales deben venir de una fuente autorizada para que la empresa pueda mantenerlos.
