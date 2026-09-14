# BCP AED Fragments

Repositorio de **fragmentos MJML** que se compilan a **HTML** listo para pegar en
**Adobe Email Designer (AED)**.

Es de **uso general en BCP**: no pertenece a un solo squad. Cualquier equipo que
arme correos en AED puede tomar un fragmento de `dist/`, pegarlo y ajustar copy,
imágenes y links.

## Por qué MJML

AED permite pegar HTML, pero escribir HTML de correo a mano (tablas anidadas,
hacks para Outlook, media queries) es lento y frágil. MJML genera ese HTML
compatible a partir de un markup mucho más corto, y aquí lo versionamos junto
con su salida compilada.

## Estructura

```
src/
  fragments/        # el código fuente .mjml — una carpeta por fragmento
    banners/
      banner-monto/
  partials/         # piezas compartidas (colores, fuentes, redes sociales)
  assets/fonts/     # Flexo .woff2 — pendientes de publicar en el CDN de BCP
dist/               # HTML compilado, versionado — de aquí se copia a AED
scripts/build.js    # compilador src/fragments -> dist
docs/               # convenciones y guía de AED
```

Las carpetas de categoría (`banners/`, `headers/`, `ctas/`, `productos/`, …) se
crean **cuando hace falta**, al agregar el primer fragmento de esa categoría. No
hay que registrarlas en ningún lado: el build recorre `src/fragments/`
recursivamente y toma cualquier `.mjml` que encuentre, a cualquier profundidad.

`dist/` **sí se versiona** a propósito: así un equipo puede copiar el HTML
directamente desde el repo sin instalar Node ni compilar nada.

## Instalación

Requiere Node 18 o superior.

```bash
npm install
```

## Compilar

```bash
npm run build        # compila todo src/fragments/**/*.mjml a dist/
npm run build:watch  # recompila al guardar cambios en src/
npm run clean        # borra dist/ entero
```

`build` recompila **todo** en cada corrida, no es incremental: si tocás un
partial, el cambio llega a todos los fragmentos con un solo build.

Cada `.mjml` genera un `.html` en `dist/` **con la misma ruta relativa**:

```
src/fragments/banners/banner-monto/banner-monto.mjml
  -> dist/banners/banner-monto/banner-monto.html
```

Ese `.html` no es un documento completo: es el fragmento listo para pegar en
AED, con los `<style>` del responsive primero y el contenido después. Se copia
entero.

El build falla (exit code 1) si un fragmento tiene MJML inválido, o si usa una
`mj-class` que no está definida en los partials que incluye:

```
  ERROR  src/fragments/banners/banner-monto/banner-monto.mjml
         mj-class sin definir: txt-azul-oscuroo
         Revisá el nombre o incluí el partial que la define.
```

Esa segunda validación la hace el build, no MJML: **MJML no avisa ante un typo
en una `mj-class`**, compila sin errores y deja el texto en negro. Sin esto, un
nombre mal escrito llega a producción en silencio.

### `dist/` se mantiene solo

El build borra el HTML cuyo `.mjml` de origen ya no existe, y las carpetas que
quedan vacías. Si renombrás o eliminás un fragmento, no queda basura versionada:

```
  borrado dist/ctas/cta-prueba/cta-prueba.html (ya no existe su .mjml)
  borrado dist/ctas/cta-prueba (carpeta vacía)
```

Poda solo los huérfanos, no vacía `dist/` antes de compilar. Es a propósito: si
el build falla a mitad de camino, el HTML válido que ya estaba commiteado sigue
en su lugar. `npm run clean` existe igual para forzar una recompilación desde
cero.

## Convención: un fragmento = una carpeta

Cada fragmento vive en su propia carpeta, con:

- `nombre-del-fragmento.mjml` — el fuente
- `README.md` — corto: qué es, dónde se usa, qué hay que reemplazar
  (imágenes, copy, links) y cualquier detalle de compatibilidad

```
src/fragments/banners/banner-monto/
├── banner-monto.mjml
└── README.md
```

Nombres de carpeta y archivo en `kebab-case`, en español, y el `.mjml` se llama
igual que su carpeta.

## Agregar un fragmento nuevo

1. **Crear la carpeta** bajo la categoría que corresponda en `src/fragments/`.
   Si la categoría no existe, creala: el build la descubre sola, no hay que
   registrarla en ningún lado.
2. **Escribir el `.mjml`** partiendo del **esqueleto base** (abajo) y siguiendo
   [`docs/convenciones-mjml.md`](docs/convenciones-mjml.md) — no son opcionales:
   existen porque AED rompe ciertas cosas.
3. **Colores**: usar las `mj-class` de `@partials/colors.mjml`. Si falta un
   color o una variante, agregala **al partial**, nunca un hex suelto en el
   fragmento.
4. **Tipografía**: `font-family="Flexo, Arial, Helvetica, sans-serif"` en cada
   `mj-text` y cada `mj-button`, sí o sí, aunque el partial esté incluido.
5. **Escribir el `README.md` del fragmento**: qué es, qué hay que reemplazar
   (copy, imágenes, variables de personalización) y qué queda pendiente.
6. **`npm run build`** y revisar el HTML resultante. Si falla, el mensaje dice
   qué corregir — no bajar la validación para que pase.
7. **Commitear el `.mjml` y el `.html` de `dist/`**, juntos. Si van
   desfasados, el equipo que copie de `dist/` se lleva una versión vieja.

### Esqueleto base

Todo fragmento arranca de esta estructura, **escrita a mano**. El build no la
inyecta ni hay generador que la agregue: el `.mjml` tiene que ser exactamente
lo que se ve en el archivo.

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

El `text-align` va siempre, pero el valor depende del fragmento: `center` si la
columna es más angosta que los 600px.

Colores y tipografía se aplican distinto, y **no es una inconsistencia**:

- **Colores** → por `mj-class` de `@partials/colors.mjml`. Nunca un hex suelto
  en el fragmento.
- **Tipografía** → `font-family="Flexo, Arial, Helvetica, sans-serif"` escrita
  en **cada** `mj-text` / `mj-button`, aunque el partial esté incluido.

El motivo: las `mj-class` se resuelven al compilar y el color queda escrito
inline en el HTML, así que sobrevive a AED. La fuente depende de un
`<link>`/`@font-face` que vive en el `<head>`, y ese `<head>` **no viaja** con el
fragmento cuando se pega en AED.

El detalle de por qué cada valor está en
[`docs/convenciones-mjml.md`](docs/convenciones-mjml.md#6-esqueleto-base-de-todo-fragmento).

## Modificar un fragmento existente

Correr `npm run build` **antes de commitear**, siempre. El `.html` de `dist/` es
lo que otros equipos copian: un fuente cambiado sin recompilar es peor que no
haber tocado nada, porque el repo miente sin que se note.

Si **renombrás o borrás** un fragmento, el build limpia su HTML viejo de `dist/`
solo — pero ese borrado igual hay que commitearlo.

## Cambiar un partial

`colors.mjml` y `fonts.mjml` los usan todos los fragmentos, así que un cambio
ahí no es local. `npm run build` recompila **todo** y lo propaga de una.

Antes de commitear, mirá el `git diff` de `dist/`: ahí se ve exactamente qué
fragmentos quedaron afectados y si alguno cambió de una forma que no esperabas.

## Compartido entre fragmentos

`src/partials/` es donde van las piezas comunes.

- `fonts.mjml` — **Flexo**, la tipografía corporativa. Los `.woff2` están en
  `src/assets/fonts/`. Todo fragmento lo incluye.
- `colors.mjml` — la paleta como `mj-class`, nombradas **por color**
  (`bg-celeste`, `txt-azul`) y no por uso, porque el mismo color va a ser fondo
  en un fragmento y borde en otro. El prefijo indica el atributo: `bg-` →
  `background-color`, `txt-` → `color`, `borde-` → `border`. Están solo las
  variantes en uso; agregar una que falte es una línea. Los valores salieron de
  `banner-monto` y **no están validados contra el brandbook** todavía.
- `social-links.mjml` — **vacío a propósito**: íconos, CDN y URLs todavía no
  están definidos, y no tiene sentido versionar valores inventados que alguien
  podría copiar creyendo que están aprobados.

Se incluyen con el alias `@partials/`, que funciona desde cualquier profundidad:

```xml
<mj-head>
  <mj-include path="@partials/fonts.mjml" />
  <mj-include path="@partials/colors.mjml" />
</mj-head>
```

El alias lo resuelve un preprocesador definido en `mjml.config.js`.

## Documentación

- [`docs/convenciones-mjml.md`](docs/convenciones-mjml.md) — reglas obligatorias al escribir fragmentos
- [`docs/guia-aed.md`](docs/guia-aed.md) — cómo llevar un fragmento a AED

## Pendientes conocidos

- `src/partials/colors.mjml` tiene los colores de `banner-monto`, no la paleta
  oficial. Falta validarlos contra el brandbook BCP y completar los que falten.
- **Flexo no se va a ver hasta que los `.woff2` estén publicados en una URL
  HTTPS del CDN de BCP y el `@font-face` esté declarado en el `<head>` de la
  plantilla de AED** (una sola vez ahí, no repetido en cada fragmento).
  Hasta entonces todo se renderiza en Arial. Detalle en
  `src/partials/fonts.mjml`.
- `src/partials/social-links.mjml` vacío: faltan íconos, CDN y URLs oficiales.
  Mientras esté así **no se puede incluir** (rompe el build).
- Fragmentos existentes: `banners/banner-monto` y tres cierres
  (`cierres/cierre-bex`, `cierres/cierre-enalta`, `cierres/cierre-consumo`),
  normalizados a partir de `references/cierre/`. Sus imágenes usan las URLs
  originales de un ambiente stage de Adobe Campaign
  (`bcp-mid-stage13-res.adobe-campaign.com`), no el CDN definitivo de BCP —
  migrar cuando exista. El contenido (textos, datos del asesor, placeholders)
  se conserva tal cual viene en cada referencia, sin correcciones.
- `docs/guia-aed.md` es un esqueleto por completar.
- Sin integración con Adobe Campaign ni deploy automatizado (fuera de alcance
  por ahora).
