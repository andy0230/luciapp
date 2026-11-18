# Auditoría inicial — Lucía · Aprende Jugando (v5)

**Archivo auditado:** `lucia(5).html`, conservado sin cambios en `legacy/lucia-v5-original.html`. Ocupa 207 KB y 2.586 líneas: un único HTML con CSS y JavaScript sin dependencias, salvo Google Fonts.
**Equipo:** agente principal (arquitectura e integración), UX/UI, pedagogía infantil, seguridad, investigación y QA.
**Capturas «antes»:** 48 capturas (16 pantallas × 3 tamaños) en `docs/capturas/antes/`.

## 1. Inventario funcional (v5)

| Área | Funcionalidad | Estado v5 |
|---|---|---|
| Perfiles | Hasta 3 perfiles con avatar emoji y progreso aislado por prefijo `lucia_pN_`. Migración desde la versión sin perfiles | ✅ Funciona. ⚠️ Se borra con una pulsación larga en la pantalla infantil y no limpia los datos de la ranura |
| Inicio | 3 mundos, «Para ti hoy» (3 sugerencias), Mi colección, cambiar de jugador, Para papás (pulsación larga) | ✅. ⚠️ Unos 13 objetivos táctiles y números visibles |
| Descubrir | 10 categorías (vocales, números 1–20, 17 colores, 11 formas, frutas, animales, cuerpo, transporte, comida, emociones), tarjetas con voz y modo bilingüe | ✅. ⚠️ Texto «Descubriste 3 de 17» para la niña |
| Jugar | Mapa de 30 niveles (hasta 9 opciones y 10 rondas), Contar, Memoria (3 a 12 parejas), Encaja la forma, Burbujas, Busca el animal, Rompecabezas, ¿Qué sigue?, Ordena la historia, ¿Dónde va?, Igual o diferente, Sigue la instrucción, ¿Cómo se siente? | ✅ Todos funcionan. ⚠️ Varios no terminan nunca, la dificultad es excesiva para 3 años y algunos textos presionan («¡Muy difícil!», «Modo Difícil») |
| Crear | Pintar libre, Colorear 20 figuras, Crea conmigo (cara en 5 pasos), Trazar A–Z y 0–9 con validación geométrica, Mi exposición | ✅. ⚠️ «Guardar» descarga un archivo en cada toque y «Limpiar» borra con un solo toque |
| Recompensas | 36 stickers y álbum | ✅. ⚠️ Premian «N niveles ganados» o «Campeona», no el esfuerzo |
| Personaje | Lucía (SVG con 4 expresiones) e ilustraciones de los mundos | ✅. ⚠️ Estático, sin animaciones propias |
| Sonido y voz | `speechSynthesis` es/en, efectos con Web Audio, botón para silenciar | ✅. ⚠️ Se silencia con un solo toque |
| Adaptación | Motor de dificultad adaptativa (3 aciertos sube, 2 errores baja) en 6 juegos | ✅ |
| Papás | Límite de sesión, estadísticas por categoría, sesiones recientes y reinicio | ✅. ⚠️ Se abre con pulsación larga y el límite se salta |
| Persistencia | `localStorage` con detección de almacenamiento que no persiste (iOS) | ✅ Buen diseño. ⚠️ No valida la forma de los datos (ver F-01) |
| Temporizadores | `setTimeout` ligado a la pantalla (`pantallaId`) | ✅ Buena solución. ⚠️ Los `setInterval` de Burbujas no se registraban globalmente |

## 2. Problemas identificados

| # | Problema | Severidad | Área |
|---|---|---|---|
| 1 | Si los datos guardados tienen otra forma, la app queda en blanco y la niña no puede entrar (F-01) | **Alta** | Robustez |
| 2 | Una niña de 3 años puede abrir la zona de papás con una pulsación larga (F-03) | **Alta** (producto) | Seguridad infantil |
| 3 | Borrar un perfil desde la pantalla infantil, sin confirmación, y la siguiente ranura hereda sus datos (F-04, F-05) | **Alta** | Datos |
| 4 | Dificultad no apropiada para 3 años: 7–9 opciones, hasta 10 rondas, números hasta 20, letras A–Z | **Alta** | Pedagogía |
| 5 | Números y porcentajes visibles para la niña («0 de 30 niveles · 4 stickers», «Descubriste 3 de 17») | Media | UX |
| 6 | Saturación: unos 13 objetivos en Inicio, 13 juegos en Jugar, 30 casillas en el mapa (61 emoji), 22 controles en Pintar | Media | UX |
| 7 | Texto como pista principal: la elección de dificultad en Memoria, 20 tarjetas «Hay más por descubrir» y pestañas con palabras | Media | UX |
| 8 | Acciones destructivas al alcance de un solo toque (Limpiar, Silenciar) | Media | UX |
| 9 | Juegos sin final (Busca el animal, ¿Qué sigue?, Igual o diferente, Contar…), que van en contra de las sesiones cortas | Media | Pedagogía |
| 10 | Dependencia de Google Fonts: sin internet la fuente cae a una genérica, y se filtra la IP (F-11) | Media | Offline y privacidad |
| 11 | Galería en `localStorage` que pierde dibujos sin avisar (F-06) | Media | Datos |
| 12 | Límite de tiempo que se salta (F-14) | Baja | Bienestar |
| 13 | `innerHTML` con datos guardados (F-08 a F-10) y sin CSP (F-12) | Baja | Seguridad |
| 14 | Objetivos táctiles por debajo de 64 px (stickers de la barra 46 px, colores 48 px) | Baja | Accesibilidad |
| 15 | La barra inferior tapa la última fila de tarjetas y la barra superior no tiene fondo | Baja | Visual |
| 16 | Un archivo de 2.586 líneas difícil de mantener | Baja | Arquitectura |
| 17 | No existe un módulo de inglés: solo un modo bilingüe en Descubrir | — | Alcance |

## 3. Evaluación desde la perspectiva de una niña de 3 años

| Pregunta | v5 | Acción en v2 |
|---|---|---|
| ¿Entiende qué hacer? | Parcial: las pantallas de menú no dicen nada hasta que toca | Cada pantalla habla al entrar y repite la instrucción tras 9 s sin interacción |
| ¿Sabe dónde tocar? | Sí en los juegos; difícil en los menús saturados | Menos opciones, iconos grandes y un personaje que señala |
| ¿Botones grandes? | No siempre (46–48 px) | ≥ 64 px los controles, ≥ 120 px las opciones principales |
| ¿Instrucciones cortas y habladas? | Sí en los juegos | Siempre habladas, con frases de 2 a 5 palabras |
| ¿Sin leer? | No en Memoria, la colección y las pestañas | Iconos y voz; el texto es secundario |
| ¿Respuesta inmediata? | Sí | Además, el personaje reacciona |
| ¿Error sin frustración? | Bastante bien («Casi») | Nombra lo que tocó («Ese es el gato»); la pista aparece tras 2 errores, sin castigo |
| ¿Regresar fácil? | Sí (botón atrás) | Botón de 64 px que siempre está en el mismo lugar |
| ¿Demasiados elementos? | Sí | Máximo unas 6 opciones por pantalla en dificultad normal |
| ¿Apropiado a la edad? | Mitad sí, mitad para 5+ | Tres dificultades (Fácil, Normal y Reto) que elige el adulto; Normal es la recomendada |

## 4. Plan de intervención (ejecutado)

1. **Arquitectura:** modularizar en `src/` y construir un único `index.html` sin dependencias. Detalle en el README y en el apartado 5.
2. **Robustez y seguridad:** lecturas validadas, escape de HTML, CSP, PIN, sin fuentes remotas y borrado completo de los datos de un perfil.
3. **Pedagogía:** dificultades por perfil; 3–4 opciones y 5 rondas en Normal; juegos que terminan con celebración; elogios al esfuerzo; stickers no competitivos.
4. **Rediseño visual:** tokens, un color por mundo, 3 personajes animados y barras de progreso sin números.
5. **English World:** módulo nuevo con 75 palabras, 4 cuentos, 3 rimas y repetición espaciada.
6. **Panel de papás:** sobrio, con PIN, 6 secciones, exportar e importar.
7. **PWA:** manifest, service worker e íconos para instalar desde GitHub Pages y usar sin conexión.
8. **Pruebas:** suite Playwright E2E y responsive, con capturas «después».

## 5. Decisión de arquitectura

- **Problema:** un archivo de 2.586 líneas dificulta el mantenimiento. A la vez, Lucía usa la app **como archivo en el iPad** y se quiere publicar en GitHub o como app.
- **Opciones evaluadas:**
  - **React o Next.js:** descartado. Exige una compilación compleja, pesa más y no aporta nada a una app de este tamaño; además, no funciona abriendo un archivo suelto.
  - **Módulos ES nativos (`type="module"`):** descartado. Fallan con `file://` en Safari y Chrome.
  - **Elegida — fuentes modulares en `src/` concatenadas en un único `index.html`:** el script `tools/build.mjs` usa solo Node, sin dependencias. Funciona con `file://`, por AirDrop, en GitHub Pages (como PWA) y puede envolverse más adelante con Capacitor para la App Store.
- **Compatibilidad de datos:** se conservan **todas** las claves `lucia_*`. Las nuevas (`niveles`, `config`, `ingles`, `descanso` y `lucia_ajustes`) se crean sin tocar las anteriores. `completados` se sigue escribiendo y los índices de `NIVELES` no cambian, así que el progreso de la v5 se reconoce tal cual.
- **Migración entre orígenes:** el `localStorage` está ligado al origen (archivo o URL). Para pasar del archivo en el iPad a GitHub Pages está **Exportar e Importar progreso** en el panel. Los pasos están en el README.
