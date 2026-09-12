# Banner monto preaprobado

Tarjeta centrada con fondo celeste y borde azul que muestra el monto
preaprobado del cliente, con su fecha de vigencia.

## Archivos

- Fuente: `banner-monto.mjml`
- Compilado: `dist/banners/banner-monto/banner-monto.html`

## Variables a reemplazar

| Marcador | Qué es |
|---|---|
| `{S/XXXX}` | Monto preaprobado. Se personaliza por cliente desde Adobe Campaign. |
| `Vigente hasta el 31 de enero de 2026.` | Fecha de vigencia, hardcodeada. Si cambia por campaña, hay que convertirla también en variable. |

## Estructura

- Section blanco a 600px, `text-align="center"` para centrar la tarjeta.
- Columna de `416px` con fondo `#eaf1fb`, borde `1px solid #70A9FF` y
  `border-radius: 12px`.
- Tres `mj-text` centrados: bajada, monto (48px) y vigencia.
- Tipografía **Flexo** (`Flexo, Arial, Helvetica, sans-serif`) en los tres,
  vía `@partials/fonts.mjml` + el atributo explícito en cada componente.
  Pesos 700 y 400, ambos disponibles en `src/assets/fonts/`.

Colores, todos vía `mj-class` de `@partials/colors.mjml`:

| `mj-class` | Hex | Dónde |
|---|---|---|
| `bg-gris-claro` | `#F2F4F8` | `mj-body` |
| `bg-blanco` | `#FFFFFF` | `mj-section` |
| `bg-celeste` | `#EAF1FB` | `mj-column` |
| `borde-azul-claro` | `1px solid #70A9FF` | `mj-column` |
| `txt-azul-oscuro` | `#202E44` | bajada y vigencia |
| `txt-azul` | `#002A8D` | el monto |

## Pendientes

- Los `padding` de los dos últimos `mj-text` (`10px 25px` y `0px 25px`) venían
  de los defaults de MJML; se dejaron explícitos para no cambiar el render, pero
  falta confirmar contra el diseño si son los valores correctos. Están marcados
  con `REVISAR:` en el `.mjml`.
- `border-radius` no lo soporta Outlook de escritorio: ahí la tarjeta se ve con
  esquinas rectas. Es degradación aceptable, pero conviene validarlo con el
  equipo de diseño.
- El monto en 48px se va a ver en **Arial** en Gmail y Outlook Windows, que no
  cargan webfonts. Vale la pena revisar ese bloque en Arial, que es más ancho
  que Flexo y podría desbordar los 416px con montos largos.
- Los colores de este fragmento son el origen de `@partials/colors.mjml`, pero
  **no están validados contra el brandbook**. Cuando llegue la paleta oficial se
  corrigen ahí y un `npm run build` los propaga.
