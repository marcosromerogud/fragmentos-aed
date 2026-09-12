#!/usr/bin/env node
/**
 * Compila todos los fragmentos MJML de src/fragments/ a HTML en dist/,
 * preservando la misma estructura de subcarpetas.
 *
 *   src/fragments/banners/banner-monto/banner-monto.mjml
 *   -> dist/banners/banner-monto/banner-monto.html
 *
 * Uso:
 *   npm run build
 *   npm run build:watch
 */

const fs = require('node:fs');
const path = require('node:path');
const mjml2html = require('mjml');

const {
  FRAGMENTS_DIR,
  DIST_DIR,
  ROOT_DIR,
  mjmlOptions,
  resolvePartials,
} = require('../mjml.config.js');

const WATCH = process.argv.includes('--watch');

/** `<mj-class name="bg-celeste" ... />` — una definición. */
const CLASS_DEF = /<mj-class\s[^>]*name="([^"]+)"/g;
/** `mj-class="bg-celeste borde-azul-claro"` — un uso. */
const CLASS_USE = /mj-class="([^"]+)"/g;
/** `<mj-include path="@partials/colors.mjml" />` */
const INCLUDE = /<mj-include\s[^>]*path="([^"]+)"/g;

/**
 * Devuelve todos los .mjml dentro de un directorio, recursivamente.
 * @param {string} dir
 * @returns {string[]} rutas absolutas
 */
function findMjmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findMjmlFiles(full);
    return entry.isFile() && entry.name.endsWith('.mjml') ? [full] : [];
  });
}

/** Saca los comentarios XML para no leer los ejemplos que viven adentro. */
const stripComments = (xml) => xml.replace(/<!--[\s\S]*?-->/g, '');

/**
 * Junta los nombres de mj-class definidos en un archivo y en todo lo que
 * incluya, recursivamente.
 *
 * @param {string} file ruta absoluta
 * @param {Set<string>} [seen] archivos ya visitados (corta ciclos)
 * @returns {Set<string>}
 */
function collectDefinedClasses(file, seen = new Set()) {
  const defined = new Set();
  if (seen.has(file) || !fs.existsSync(file)) return defined;
  seen.add(file);

  const xml = stripComments(resolvePartials(fs.readFileSync(file, 'utf8')));

  for (const [, name] of xml.matchAll(CLASS_DEF)) defined.add(name);

  for (const [, included] of xml.matchAll(INCLUDE)) {
    const target = path.isAbsolute(included)
      ? included
      : path.resolve(path.dirname(file), included);
    for (const name of collectDefinedClasses(target, seen)) defined.add(name);
  }

  return defined;
}

/**
 * MJML no avisa cuando una mj-class no existe: compila sin errores y aplica
 * el default (texto negro, sin fondo). Esta validación cubre ese agujero.
 *
 * @param {string} srcFile ruta absoluta al .mjml
 * @returns {string[]} nombres usados que no están definidos
 */
function findUndefinedClasses(srcFile) {
  const defined = collectDefinedClasses(srcFile);
  const xml = stripComments(fs.readFileSync(srcFile, 'utf8'));

  const used = new Set();
  for (const [, attr] of xml.matchAll(CLASS_USE)) {
    for (const name of attr.trim().split(/\s+/)) if (name) used.add(name);
  }

  return [...used].filter((name) => !defined.has(name)).sort();
}

/**
 * Compila un .mjml y escribe el .html equivalente en dist/.
 * @param {string} srcFile ruta absoluta al .mjml
 * @returns {{ ok: boolean, warnings: number }}
 */
function buildFile(srcFile) {
  const relative = path.relative(FRAGMENTS_DIR, srcFile);
  const outFile = path.join(DIST_DIR, relative).replace(/\.mjml$/, '.html');
  const label = path.relative(ROOT_DIR, srcFile);

  try {
    const undefinedClasses = findUndefinedClasses(srcFile);
    if (undefinedClasses.length > 0) {
      console.error(`  ERROR  ${label}`);
      console.error(`         mj-class sin definir: ${undefinedClasses.join(', ')}`);
      console.error('         Revisá el nombre o incluí el partial que la define.');
      return { ok: false, warnings: 0 };
    }

    const source = fs.readFileSync(srcFile, 'utf8');
    // `filePath` permite que mj-include resuelva rutas relativas al fragmento.
    const { html, errors } = mjml2html(source, { ...mjmlOptions, filePath: srcFile });

    for (const error of errors) {
      console.warn(`  aviso  ${label}:${error.line} ${error.message}`);
    }

    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html, 'utf8');

    console.log(`  ok     ${label} -> ${path.relative(ROOT_DIR, outFile)}`);
    return { ok: true, warnings: errors.length };
  } catch (error) {
    console.error(`  ERROR  ${label}`);
    console.error(`         ${error.message}`);
    return { ok: false, warnings: 0 };
  }
}

/**
 * Borra de dist/ el HTML cuyo .mjml de origen ya no existe, y las carpetas que
 * queden vacías. Así renombrar o eliminar un fragmento no deja basura
 * versionada.
 *
 * Se podan solo los huérfanos en vez de vaciar dist/ antes de compilar: si el
 * build falla a mitad de camino, el HTML válido que ya estaba sigue ahí.
 *
 * @param {string} [dir] carpeta a revisar
 * @returns {string[]} líneas listas para loguear
 */
function pruneOrphans(dir = DIST_DIR) {
  if (!fs.existsSync(dir)) return [];

  const removed = [];
  const label = (p) => path.relative(ROOT_DIR, p);

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      removed.push(...pruneOrphans(full));
      if (fs.readdirSync(full).length === 0) {
        fs.rmdirSync(full);
        removed.push(`${label(full)} (carpeta vacía)`);
      }
      continue;
    }

    if (!entry.name.endsWith('.html')) continue;

    const source = path
      .join(FRAGMENTS_DIR, path.relative(DIST_DIR, full))
      .replace(/\.html$/, '.mjml');

    if (!fs.existsSync(source)) {
      fs.unlinkSync(full);
      removed.push(`${label(full)} (ya no existe su .mjml)`);
    }
  }

  return removed;
}

function buildAll() {
  const files = findMjmlFiles(FRAGMENTS_DIR);

  if (files.length === 0) {
    console.log('No se encontraron archivos .mjml en src/fragments/');
    return 0;
  }

  console.log(`Compilando ${files.length} fragmento(s)...`);
  const results = files.map(buildFile);
  const failed = results.filter((r) => !r.ok).length;
  const warnings = results.reduce((total, r) => total + r.warnings, 0);

  for (const orphan of pruneOrphans()) {
    console.log(`  borrado ${orphan}`);
  }

  console.log(
    `\n${results.length - failed}/${results.length} compilados` +
      (warnings ? ` · ${warnings} aviso(s)` : '') +
      (failed ? ` · ${failed} con error` : ''),
  );

  return failed;
}

const failed = buildAll();

if (WATCH) {
  console.log('\nObservando src/ ... (Ctrl+C para salir)');
  const debounce = new Map();

  fs.watch(path.join(ROOT_DIR, 'src'), { recursive: true }, (_event, filename) => {
    if (!filename || !filename.endsWith('.mjml')) return;
    // Los editores disparan varios eventos por guardado; se agrupan.
    clearTimeout(debounce.get(filename));
    debounce.set(
      filename,
      setTimeout(() => {
        console.log(`\nCambio detectado en ${filename}`);
        buildAll();
      }, 100),
    );
  });
} else {
  process.exit(failed > 0 ? 1 : 0);
}
