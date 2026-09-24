# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Todo el repo (docs, comentarios, mensajes de commit) está en español. Mantené ese idioma.

## Qué es esto

Fragmentos **MJML** que se compilan a **HTML** para pegar en **Adobe Email Designer (AED)**.
No es una app: no hay servidor, ni tests, ni CI. El entregable es el HTML de `dist/`.

Es de uso general en BCP, no de un solo squad: cualquier equipo copia un `.html` de
`dist/` y lo pega en AED. Eso condiciona todo lo demás.

## Comandos

```bash
npm install          # Node >= 18
npm run build        # compila src/fragments/**/*.mjml -> dist/
npm run build:watch  # recompila al guardar
npm run clean        # borra dist/ entero
npm run pesos        # tabla Markdown de peso referencia vs. MJML, para CHANGELOG.md
```

No hay suite de tests ni linter. **La verificación es `npm run build`**: falla con exit 1
ante MJML inválido o una `mj-class` inexistente. Correlo siempre antes de commitear.

`build` no es incremental: recompila todo, así que un cambio en un partial se propaga de una.

## Arquitectura

### El pipeline

`src/fragments/<categoría>/<fragmento>/<fragmento>.mjml` → `scripts/build.js` →
`dist/<categoría>/<fragmento>/<fragmento>.html`, con la misma ruta relativa.

Las categorías (`banners/`, `cierres/`, …) no se registran en ningún lado: el build
recorre `src/fragments/` recursivamente y toma cualquier `.mjml` a cualquier profundidad.

**`dist/` se versiona a propósito** y se commitea junto con su `.mjml`. Un fuente cambiado
sin recompilar es peor que no haber tocado nada: el repo miente sin que se note. Ya pasó
una vez (commit `1a0aa71` reformateó un `.mjml` sin rebuildear).

### Las tres piezas no obvias de `scripts/build.js`

**1. `toPasteable()` — por qué el HTML no es un documento completo.**
En AED el fragmento se pega dentro de una plantilla, y **el `<head>` no viaja**. Con él se
perderían las media queries de MJML. Por eso el build extrae los `<style>` del `<head>` y
los emite **delante del contenido del body**, sin `<html>`, `<head>` ni `<body>`. El
`.html` resultante se copia entero a AED.

**2. `findUndefinedClasses()` — la validación que MJML no hace.**
Ante un typo en una `mj-class`, MJML compila sin error y deja el texto en negro. El build
resuelve los `mj-include` recursivamente, junta las `mj-class` definidas y falla si se usa
una que no existe. Sin esto un nombre mal escrito llega a producción en silencio.

**3. `pruneOrphans()` — limpieza de `dist/`.**
Borra el HTML cuyo `.mjml` ya no existe y las carpetas vacías. Poda solo huérfanos en vez
de vaciar `dist/` antes de compilar: si el build falla a mitad, el HTML válido sigue ahí.
Ese borrado igual hay que commitearlo.

### El alias `@partials/`

`mjml.config.js` define un preprocesador que reescribe `@partials/x.mjml` a la ruta
absoluta de `src/partials/x.mjml` antes de que MJML parsee. Permite incluir desde
cualquier profundidad sin rutas relativas frágiles:

```xml
<mj-include path="@partials/colors.mjml" />
```

`validationLevel: 'strict'`. No bajarlo para que pase un fragmento.

### `npm run pesos` depende de los README

Toma la referencia de cada fragmento leyendo **la primera ruta `` `references/...html` ``
entre backticks en su `README.md`**. Si un README no la tiene, el fragmento se omite de la
tabla.

## Reglas al escribir fragmentos

El detalle está en [`docs/convenciones-mjml.md`](docs/convenciones-mjml.md), que **no es
opcional**: cada regla existe porque AED rompe algo. Lo que más impacta:

- **El layout no puede depender del `<style>`.** En AED se puede "romper" (desvincular) un
  fragmento, y ahí el `<style>` no sobrevive. Para filas de ícono + texto se usa `mj-table`
  con celda de ícono fija y celda de texto fluida — responsive por construcción. **No usar
  `mj-group`**: compila los anchos a porcentajes fijos inline y la fila no refluye.
- **`<mj-style>` solo para media queries**, con clases prefijadas por el nombre del
  fragmento (`.cierre-consumo-icono`, no `.icono`), para que varios fragmentos convivan en
  un mismo correo. Lo que quede ahí debe ser mejora, nunca requisito.
- **Colores por `mj-class` de `@partials/colors.mjml`, nunca un hex suelto.** Única
  excepción, documentada en la regla 3b: un hex inline para el color del título dentro del
  HTML crudo de un `mj-table` (que no procesa `mj-class` ahí adentro).
- **`font-family="Flexo, Arial, Helvetica, sans-serif"` explícita** en cada `mj-text`,
  `mj-button` y `mj-table`, aunque el partial esté incluido. Los colores se resuelven al
  compilar y quedan inline; la fuente depende de un `@font-face` que vive en el `<head>`
  que no viaja.
- **Un fragmento = una carpeta**, en `kebab-case`, con el `.mjml` llamado igual que la
  carpeta y un `README.md` que diga qué reemplazar y qué queda pendiente.

## Contenido: no corregir las referencias

El copy, los datos y los placeholders de `references/` se conservan **tal cual vienen**,
aunque tengan errores o sean de una campaña concreta. Si algo parece un typo, se deja y se
anota en el README del fragmento.

Lo mismo con `src/partials/social-links.mjml`: está **vacío a propósito** porque íconos,
CDN y URLs no están definidos, y no tiene sentido versionar valores inventados que alguien
podría copiar creyendo que están aprobados. Mientras esté así **no se puede incluir**:
un `mj-include` a un archivo sin elemento raíz rompe el build.

## Pendientes que condicionan el trabajo

- **Flexo no se ve** hasta que los `.woff2` de `src/assets/fonts/` estén en una URL HTTPS
  del CDN de BCP y el `@font-face` esté en el `<head>` de la plantilla de AED (una sola vez
  ahí, no por fragmento). Hasta entonces todo cae a Arial — y Gmail y Outlook Windows van a
  mostrar Arial igual, porque no cargan webfonts. El diseño tiene que funcionar en Arial.
- Las imágenes usan URLs del stage de Adobe Campaign
  (`bcp-mid-stage13-res.adobe-campaign.com`), no el CDN definitivo.
- Los colores de `colors.mjml` salieron de las referencias y **no están validados contra el
  brandbook**.
- Los `banner-destacado-*` no replican el `<v:roundrect>` de VML de sus referencias: en
  Outlook de escritorio las esquinas se ven rectas. Ese VML lleva la altura de la caja
  escrita a mano y se rompe apenas cambia el copy.
- `docs/guia-aed.md` es un esqueleto por completar.
