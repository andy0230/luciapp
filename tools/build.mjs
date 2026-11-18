#!/usr/bin/env node
/* Construye la app en UN SOLO ARCHIVO (index.html) a partir de src/.
 *
 *   node tools/build.mjs          → genera ./index.html
 *   node tools/build.mjs --watch  → reconstruye al guardar cambios en src/
 *
 * Por qué un solo archivo: Lucía abre la app como archivo en el iPad (Archivos/Safari),
 * sin servidor. Un único .html autocontenido funciona sin conexión, se comparte por
 * AirDrop y no depende de rutas relativas.
 *
 * Reglas:
 *  - Los .css de src/css se concatenan en orden alfabético dentro de <style>.
 *  - Los .js de src/js se concatenan en orden alfabético dentro de UNA función
 *    autoejecutable con "use strict": todos comparten el mismo ámbito (no hay
 *    módulos ES, para que funcione abriendo el archivo directamente con file://).
 *    El prefijo numérico del nombre (00-, 10-, …) define el orden de carga.
 *  - Sin dependencias: solo Node ≥ 18.
 */
import { readFileSync, writeFileSync, readdirSync, watch } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(raiz, 'src');

function leerCarpeta(sub, ext) {
  const dir = join(src, sub);
  return readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => `/* ===== ${sub}/${f} ===== */\n` + readFileSync(join(dir, f), 'utf8'))
    .join('\n');
}

function construir() {
  const plantilla = readFileSync(join(src, 'index.html'), 'utf8');
  const css = leerCarpeta('css', '.css');
  const js = leerCarpeta('js', '.js');
  if (js.includes('</script')) throw new Error('El JS no puede contener la secuencia </script');
  const version = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8')).version;
  const salida = plantilla
    .replace('/*@@CSS@@*/', () => css)
    .replace('/*@@JS@@*/', () => `(function(){\n"use strict";\nvar VERSION_APP=${JSON.stringify(version)};\n${js}\n})();`);
  writeFileSync(join(raiz, 'index.html'), salida);
  const kb = (Buffer.byteLength(salida) / 1024).toFixed(0);
  console.log(`✓ index.html generado (${kb} KB, v${version})`);
}

construir();
if (process.argv.includes('--watch')) {
  let t = null;
  watch(src, { recursive: true }, () => {
    clearTimeout(t);
    t = setTimeout(() => { try { construir(); } catch (e) { console.error('✗', e.message); } }, 120);
  });
  console.log('Observando src/ …');
}
