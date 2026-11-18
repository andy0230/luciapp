# Lucía · Aprende Jugando

Un pequeño mundo para aprender jugando, pensado para una niña de **3 años**. Tiene cuatro mundos:

- **Descubrir:** 10 temas para tocar y escuchar.
- **Jugar:** un camino de retos y 13 juegos.
- **Crear:** pintar, colorear, trazar y una exposición de dibujos.
- **English World:** primeras palabras en inglés con Ollie el búho.

Funciona **sin conexión** y sin cuentas, publicidad ni rastreadores. Todo se guarda en el dispositivo.

- Diseño: [`DESIGN.md`](DESIGN.md)
- Diagnóstico: [`AUDITORIA_INICIAL.md`](AUDITORIA_INICIAL.md)
- Seguridad: [`SECURITY_AUDIT.md`](SECURITY_AUDIT.md)
- Pruebas: [`TEST_REPORT.md`](TEST_REPORT.md)
- Futuro: [`ROADMAP.md`](ROADMAP.md)
- Cambios: [`CAMBIOS.md`](CAMBIOS.md)

## Cómo usarla

### Opción A — Como app en el iPad (recomendada, vía GitHub Pages)

1. En GitHub, en el repositorio, ve a **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
2. Abre en Safari del iPad `https://<usuario>.github.io/luciapp/`.
3. Toca **Compartir → Agregar a pantalla de inicio**. Queda con su ícono, a pantalla completa y funciona sin internet después de la primera visita.

### Opción B — Como archivo

Copia `index.html` al iPad (Archivos o AirDrop) y ábrelo en Safari. Es un único archivo autocontenido.

> El modo sin conexión con *service worker* y el ícono instalable solo funcionan en la opción A. Como archivo, la app funciona igual pero no se «instala».

### Pasar el progreso de Lucía a la nueva versión

El progreso queda guardado en el navegador, ligado al **lugar** desde donde se abre la app (cada archivo o URL tiene el suyo). La v2 usa las **mismas claves** de datos que la v5, así que:

- **Mismo lugar** (reemplazar el archivo viejo por el nuevo, con el mismo nombre y en la misma carpeta): el progreso aparece solo.
- **Lugar distinto** (por ejemplo, del archivo en el iPad a GitHub Pages):
  1. Abre la **v2 como archivo, en el mismo lugar donde estaba la anterior**, para que lea los datos viejos.
  2. Entra a **Para papás → crea tu PIN → Datos → Exportar progreso**. Se descarga `lucia-respaldo-AAAA-MM-DD.json`.
  3. Abre la versión publicada (GitHub Pages) y ve a **Para papás → Datos → Importar un respaldo**, y elige ese archivo.

## Para papás

- El botón **🔒 Para papás** (al pie del inicio) pide un **PIN de 4 dígitos**, que se crea la primera vez.
- Si lo olvidas, elige «¿Olvidaste el PIN?» y escribe `BORRAR PIN`. Se quita el PIN pero los datos no se borran.
- **Resumen:** tiempo de uso (hoy y 7 días), favoritas, sugerencias para practicar sin pantalla, sesiones.
- **Progreso:** temas explorados, cómo va en cada juego («Ya lo reconoce», «Conviene practicarlo más»), retos y stickers.
- **Inglés:** palabras descubiertas, las que ya reconoce y las que hay que reforzar.
- **Ajustes:**
  - Sonido, efectos y velocidad de la voz.
  - Inglés visible en Descubrir.
  - **Dificultad** por perfil (Fácil, Normal o Reto).
  - **Límite de tiempo** con descanso de 45 min.
  - Micrófono opcional (apagado por defecto).
  - Cambiar el PIN.
- **Perfiles:** agregar, editar o borrar (hasta 3). Borrar elimina todos los datos de ese perfil.
- **Datos:** exportar, importar, reiniciar el progreso de un perfil y borrar todo.

**Voces:** son las del propio dispositivo. En el iPad se pueden instalar voces de mejor calidad en *Ajustes → Accesibilidad → Contenido leído → Voces* (Español e Inglés).

**Botones de arriba:**
- **Sonido:** hay que **mantenerlo presionado 1 segundo** para silenciar, así la niña no lo apaga sin querer.
- **ES / ES·EN:** muestra también el inglés en Descubrir.

## Para desarrolladores

No necesita dependencias para usarse; para desarrollar basta **Node ≥ 18**.

```bash
npm run build
```

Genera `index.html` a partir de `src/`.

```bash
npm run dev
```

Reconstruye al guardar.

```bash
npm run serve
```

Sirve en http://localhost:8080 (para probar el service worker).

```bash
npm test
```

Construye y ejecuta las pruebas E2E con Playwright (`tests/e2e.mjs`).

```bash
node tools/iconos.mjs
```

Regenera los PNG de los íconos desde `icons/icono.svg`.

### Estructura

```
index.html              ← GENERADO (no editar a mano). Archivo único que se publica.
manifest.webmanifest    ← PWA (instalable)
sw.js                   ← service worker (sin conexión). Sube VERSION al publicar cambios.
icons/                  ← íconos
src/
  index.html            ← plantilla (CSP, metadatos, barra superior)
  css/10-base.css       ← tokens y estilos base
  css/30-rediseno.css   ← componentes v2, personajes, inglés, panel de papás, responsive
  js/00-nucleo.js       ← temporizadores por pantalla, almacenamiento validado, esc(), el(), voz, sonidos, micrófono
  js/10-datos.js        ← contenido (vocales, números, colores…), stickers, niveles y dificultad
  js/15-ingles-datos.js ← currículo de English World (palabras, cuentos, rimas)
  js/20-personajes.js   ← Lucía, Ollie, Cami (SVG + poses) e ilustraciones de mundos
  js/30-ui.js           ← navegación (pantallaBase), componentes, barra inferior, celebraciones
  js/40-perfiles.js     ← perfiles y migración
  js/45-inicio.js       ← inicio, catálogo de juegos, mundos Jugar y Crear
  js/50-progreso.js     ← estadísticas, adaptativo, sesiones, límite de tiempo, galería
  js/55-…descubrir.js   ← Mi colección y mundo Descubrir
  js/61-niveles.js … 63-juegos.js ← camino de retos y juegos
  js/70-figuras.js, 71-crear.js   ← colorear, pintar, trazar, exposición
  js/80-ingles.js       ← English World
  js/85-musica.js       ← Música
  js/90-padres.js       ← PIN y panel de papás
  js/99-arranque.js     ← botones fijos, service worker, primera pantalla
legacy/                 ← versiones anteriores sin modificar (referencia)
tests/                  ← pruebas Playwright
docs/capturas/          ← evidencias visuales «antes» y «después»
```

Todos los `.js` se concatenan en orden alfabético dentro de **una sola función** (`"use strict"`), así que comparten ámbito. No hay módulos ES porque deben funcionar con `file://`.

### Agregar contenido

- **Palabras en inglés:** agrega objetos a `ENGLISH.categorias[i].palabras` en `15-ingles-datos.js`, con `id` único, `e`, `es`, `en`, `ej`, `ejEs` y `nivel`. El progreso, la colección y los juegos las incluyen solos.
- **Un juego:** crea `src/js/6x-mijuego.js` con `function miJuego(){ pantallaBase(mundoJugar,{mundo:'jugar'}); … }` y añádelo a `JUEGOS` en `45-inicio.js`. Usa `nivel:'normal'` o `'reto'` y `stat:'mijuego'`, y pon su etiqueta en `CATLABEL`.
- **Un mundo:**
  1. Añade una entrada en `MUNDOS` (`45-inicio.js`), su ilustración en `ILU` y su color en `30-rediseno.css` (`body[data-mundo="x"]`).
  2. Escribe la función del mundo.
  3. Añade el cálculo de avance en `fraccionMundo()`.
- **Un sticker:** añádelo a `STICKERS` (`10-datos.js`) y llama a `desbloquear('id')`.

### Reglas que conviene respetar

- Todo texto que venga de datos guardados va con `textContent` o `esc()`, nunca en `innerHTML` directo.
- Lee el almacenamiento con `leerJSON(clave, defecto, validador)` y escribe con `escribir()`.
- Usa `setTimeout` (ligado a la pantalla) o `intervaloPantalla()`, que se cancelan al cambiar de pantalla.
- Pantallas infantiles: instrucciones habladas, sin números visibles, ≤ 4 opciones en Normal y objetivos de ≥ 64 px.

## Licencia y créditos

Uso familiar privado. Las ilustraciones son SVG hechos a mano en el código y los emoji son los del sistema. No se copió código ni recursos de terceros. Los repositorios revisados se usaron solo como inspiración (ver `DESIGN.md`, apartado 9).
