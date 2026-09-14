#!/usr/bin/env node
/**
 * Compara el peso de cada referencia (references/) contra el HTML que genera
 * MJML (dist/) e imprime una tabla Markdown lista para pegar en CHANGELOG.md.
 *
 * La referencia de cada fragmento se toma de su README: la primera ruta
 * `references/...html` que aparezca. Fragmentos sin referencia se omiten.
 *
 * Columnas:
 *   - Bruto:     bytes del archivo tal cual.
 *   - Compacto:  bytes con los espacios entre etiquetas colapsados. Es la
 *                comparación justa: la indentación no llega al correo.
 *   - Gzip:      bytes del compacto comprimido (lo que viaja por la red).
 *   - CSS:       bytes dentro de <style>.
 *   - Tablas:    cantidad de <table>.
 *
 * Uso:
 *   npm run pesos
 */

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const { FRAGMENTS_DIR, DIST_DIR, ROOT_DIR } = require('../mjml.config.js');

const REFERENCE_PATH = /`(references\/[^`]+\.html)`/;

/**
 * Devuelve las carpetas de fragmento (las que tienen un .mjml adentro).
 * @param {string} dir
 * @returns {string[]} rutas absolutas
 */
function findFragmentDirs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const hasMjml = entries.some((e) => e.isFile() && e.name.endsWith('.mjml'));
  const nested = entries
    .filter((e) => e.isDirectory())
    .flatMap((e) => findFragmentDirs(path.join(dir, e.name)));
  return hasMjml ? [dir, ...nested] : nested;
}

const compact = (html) => html.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
const bytes = (text) => Buffer.byteLength(text, 'utf8');

/** @param {string} file */
function measure(file) {
  const html = fs.readFileSync(file, 'utf8');
  const small = compact(html);
  return {
    bruto: bytes(html),
    compacto: bytes(small),
    gzip: zlib.gzipSync(small, { level: 9 }).length,
    css: bytes((html.match(/<style[\s\S]*?<\/style>/g) || []).join('')),
    tablas: (html.match(/<table\b/g) || []).length,
  };
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const delta = (before, after) => {
  const pct = Math.round(((after - before) / before) * 100);
  return `${pct > 0 ? '+' : ''}${pct}%`;
};

const rows = [];
const totals = { ref: { bruto: 0, compacto: 0, gzip: 0 }, mjml: { bruto: 0, compacto: 0, gzip: 0 } };

for (const dir of findFragmentDirs(FRAGMENTS_DIR).sort()) {
  const readme = path.join(dir, 'README.md');
  const match = fs.existsSync(readme) && fs.readFileSync(readme, 'utf8').match(REFERENCE_PATH);
  if (!match) continue;

  const rel = path.relative(FRAGMENTS_DIR, dir);
  const refFile = path.join(ROOT_DIR, match[1]);
  const distFile = path.join(DIST_DIR, rel, `${path.basename(dir)}.html`);
  if (!fs.existsSync(refFile) || !fs.existsSync(distFile)) {
    console.error(`omitido  ${rel}: falta ${fs.existsSync(refFile) ? distFile : refFile}`);
    continue;
  }

  const ref = measure(refFile);
  const mjml = measure(distFile);
  for (const k of ['bruto', 'compacto', 'gzip']) {
    totals.ref[k] += ref[k];
    totals.mjml[k] += mjml[k];
  }

  rows.push(
    `| \`${rel}\` | ${kb(ref.bruto)} → ${kb(mjml.bruto)} (${delta(ref.bruto, mjml.bruto)}) ` +
      `| ${kb(ref.compacto)} → ${kb(mjml.compacto)} (${delta(ref.compacto, mjml.compacto)}) ` +
      `| ${kb(ref.gzip)} → ${kb(mjml.gzip)} (${delta(ref.gzip, mjml.gzip)}) ` +
      `| ${kb(ref.css)} → ${kb(mjml.css)} | ${ref.tablas} → ${mjml.tablas} |`,
  );
}

if (!rows.length) {
  console.error('No hay fragmentos con referencia. ¿Corriste `npm run build`?');
  process.exit(1);
}

const t = totals;
console.log('| Fragmento | Bruto | Compacto | Gzip | CSS | Tablas |');
console.log('|---|---|---|---|---|---|');
console.log(rows.join('\n'));
console.log(
  `| **Total** | ${kb(t.ref.bruto)} → ${kb(t.mjml.bruto)} (${delta(t.ref.bruto, t.mjml.bruto)}) ` +
    `| ${kb(t.ref.compacto)} → ${kb(t.mjml.compacto)} (${delta(t.ref.compacto, t.mjml.compacto)}) ` +
    `| ${kb(t.ref.gzip)} → ${kb(t.mjml.gzip)} (${delta(t.ref.gzip, t.mjml.gzip)}) | | |`,
);
