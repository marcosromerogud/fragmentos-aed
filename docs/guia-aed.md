# Guía de Adobe Email Designer (AED)

> **Estado: esqueleto.** Este documento está por completar con el detalle real
> del flujo en AED (pantallas, nombres de menús, permisos). Las secciones de
> abajo son el índice acordado; si completas una, borra su nota de pendiente.

---

## Qué es un fragmento en AED

<!-- PENDIENTE: definición corta, diferencia entre fragmento y plantilla,
     y cuándo conviene usar cada uno. -->

## Cómo subir un fragmento a AED

<!-- PENDIENTE: paso a paso con la ruta exacta del menú.
     Esbozo:
     1. npm run build
     2. Abrir dist/<categoria>/<fragmento>/<fragmento>.html
     3. Copiar el contenido del <body> (no el documento completo)
     4. En AED: ... -->

## Qué parte del HTML copiar

<!-- PENDIENTE: confirmar si AED acepta el documento completo o solo el body,
     y qué pasa con el <head> (estilos, mj-font). -->

## Tipografía Flexo en la plantilla

<!-- PENDIENTE: esto es tarea de la PLANTILLA de AED, no del fragmento.
     Faltan dos cosas:
     1. Publicar src/assets/fonts/*.woff2 en una URL HTTPS del CDN de BCP.
     2. Declarar el @font-face de Flexo (400/600/700) en el <head> de la
        plantilla, una sola vez. El bloque listo para copiar está en
        src/partials/fonts.mjml.
     Sin esos dos pasos, todos los fragmentos caen a Arial. Y aun con ellos,
     Gmail y Outlook Windows van a seguir mostrando Arial: no cargan webfonts. -->

## Reemplazo de assets e imágenes

<!-- PENDIENTE: dónde se alojan las imágenes, CDN aprobado, tamaños máximos,
     retina/2x, naming de archivos. -->

## Links y tracking

<!-- PENDIENTE: convención de UTMs, links personalizados, qué maneja AED
     automáticamente y qué hay que escribir a mano. -->

## Limitaciones conocidas de AED

<!-- PENDIENTE: documentar aquí cada cosa que AED rompe, con el workaround.
     Hasta ahora identificado:
     - Puede eliminar/reescribir bloques <style> -> por eso todo va inline
       (ver convenciones-mjml.md, regla 3). -->

## Checklist antes de publicar

<!-- PENDIENTE: completar y validar con el equipo. Borrador: -->

- [ ] `npm run build` corre sin errores
- [ ] El `.mjml` y el `.html` de `dist/` están commiteados y sincronizados
- [ ] No quedan comentarios `PENDIENTE:` en el fragmento
- [ ] Imágenes con `src` absoluto HTTPS y `alt` descriptivo
- [ ] No hay bloques `<style>` ni clases CSS externas
- [ ] Copy revisado y aprobado por el área responsable
- [ ] Links apuntan a producción y con el tracking correcto
- [ ] Probado en Outlook, Gmail (web y app) y iOS Mail
- [ ] Se ve correctamente en mobile
- [ ] Envío de prueba revisado antes del envío real

## Pruebas y previsualización

<!-- PENDIENTE: herramienta de testing que usa el equipo (Litmus, Email on Acid,
     envíos de prueba desde Campaign), y a qué cuentas se envía. -->

## Contactos

<!-- PENDIENTE: a quién escribir por accesos a AED, por assets y por aprobación
     de contenido. -->
