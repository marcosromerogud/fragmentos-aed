/**
 * Configuración base de MJML para este repositorio.
 *
 * La consume `scripts/build.js`. No es el `.mjmlconfig` del CLI de MJML
 * (ese archivo solo sirve para registrar componentes de terceros).
 *
 * Punto clave: `PARTIALS_DIR` + el preprocesador `resolvePartials` permiten
 * escribir includes con el alias `@partials/` desde CUALQUIER fragmento,
 * sin importar a qué profundidad esté dentro de src/fragments/:
 *
 *   <mj-include path="@partials/colors.mjml" />
 *
 * en vez de rutas relativas frágiles como "../../../partials/colors.mjml".
 */

const path = require('node:path');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const FRAGMENTS_DIR = path.join(SRC_DIR, 'fragments');
const PARTIALS_DIR = path.join(SRC_DIR, 'partials');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

/** Alias que se escribe dentro de los `mj-include`. */
const PARTIALS_ALIAS = '@partials/';

/**
 * Reescribe `@partials/x.mjml` a la ruta absoluta de src/partials/x.mjml
 * antes de que MJML parsee el documento.
 *
 * @param {string} xml Contenido crudo del .mjml
 * @returns {string}
 */
function resolvePartials(xml) {
  // Se normaliza a "/" porque MJML resuelve los include con rutas POSIX.
  const base = PARTIALS_DIR.split(path.sep).join('/');
  return xml.split(PARTIALS_ALIAS).join(`${base}/`);
}

/**
 * Opciones que se pasan a `mjml2html`.
 * `filePath` se agrega por archivo en el build (lo necesita mj-include
 * para resolver también las rutas relativas comunes).
 */
const mjmlOptions = {
  // Sin minificar: el HTML se lee y se copia a mano hacia AED.
  minify: false,
  // Los comentarios se eliminan para no ensuciar el HTML que se pega en AED.
  keepComments: false,
  // 'strict' hace fallar el build ante atributos/etiquetas inválidas.
  // Bajar a 'soft' solo si algún fragmento legado lo necesita.
  validationLevel: 'strict',
  preprocessors: [resolvePartials],
};

module.exports = {
  ROOT_DIR,
  SRC_DIR,
  FRAGMENTS_DIR,
  PARTIALS_DIR,
  DIST_DIR,
  PARTIALS_ALIAS,
  resolvePartials,
  mjmlOptions,
};
