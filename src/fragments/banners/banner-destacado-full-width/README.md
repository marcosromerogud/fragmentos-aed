# Banner destacado — Full width

Bloque de ícono + título + texto para destacar un mensaje dentro del correo.
Caja **celeste** `#F5F8FF` a los **600px completos**, sin borde ni esquinas
redondeadas.

## Origen

Reconstruido a partir de:

`references/banner/[Temporal] BCP - Banner destacado - Full width.html`

Comparado contra esa referencia en el navegador a **600px y 375px**: la posición
y el ancho del ícono y del texto, y la altura del bloque, coinciden exactamente
en los dos anchos.

## Archivos

- Fuente: `banner-destacado-full-width.mjml`
- Compilado: `dist/banners/banner-destacado-full-width/banner-destacado-full-width.html`

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

- `mj-section` con la caja a los 600px completos, y dos `mj-column`: ícono
  (124px) y texto (476px).
- Los **124px** del ícono son los 104px que declara la celda de la referencia
  más sus 20px de padding izquierdo. Está medido sobre la referencia en el
  navegador, no deducido del markup: la celda declara 104 y el navegador la
  renderiza a 124.
- Los anchos de columna van en px explícitos porque MJML le da 50% a la columna
  que no lo declara.
- Con `mj-group`, que es lo que impide que las columnas se apilen en mobile.
  `docs/convenciones-mjml.md` desaconseja `mj-group` para filas de ícono + texto
  porque achica el ícono; acá eso es justo lo que hace la referencia, y la media
  query fija el tamaño final en vez de dejarlo librado al porcentaje.
- En mobile (hasta 599px, el corte de la referencia): el ícono **se queda en
  fila** con el texto y baja a 64px, en una celda de 112px — más grande que en
  las variantes de 520px.

Colores, todos vía `mj-class` de `@partials/colors.mjml`:

| `mj-class` | Valor | Dónde |
|---|---|---|
| `bg-gris-claro` | `#F2F4F8` | `mj-body` |
| `bg-celeste-claro` | `#F5F8FF` | `mj-section` (la caja) |
| `txt-azul` | `#002A8D` | el título |
| `txt-azul-oscuro` | `#202E44` | el texto |

## Pendientes

- La referencia traía un `<v:roundrect>` de VML para Outlook que acá no se
  replicó. En esta variante no dibujaba esquinas redondeadas (`arcsize=0`): solo
  repetía el fondo con una altura escrita a mano (`height:115pt`), que se rompe
  apenas cambia el copy. Sin él Outlook renderiza la caja igual.
- El ícono usa la URL del ambiente **stage** de Adobe Campaign
  (`bcp-mid-stage13-res.adobe-campaign.com`), no el CDN definitivo de BCP.
- Los colores que esta familia agregó al partial (`bg-celeste-claro` `#F5F8FF`)
  salieron de la referencia y **no están validados contra el brandbook**.
- La referencia venía con la tipografía en `Arial, Helvetica, sans-serif`; acá
  se usa el stack **Flexo** del repo, que cae a Arial donde la webfont no carga
  (regla 4 de `docs/convenciones-mjml.md`).
- El nombre de la referencia arranca con `[Temporal]`: confirmar con diseño si
  estas seis variantes ya son las definitivas antes de difundirlas.
