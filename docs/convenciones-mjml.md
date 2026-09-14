# Convenciones MJML

Reglas obligatorias para cualquier fragmento de este repo. No son preferencias
de estilo: cada una existe porque algo se rompe en AED o en algún cliente de
correo cuando no se cumple.

---

## 1. `padding="0px"` explícito en `mj-column` y `mj-image`

MJML aplica paddings por defecto (por ejemplo `10px 25px` en varios
componentes). Si no se declaran, el fragmento se ve distinto según dónde se
pegue y aparecen espacios que nadie pidió.

```xml
<!-- ✅ -->
<mj-column width="100%" padding="0px">
  <mj-image src="..." padding="0px" />
</mj-column>

<!-- ❌ hereda los defaults de MJML -->
<mj-column>
  <mj-image src="..." />
</mj-column>
```

El espaciado interno se declara donde corresponde al diseño (normalmente en el
`mj-text`), nunca se deja al default.

## 2. `text-align` explícito en `mj-section`

El default de MJML es `center`. En BCP la mayoría de fragmentos son alineados a
la izquierda, y heredar el centrado genera correcciones a mano en AED.

```xml
<!-- ✅ -->
<mj-section text-align="left" padding="0px">

<!-- ❌ -->
<mj-section>
```

Si un fragmento debe ir centrado, se escribe `text-align="center"` igual de
explícito. La regla es **declararlo siempre**, no un valor fijo.

## 3. Estilos inline; `<mj-style>` solo para media queries

Todo estilo visual (colores, tipografía, espaciados) tiene que terminar
**inline** en el HTML compilado. Lo único que va en `<mj-style>` son las
**media queries** del responsive, porque no se pueden escribir inline.

Por qué se permite ese `<style>`: los cierres de `references/`, que ya se usan
en AED, llevan su `<style>` con media queries al principio del fragmento y
funcionan. Además, sin él las columnas de MJML se apilan hasta en desktop,
porque MJML deja su CSS de columnas en el `<head>` y el `<head>` no se pega en
AED. Por eso `npm run build` emite los `<style>` del head **delante** del
contenido: el `.html` de `dist/` se pega completo.

Reglas para ese `<mj-style>`:

- Solo `@media`. Nada que también se pueda resolver inline.
- Clases con el nombre del fragmento como prefijo
  (`.cierre-consumo-icono`, no `.icono`): si se pegan varios fragmentos en un
  mismo correo, sus estilos conviven sin pisarse.
- Sin `inline="inline"`: esa variante la inlinea MJML y no sirve para media
  queries.

```xml
<mj-head>
  <mj-style>
    @media only screen and (max-width:480px) {
      .cierre-enalta-firma-txt div { text-align:center !important; }
    }
  </mj-style>
</mj-head>
```

Si un fragmento no cambia de layout en mobile, no lleva `<mj-style>`.

### Filas ícono + texto: `mj-table`, no columnas

Dos `mj-column` en una sección se apilan en mobile. Para un ícono al lado de
un texto que tiene que seguir al lado en cualquier ancho, usar `mj-table` con
el color por `mj-class` (ver `cierre-bex`). `mj-group` también evita el
apilado, pero en mobile convierte los anchos en porcentajes y el ícono se
achica.

Si dentro de un `mj-table` hay **tablas anidadas**, llevan
`color:inherit;font-family:inherit;font-size:inherit;line-height:inherit;`: sin
doctype (modo quirks) las tablas no heredan esas propiedades y el texto sale
negro a 16px.

```xml
<!-- ✅ atributos nativos: MJML los compila a style inline -->
<mj-text
  mj-class="txt-azul-oscuro"
  align="left"
  font-family="Flexo, Arial, Helvetica, sans-serif"
  font-size="14px"
  line-height="20px"
  padding="0px 24px 24px 24px"
>
  Texto
</mj-text>
```

Prohibido en fragmentos:

- `<mj-style>` / `<style>` para cualquier cosa que no sea una media query
- `css-class` apuntando a hojas externas
- `!important` y selectores CSS fuera de las media queries

**Sí está permitido `mj-class`**: MJML lo resuelve en tiempo de compilación y el
resultado queda inline, así que es seguro en AED. Es el mecanismo que usamos
para los colores (regla 3b).

## 3b. Colores por `mj-class`, nunca hex sueltos

Los colores viven en `src/partials/colors.mjml` y se aplican con `mj-class`. En
el fragmento no se escribe un hex a mano:

```xml
<mj-head>
  <mj-include path="@partials/colors.mjml" />
</mj-head>

<mj-body mj-class="bg-gris-claro" width="600px">
  <mj-section mj-class="bg-blanco" padding="0px" text-align="center">
    <mj-column mj-class="bg-celeste borde-azul-claro" width="416px" padding="16px">
      <mj-text mj-class="txt-azul-oscuro" ...>
```

Se pueden encadenar varias separadas por espacio (`bg-celeste borde-azul-claro`).

### Nombres: por color, no por uso

Las clases se llaman como el color (`azul`, `celeste`, `gris-claro`), **nunca
como el lugar donde se usan** (`bg-tarjeta`, `txt-destacado`). El mismo color va
a ser fondo de tarjeta en un fragmento y borde en otro; un nombre atado a un uso
miente en cuanto aparece el segundo fragmento.

El prefijo es únicamente el atributo CSS que la clase setea:

| Prefijo | Atributo |
|---|---|
| `bg-*` | `background-color` |
| `txt-*` | `color` |
| `borde-*` | `border` (1px solid) |

Existe porque una `mj-class` fija un atributo concreto: no hay forma de que un
solo nombre `azul` sirva a la vez para texto y para fondo.

Cada prefijo hace lo que dice y nada más: poner una `bg-*` en un `mj-text` le da
fondo al texto, no lo colorea.

El partial define **solo las variantes en uso**, no las tres de cada color por
si acaso. Si necesitás una que no está (`txt-celeste`, por ejemplo), agregala:
es una línea. Y si el color entero no está, agregalo también ahí — nunca un hex
suelto en el fragmento. Así cuando llegue la paleta oficial se cambia en un solo
lugar y un `npm run build` lo propaga a todos los fragmentos.

### El build valida los nombres

**MJML no avisa si escribís mal una `mj-class`**: compila sin errores y aplica
el default, que para un texto es negro. Un typo se te va a producción sin que
nada chille.

Por eso `npm run build` valida los nombres por su cuenta y falla si un fragmento
usa una clase que no está definida en los partials que incluye:

```
  ERROR  src/fragments/banners/banner-monto/banner-monto.mjml
         mj-class sin definir: txt-azul-oscuroo
         Revisá el nombre o incluí el partial que la define.
```

También salta si usás clases correctas pero te olvidaste el
`<mj-include path="@partials/colors.mjml" />`.

**Por qué los colores sí pueden salir del `<head>` y la tipografía no:** una
`mj-class` se resuelve al compilar y el color queda escrito inline en el HTML,
así que sobrevive intacto a AED. La `font-family`, en cambio, depende de un
`<link>`/`@font-face` que vive en el `<head>` y **no viaja** con el fragmento —
por eso la regla 4 obliga a repetirla en cada componente.

## 4. `font-family` explícita en cada `mj-text` / `mj-button`

La tipografía del repo es **Flexo**, la corporativa de BCP. El stack es siempre
este, sin excepciones:

```xml
font-family="Flexo, Arial, Helvetica, sans-serif"
```

Va escrito **en cada `mj-text` y cada `mj-button`**, aunque el fragmento ya
incluya `@partials/fonts.mjml`. El partial define el default para la vista
previa, pero ese `<head>` no viaja cuando el fragmento se pega dentro de una
plantilla de AED: si la `font-family` no está inline en cada componente, el
texto cae a la fuente por defecto del cliente.

Pesos disponibles: `400` (Regular), `600` (Demi), `700` (Bold). No usar otros:
el navegador los sintetiza y el resultado se ve deforme.

**Flexo es mejora progresiva, no una garantía.** Gmail (web y app), Outlook de
Windows y Yahoo no cargan webfonts y siempre van a renderizar Arial — o sea, la
mayoría del tráfico. El diseño tiene que funcionar igual con Arial; si algo se
rompe al caer al fallback, el problema es el diseño.

El `@font-face` y el hosting de los `.woff2` no son responsabilidad del
fragmento: ver `src/partials/fonts.mjml`.

## 5. Un fragmento = una carpeta

```
src/fragments/<categoria>/<nombre-fragmento>/
├── <nombre-fragmento>.mjml
└── README.md
```

- `kebab-case`, en español.
- El `.mjml` se llama igual que su carpeta.
- El `README.md` indica qué es, dónde se usa y qué hay que reemplazar
  (imágenes, copy, links).

## 6. Esqueleto base de todo fragmento

**Todos** los fragmentos arrancan del mismo esqueleto. No es opcional ni
depende de la categoría:

```xml
<mjml>
  <mj-head>
    <mj-include path="@partials/fonts.mjml" />
    <mj-include path="@partials/colors.mjml" />
  </mj-head>

  <mj-body mj-class="bg-gris-claro" width="600px">
    <mj-section mj-class="bg-blanco" padding="0px" text-align="left">
      <mj-column width="100%" padding="0px">

        <!-- contenido del fragmento -->

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

Qué fija cada cosa:

| Atributo | Valor | Por qué |
|---|---|---|
| `mj-body mj-class="bg-gris-claro"` | `#F2F4F8` | Gris de fondo de la página del correo, el que rodea la tarjeta blanca. |
| `mj-body width` | `600px` | Ancho estándar de todos los correos del repo. |
| `mj-section mj-class="bg-blanco"` | `#FFFFFF` | La tarjeta blanca donde vive el contenido. |
| `mj-section padding` | `0px` | Regla 1. |
| `mj-section text-align` | según el caso | Regla 2: se declara siempre, pero el valor lo decide el fragmento (ver abajo). |

**Cuidado con `text-align` cuando la columna tiene ancho fijo.** MJML renderiza
las columnas como `inline-block`, así que el `text-align` del `mj-section` es lo
que decide dónde queda la columna dentro de los 600px:

- Columna a `width="100%"` → el valor no cambia la posición de la columna;
  usar `left`.
- Columna más angosta que el section (ej. una tarjeta de `416px`) → `center` la
  deja centrada, `left` la pega al borde izquierdo. Ahí va `center` **escrito
  explícitamente**, no heredado del default de MJML.

> **Esto lo escribe el desarrollador a mano en cada fragmento.** El build
> **no** lo inyecta, no hay generador ni plantilla que lo agregue solo. La
> razón es que el `.mjml` tiene que ser exactamente lo que se ve en el archivo:
> si el build agregara wrappers por su cuenta, el fuente dejaría de
> corresponderse con el HTML de `dist/` y se vuelve imposible depurar qué pasó
> cuando algo se rompe en AED.

(MJML trata `0` y `0px` como equivalentes; en este repo se escribe `0px`
para que quede parejo con el resto de los paddings.)

El resultado es un `<mjml>` válido de punta a punta. El `.html` que genera el
build ya no es un documento completo sino el fragmento listo para pegar: los
`<style>` y a continuación el contenido. Se copia **entero** a AED (ver
[`guia-aed.md`](guia-aed.md)).

## 7. Imágenes

- `src` absoluto y con HTTPS. Nada de rutas relativas.
- `alt` siempre presente y descriptivo (accesibilidad + cuando el cliente
  bloquea imágenes).
- `width` explícito en px, igual al ancho real del asset.
- `fluid-on-mobile="true"` en imágenes que ocupan todo el ancho.
- Mientras el asset final no exista, dejar un placeholder y marcarlo con un
  comentario `PENDIENTE:` en el `.mjml`.

## 8. Compartido va en `src/partials/`

Si una pieza se repite en dos o más fragmentos, va a `src/partials/` y se
incluye con el alias `@partials/`, que funciona desde cualquier profundidad.
Hoy los partials están vacíos (falta definir paleta, tipografía y redes); no
llenarlos con valores tentativos, esperar los oficiales.

```xml
<mj-include path="@partials/colors.mjml" />
```

No usar rutas relativas del tipo `../../../partials/colors.mjml`: se rompen al
mover el fragmento de categoría.

## 9. Se commitea el `.mjml` y el `.html`

`dist/` está versionado a propósito. Antes de commitear, correr `npm run build`
para que fuente y compilado no queden desfasados.

## 10. Validación estricta

El build corre con `validationLevel: 'strict'`: atributos o etiquetas inválidas
hacen fallar `npm run build`. No bajar el nivel para "que pase"; corregir el
fragmento.
