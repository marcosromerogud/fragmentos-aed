# Bitácora

Registro de lo que se va logrando en el repositorio, versión por versión.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y numeración [SemVer](https://semver.org/lang/es/):

- **MAJOR**: cambia la forma de usar los fragmentos (build, alias, estructura
  de `dist/`) y hay que avisar a quien los pega en AED.
- **MINOR**: fragmentos nuevos.
- **PATCH**: ajustes a fragmentos existentes (espaciados, textos, colores).

## Cómo leer las tablas de peso

Se generan con `npm run build && npm run pesos` y comparan cada referencia de
`references/` contra su HTML compilado en `dist/`.

- **Bruto**: el archivo tal cual. Exagera la mejora porque las referencias
  vienen con muchísima indentación.
- **Compacto**: sin espacios entre etiquetas. **Es la comparación justa.**
- **Gzip**: el compacto comprimido, lo que realmente viaja por la red.
- **CSS**: bytes dentro de `<style>`. Las referencias arrastran el CSS global
  de la plantilla de AED; los fragmentos solo llevan el suyo.

Para tener en cuenta: Gmail recorta los correos que pasan de ~102 KB (en
bruto), así que el peso de cada fragmento cuenta para el correo completo.

---

## [Sin publicar]

### Agregado

- Familia `banners/banner-destacado`: seis variantes del mismo bloque de
  ícono + título + texto, reconstruidas desde `references/banner/`.

  | | Ícono en fila (mobile) | Ícono apilado (mobile) |
  |---|---|---|
  | Fondo blanco | `banner-destacado-fondo-blanco` | `banner-destacado-vertical-fondo-blanco` |
  | Sin bordes | `banner-destacado-sin-bordes` | `banner-destacado-vertical-sin-bordes` |
  | Full width | `banner-destacado-full-width` | `banner-destacado-vertical-full-width` |

- Referencias originales en `references/banner/` (las seis, con el prefijo
  `[Temporal]` que traían).
- Colores nuevos en `src/partials/colors.mjml`: `bg-celeste-claro` (`#F5F8FF`),
  `borde-azul-medio` (`#3D77FF`) y `borde-celeste-claro` (`1px solid #F5F8FF`).
- `npm run pesos`: tabla de peso referencia vs. MJML para esta bitácora.
- `CHANGELOG.md`.

### Criterios

- El copy se conserva **tal cual la referencia** (`Participa por 1 Kit Apple`),
  aunque sea de una campaña concreta y haya que reemplazarlo en cada uso.
- Las seis se compararon contra su referencia en el navegador a **600px y
  375px**, midiendo posición y ancho del ícono y del texto y altura del bloque:
  coinciden exactamente en los dos anchos. Dos medidas salieron de esa
  comparación y no del markup: la celda del ícono mide **124px** en desktop
  (declara 104 + 20 de padding) y **92px** / **112px** en mobile.
- Las tres variantes en fila usan `mj-group`, que `docs/convenciones-mjml.md`
  desaconseja para filas de ícono + texto porque achica el ícono. Acá eso es
  justo lo que hace la referencia, y la media query fija el tamaño final.
- **No se replicó el `<v:roundrect>` de VML** que las referencias usaban para
  redondear las esquinas en Outlook de escritorio: lleva la altura de la caja
  escrita a mano (`height:115pt`) y se rompe apenas cambia el copy. En Outlook
  las esquinas quedan rectas; el color y el borde, correctos.

### Peso: referencia → MJML

| Fragmento | Bruto | Compacto | Gzip | CSS | Tablas |
|---|---|---|---|---|---|
| `banners/banner-destacado-fondo-blanco` | 4.3 KB → 8.6 KB (+99%) | 4.2 KB → 6.7 KB (+60%) | 1.5 KB → 1.6 KB (+9%) | 0.4 KB → 2.3 KB | 10 → 12 |
| `banners/banner-destacado-sin-bordes` | 4.3 KB → 8.6 KB (+99%) | 4.2 KB → 6.7 KB (+60%) | 1.5 KB → 1.6 KB (+10%) | 0.4 KB → 2.3 KB | 10 → 12 |
| `banners/banner-destacado-full-width` | 3.9 KB → 7.3 KB (+89%) | 3.7 KB → 5.7 KB (+52%) | 1.4 KB → 1.5 KB (+7%) | 0.4 KB → 2.1 KB | 8 → 9 |
| `banners/banner-destacado-vertical-fondo-blanco` | 4.3 KB → 7.9 KB (+84%) | 4.1 KB → 6.1 KB (+49%) | 1.4 KB → 1.4 KB (+1%) | 0.4 KB → 1.8 KB | 10 → 11 |
| `banners/banner-destacado-vertical-sin-bordes` | 4.3 KB → 7.9 KB (+83%) | 4.1 KB → 6.1 KB (+48%) | 1.4 KB → 1.5 KB (+2%) | 0.4 KB → 1.8 KB | 10 → 11 |
| `banners/banner-destacado-vertical-full-width` | 4.3 KB → 6.6 KB (+55%) | 4.1 KB → 5.1 KB (+24%) | 1.4 KB → 1.4 KB (-5%) | 0.4 KB → 1.6 KB | 10 → 8 |

Lectura: **estos fragmentos pesan más que su referencia**, al revés que los
cierres. No es una regresión: las referencias de banner ya venían compactas y
casi sin CSS (0.4 KB), así que no había CSS global de AED que sacar, y MJML
suma el suyo propio (clases de columna, media queries, soporte Outlook y
Mozilla). En **gzip**, que es lo que viaja, la diferencia va de -5% a +10%: en
la práctica, lo mismo. Lo que se gana acá es mantenimiento, no bytes.

## [1.0.0] — 2026-09-14

Primeros fragmentos reconstruidos desde referencias reales de AED.

### Agregado

- `cierres/cierre-bex`: cierre Banca Exclusiva Digital, con los tags de
  personalización de Adobe Campaign.
- `cierres/cierre-enalta`: cierre BCP Enalta con contacto y firma del asesor.
- `cierres/cierre-consumo`: cierre genérico con WhatsApp, Facebook y reclamos.
- Referencias originales en `references/cierre/`.

### Criterios

- El contenido se conserva **tal cual la referencia**: textos, datos y
  placeholders, incluso los que parecen errores (`<nombre y apellidos>` sin
  escapar en bex, "Escribenos" sin tilde en consumo).
- Cada fragmento se comparó al píxel contra su referencia en desktop (640px)
  y mobile (375px). En consumo se copió el reparto desparejo de columnas de la
  referencia (175 + 10 + 175 + 10, la tercera alineada a la derecha).

### Peso: referencia → MJML

| Fragmento | Bruto | Compacto | Gzip | CSS | Tablas |
|---|---|---|---|---|---|
| `cierres/cierre-bex` | 26.9 KB → 6.2 KB (-77%) | 9.7 KB → 4.7 KB (-52%) | 2.0 KB → 1.4 KB (-34%) | 12.9 KB → 1.0 KB | 12 → 8 |
| `cierres/cierre-consumo` | 28.1 KB → 16.3 KB (-42%) | 16.6 KB → 12.2 KB (-27%) | 2.5 KB → 1.8 KB (-29%) | 9.4 KB → 2.0 KB | 32 → 29 |
| `cierres/cierre-enalta` | 10.6 KB → 13.2 KB (+25%) | 9.8 KB → 9.8 KB (+1%) | 1.9 KB → 1.8 KB (-9%) | 0.8 KB → 1.7 KB | 22 → 21 |
| **Total** | 65.5 KB → 35.8 KB (-45%) | 36.1 KB → 26.7 KB (-26%) | 6.5 KB → 4.9 KB (-24%) | | |

Lectura:

- **bex** y **consumo** bajan de verdad: la mayor parte del ahorro viene de
  sacar el CSS global de la plantilla que traían pegado.
- **enalta** no baja: su referencia ya venía compacta y casi sin CSS, y MJML
  agrega su propio CSS responsive (clases de columna, media queries, soporte
  Outlook). En bruto pesa **más** (+25%), porque `dist/` sale sin minificar
  para poder leerlo. La ganancia ahí es de mantenimiento, no de peso.

## [0.1.0] — 2026-09-11

### Agregado

- Arquitectura del repo: `src/fragments/` → `dist/` con `npm run build`,
  alias `@partials/`, validación `strict` y watch.
- Partials de colores y fuentes; fuentes Flexo en `src/assets/fonts/`.
- Primer fragmento: `banners/banner-monto` (sin referencia de origen, no entra
  en la tabla de pesos).
- Documentación: `README.md`, `docs/convenciones-mjml.md`, `docs/guia-aed.md`.
