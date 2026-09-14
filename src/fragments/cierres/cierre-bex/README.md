# Cierre BEX (Banca Exclusiva Digital)

Bloque de cierre sobre fondo azul marino con el logo BCP, el contacto del
Ejecutivo de Banca Exclusiva Digital y sus datos personalizados vía Adobe
Campaign.

## Origen

Reconstruido a partir de `references/cierre/cierre-bex.html` y comparado
visualmente contra esa referencia en desktop (640px) y mobile (375px).

## Archivos

- Fuente: `cierre-bex.mjml`
- Compilado: `dist/cierres/cierre-bex/cierre-bex.html`

## Variables a reemplazar

| Marcador | Qué es |
|---|---|
| `<nombre y apellidos></nombre>` | Se conserva **tal cual viene en la referencia**, sin escapar. El navegador lo toma como una etiqueta HTML vacía, así que **no se ve** (igual que en la referencia). |
| `<%= targetData.DESCORREOEENNPRINCIPAL %>` | Tag de personalización de Adobe Campaign: correo del ejecutivo. Se deja tal cual, lo resuelve el envío. |
| `<%= targetData.DESCELULAREENNPRINCIPAL %>` | Igual, para el celular. |

El teléfono `(01) 20-50-500` es texto fijo.

## Estructura

- Una sola sección con laterales de 25px (24px de margen + 1px de borde del
  mismo color en la referencia; con 24px el texto corta en otra palabra).
- Filas ícono + texto con `mj-table`: se mantienen lado a lado en mobile y el
  texto queda centrado verticalmente con el ícono.
- No cambia de layout en mobile, así que no lleva `<mj-style>`.

## Pendientes

- Logo e íconos usan las URLs de la referencia
  (`bcp-mid-stage13-res.adobe-campaign.com`, un ambiente **stage** de Adobe
  Campaign). Cargan hoy pero no es el CDN definitivo de BCP.
- Colores (`bg-azul-marino` `#001F5A`, `txt-blanco` `#FFFFFF`) tomados de la
  referencia, **no validados contra el brandbook**.
- Confirmar que los tags `targetData.*` siguen vigentes para este segmento.
