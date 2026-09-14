# Cierre Consumo

Bloque de cierre genérico (sin firma personal) sobre fondo azul, con tres
canales de contacto (WhatsApp, Facebook y reclamos) y el logo "Contigo BCP" al
pie.

## Origen

Reconstruido a partir de `references/cierre/cierrre-consumo.html` (el nombre
del archivo de referencia tiene un typo, triple "r") y comparado visualmente
contra esa referencia en desktop (640px) y mobile (375px).

No tiene datos personales: el WhatsApp, la página de Facebook y el link de
reclamos son información institucional pública. Los textos se conservan tal
cual la referencia (incluido "Escribenos" sin tilde).

## Archivos

- Fuente: `cierre-consumo.mjml`
- Compilado: `dist/cierres/cierre-consumo/cierre-consumo.html`

## Variables a reemplazar

Ninguna.

## Estructura

- Desktop: tres columnas con el ícono arriba y el texto centrado. El reparto
  copia el de la referencia, que **no es parejo**: 175px + 10px de separador +
  175px + 10px, y la tercera va alineada a la derecha. Por eso el hueco entre
  la 2ª y la 3ª es de 17px. En MJML queda como columnas de 185/185/182px con
  padding asimétrico (10px a la derecha / 10px a la derecha / 7px a la
  izquierda); en mobile ese padding se anula.
- Mobile (≤480px): cada canal pasa a una fila con el ícono a la izquierda (35%,
  máx. 85px) y el texto alineado a la izquierda. El salto de línea de
  "Búscanos en / Facebook como" desaparece. Todo con media queries en
  `<mj-style>`, con clases prefijadas `cierre-consumo-`.
- Las tablas anidadas llevan `color/font-*: inherit` para no perder el color y
  el tamaño del texto (ver `docs/convenciones-mjml.md`, regla 3).

## Pendientes

- Logo e íconos usan las URLs de la referencia
  (`bcp-mid-stage13-res.adobe-campaign.com`, un ambiente **stage** de Adobe
  Campaign). Cargan hoy pero no es el CDN definitivo de BCP.
- Colores (`bg-azul` `#002A8D`, `txt-blanco` `#FFFFFF`) tomados de la
  referencia, **no validados contra el brandbook**.
- Confirmar que `99-311-9898` y `viabcp.com/ayuda-bcp` siguen vigentes.
- En documentos con doctype, los textos de los canales quedan ~3px más abajo que
  en la referencia en desktop. No se nota a simple vista.
