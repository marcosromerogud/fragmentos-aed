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

- `npm run pesos`: tabla de peso referencia vs. MJML para esta bitácora.
- `CHANGELOG.md`.

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
