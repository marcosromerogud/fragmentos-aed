# Cierre Enalta

Bloque de cierre sobre fondo vino: header con el logo BCP Enalta y una forma
decorativa, contacto del Asesor Financiero y su firma con nombre y cargo.

## Origen

Reconstruido a partir de `references/cierre/cierre-enalta.html` y comparado
visualmente contra esa referencia en desktop (640px) y mobile (375px).

Los datos del asesor (firma, nombre, cargo y celular) se conservan **tal cual
vienen en la referencia**. Si otra campaña usa otro asesor, se cambian a mano.

## Archivos

- Fuente: `cierre-enalta.mjml`
- Compilado: `dist/cierres/cierre-enalta/cierre-enalta.html`

## Contenido de la referencia

| Dato | Valor |
|---|---|
| Nombre | `Fiorella Pastor Vargas` |
| Cargo | `Gerente de Área de Medios de Pago BCP Enalta` |
| Celular | `<+51 965 573 492>` (con los `< >` de la referencia) |
| Firma | Imagen de la referencia, 125×66. |
| Correo | `consultasbcp@bcp.com.pe` |

"Nombres y Apellidos:" es texto fijo, igual que en la referencia.

## Estructura

- Header de 62px de alto: logo abajo a la izquierda y forma decorativa pegada
  arriba y al borde derecho. En mobile la forma gana 24px de margen derecho.
- Laterales de 25px en el bloque de contacto (24px de margen + 1px de borde
  del mismo color en la referencia).
- Filas ícono + texto con `mj-table`: se mantienen lado a lado en mobile.
- Firma: imagen de 123px y columna de texto de 159px lado a lado. En mobile se
  apilan y se centran (media queries en `<mj-style>`).

## Pendientes

- Logo, forma decorativa e íconos usan las URLs de la referencia
  (`bcp-mid-stage13-res.adobe-campaign.com`, un ambiente **stage** de Adobe
  Campaign). Cargan hoy pero no es el CDN definitivo de BCP.
- Colores (`bg-vino` `#360827`, `txt-blanco` `#FFFFFF`) tomados de la
  referencia, **no validados contra el brandbook**.
- Logo, forma, íconos y firma usan URLs stage (ver arriba).
