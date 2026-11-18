// Genera los PNG de los íconos a partir de icons/icono.svg (requiere Playwright).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFileSync } from 'node:fs';
const svg = readFileSync(new URL('../icons/icono.svg', import.meta.url), 'utf8');
const b = await chromium.launch(); const p = await b.newPage();
for (const [nombre, tam, margen] of [['icono-192.png',192,0],['icono-512.png',512,0],['icono-maskable-512.png',512,0.12],['apple-touch-icon.png',180,0]]) {
  await p.setViewportSize({ width: tam, height: tam });
  const pad = Math.round(tam * margen);
  await p.setContent(`<body style="margin:0;background:#FAF5EC"><div style="padding:${pad}px">${svg.replace('<svg ', `<svg width="${tam-2*pad}" height="${tam-2*pad}" `)}</div></body>`);
  await p.screenshot({ path: new URL('../icons/' + nombre, import.meta.url).pathname, omitBackground: false });
}
await b.close(); console.log('✓ íconos generados');
