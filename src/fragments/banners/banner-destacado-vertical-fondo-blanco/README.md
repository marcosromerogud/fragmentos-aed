# Banner destacado vertical — Fondo blanco

Bloque de ícono + título + texto para destacar un mensaje dentro del correo.
Caja **blanca** con borde `1px solid #3D77FF` y esquinas de 12px, de 520px
dentro de los 600.

## Origen

Reconstruido a partir de:

`references/banner/[Temporal] BCP - Banner destacado - Vertical - Fondo Blanco.html`

La implementación conserva el aspecto de la referencia a **600px y 375px** y
normaliza los paddings laterales para que sean simétricos.

## Archivos

- Fuente: `banner-destacado-vertical-fondo-blanco.mjml`
- Compilado: `dist/banners/banner-destacado-vertical-fondo-blanco/banner-destacado-vertical-fondo-blanco.html`

## La familia completa

Son seis variantes del mismo componente: tres estilos de caja por dos
comportamientos en mobile. Son fragmentos independientes — cambiar el copy en
uno **no** lo cambia en los otros cinco.

| | Ícono en fila (mobile) | Ícono apilado (mobile) |
|---|---|---|
| Fondo blanco | `banner-destacado-fondo-blanco` | `banner-destacado-vertical-fondo-blanco` |
| Sin bordes | `banner-destacado-sin-bordes` | `banner-destacado-vertical-sin-bordes` |
| Full width | `banner-destacado-full-width` | `banner-destacado-vertical-full-width` |

## Qué hay que reemplazar

| Qué | Valor actual |
|---|---|
| Ícono | `f2d9855c0b2c1f83f4228ab86be22acb.png` del stage de Adobe Campaign, 100px. Su `alt` es `icono`, tal como la referencia: conviene cambiarlo por algo descriptivo al usarlo. |
| Título | `Participa por 1 Kit Apple` |
| Texto | `Recuerda que también puedes solicitar tu tarjeta desde la App Banca Móvil BCP en la sección Para Ti.` |

El copy es el de la referencia y corresponde a una campaña concreta: se
reemplaza en cada uso. Este fragmento no tiene variables de personalización de
Adobe Campaign.

## Estructura

- `mj-wrapper` con los 40px laterales, adentro el `mj-section` con la caja
  (520px), y dos `mj-column`: ícono (124px) y texto (394px).
- El ícono usa 12px a izquierda y derecha dentro de su columna; título y cuerpo
  también usan 12px a ambos lados. Los paddings laterales quedan simétricos.
- Sin `mj-group`: por debajo de los 600px las columnas se apilan solas y la
  media query las centra.
- En mobile (hasta 599px, el corte de la referencia): el ícono **se apila**
  sobre el texto y los dos quedan centrados. El ícono se mantiene en 100px, no
  se achica.

## Al romper el fragmento en AED

Si AED elimina todos los bloques `<style>`, las columnas conservan `width:100%`
inline: el ícono queda apilado sobre el texto y el contenido sigue legible. Se
pierden el centrado y el ajuste fino de padding mobile, pero no el layout base
ni la capacidad del texto de fluir.

Colores, todos vía `mj-class` de `@partials/colors.mjml`:

| `mj-class` | Valor | Dónde |
|---|---|---|
| `bg-gris-claro` | `#F2F4F8` | `mj-body` |
| `bg-blanco` | `#FFFFFF` | `mj-section` (la caja) |
| `borde-azul-medio` | `1px solid #3D77FF` | `mj-section` (la caja) |
| `txt-azul` | `#002A8D` | el título |
| `txt-azul-oscuro` | `#202E44` | el texto |

## Pendientes

- **Las esquinas redondeadas no se ven en Outlook de escritorio.** La referencia
  las simulaba con un `<v:roundrect>` de VML que acá no se replicó: ese VML
  lleva la altura de la caja escrita a mano (`height:115pt`), así que se rompe
  apenas cambia el copy. Sin él Outlook muestra la caja con esquinas rectas, y
  el color y el borde quedan bien. Si diseño pide las esquinas también en
  Outlook, hay que volver a meter el VML y recalcular esa altura para cada copy.
- El ícono usa la URL del ambiente **stage** de Adobe Campaign
  (`bcp-mid-stage13-res.adobe-campaign.com`), no el CDN definitivo de BCP.
- Los colores que esta familia agregó al partial (`borde-azul-medio` `#3D77FF`)
  salieron de la referencia y **no están validados contra el brandbook**.
- La referencia venía con la tipografía en `Arial, Helvetica, sans-serif`; acá
  se usa el stack **Flexo** del repo, que cae a Arial donde la webfont no carga
  (regla 4 de `docs/convenciones-mjml.md`).
- El nombre de la referencia arranca con `[Temporal]`: confirmar con diseño si
  estas seis variantes ya son las definitivas antes de difundirlas.
