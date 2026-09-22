# Banner destacado — Full width

Bloque de ícono + título + texto para destacar un mensaje dentro del correo.
Caja **celeste** `#F5F8FF` a los **600px completos**, sin borde ni esquinas
redondeadas.

## Origen

Reconstruido a partir de:

`references/banner/[Temporal] BCP - Banner destacado - Full width.html`

La implementación conserva el aspecto de la referencia a **600px y 375px** y
normaliza los paddings laterales para que sean simétricos.

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

- `mj-section` conserva la caja a los 600px completos y contiene una sola
  columna al 100%.
- La fila ícono + texto es un `mj-table`: la celda del ícono mide 124px y la
  celda de texto no declara ancho, por lo que ocupa el espacio restante.
- El ícono queda centrado dentro de su celda y el texto usa 12px a ambos lados;
  así los paddings laterales son simétricos.
- La media query solo mejora el aspecto mobile: reduce la celda a 88px y el
  ícono a 64px. No sostiene el layout base.

## Al romper el fragmento en AED

Si AED elimina todos los bloques `<style>`, la fila sigue siendo una tabla con
ícono fijo y texto fluido. El ícono conserva su tamaño desktop, pero el texto
se adapta al ancho disponible sin cortarse ni desbordarse. La media query
perdida es solo una mejora de tamaño y espaciado.

Colores vía `mj-class` de `@partials/colors.mjml`, salvo la excepción acotada
del título dentro del HTML crudo de `mj-table`:

| Mecanismo | Valor | Dónde |
|---|---|---|
| `bg-gris-claro` | `#F2F4F8` | `mj-body` |
| `bg-celeste-claro` | `#F5F8FF` | `mj-section` (la caja) |
| Hex inline autorizado | `#002A8D` | el `<p>` del título |
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
