# DESIGN.md — Sistema visual de Lucía · Aprende Jugando (v2)

**Identidad:** un «libro de papel» ilustrado y cálido, con papel crema, tinta oscura y colores planos. Respecto a la v5 es más calmado y refinado: menos saturación, sombras más suaves y una acción clara por pantalla.

**Fuentes de reglas adoptadas** (ver la investigación en el apartado 9):
- Vercel *Web Interface Guidelines*: foco, objetivos táctiles, `aria`, movimiento reducido.
- Reglas de animación de Emil Kowalski: duraciones, curvas, animar solo `transform` y `opacity`, interrumpible.
- Un subconjunto de *Impeccable*: bandas de duración y «deleite» reservado a momentos clave.
- *Taste Skill* y *Awesome DESIGN.md* se **descartaron**: están pensados para sitios de marketing o copian marcas reales.

## 1. Principios

1. **Una acción clara por pantalla.** La niña sabe dónde tocar sin leer.
2. **Imagen y voz antes que texto.** Toda instrucción se dice en voz alta; el texto es para el adulto.
3. **Un color de mundo por pantalla.** Se usa como tinte (`-c`); los colores saturados quedan para ilustraciones y un botón principal.
4. **La sombra de tinta significa «se puede tocar».** Lo que no se toca usa `--sombra-papel`, sin borde.
5. **Sin números para la niña.** Estrellas, barras y sellos; las cifras viven en el panel de papás.
6. **Movimiento corto y con propósito.** Nada se anima sin parar, salvo el parpadeo sutil y el nivel actual que late.

## 2. Color (tokens en `src/css/10-base.css`)

| Token | Valor | Uso |
|---|---|---|
| `--papel` / `--papel2` / `--crema` / `--blanco` | #FAF5EC / #F3EBDD / #FFFBF4 / #FFFDF9 | Fondo, superficies, tarjetas (blanco cálido) |
| `--tinta` / `--tinta2` / `--tinta3` | #2D2638 / #5E5670 / #9A92A8 | Texto y contornos (`tinta3` solo decorativa) |
| `--cielo` (+`-c`, `-o`) | #5B93CB | **Descubrir** |
| `--sol` | #EDB547 | **Jugar** |
| `--coral` | #E37A64 | **Crear** |
| `--mar` | #3FA39B | **English World** (nuevo: turquesa entre verde y azul, no es color de bandera) |
| `--uva` | #8A70B8 | **Mi colección** |
| `--pasto` | #59A574 | Éxito y progreso |
| `--chicle` | #E08AAE | Acentos (mejillas) |

- `body[data-mundo=…]` define `--mundo`, `--mundo-c` y `--mundo-o`. Los componentes (`.act-ico`, `.prompt .sp`, `.tab.sel`) heredan el color del mundo.
- Contraste: la tinta sobre cualquier tinte `-c` supera 11:1. No se pone texto blanco sobre `--sol` ni `--mar`.
- «Intentar otra vez» usa amarillo cálido (`--sol`), **nunca rojo**.

## 3. Tipografía (sin fuentes descargadas)

```css
--fuente-t: ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Nunito", "Varela Round", system-ui, …;
--fuente:   ui-rounded, "SF Pro Rounded", system-ui, -apple-system, "Segoe UI", Roboto, …;
--fuente-adulto: system-ui, -apple-system, "Segoe UI", Roboto, …;   /* panel de papás */
```

En iPad, `ui-rounded` es **SF Pro Rounded**: amable, legible y sin descarga.

| Uso | Tamaño |
|---|---|
| Saludo | clamp(36px, 5.4vw, 62px), peso 800 |
| Título de mundo | clamp(32px, 4.4vw, 50px) |
| Etiqueta de tarjeta | clamp(21px, 2.1vw, 26px) |
| Mínimo para la niña | 18–20 px |
| Panel de papás | 14–16 px, peso 500/600 |

## 4. Espaciado, radios y sombras

- Espacios de 8, 12, 16, 24, 32 y 48 px. Al menos 16 px entre objetivos táctiles y 20–24 px entre tarjetas principales.
- Radios: `--r-s` 12, `--r-m` 20, `--r-l` 28, `--r-xl` 36, píldora 999.
- Sombras:
  - `--sombra: 0 4px 0` de tinta (se puede tocar).
  - `--sombra-papel`, difusa (paneles estáticos).
  - Al pulsar, `translateY(3px)` y la sombra se reduce a 1 px.

## 5. Objetivos táctiles

| Elemento | Mínimo |
|---|---|
| Opciones de juego y mundos | ≥ 150 px (tarjetas de 150–260 px) |
| Controles infantiles (colores, herramientas, flechas, teclas) | ≥ 60–64 px |
| Navegación (Volver, Sonido, Idioma) | 64 px, con zona de toque ampliada de 76 px |
| Panel de papás | ≥ 44–48 px |

Dificultad Normal: **3–4 opciones** por ronda. Pantallas infantiles con unos 6 objetivos principales.

## 6. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--dur-tap` | 120 ms | Pulsar |
| `--dur-ui` | 220 ms | Estados |
| `--dur-entrada` | 380 ms | Entrada de pantalla (escalonada ≤ 40 ms por ítem) |
| `--ease-suave` | cubic-bezier(.22,.8,.3,1) | Entradas y transiciones |
| `--ease-salto` | cubic-bezier(.34,1.56,.64,1) | «Pop», celebraciones |

- **Acierto:** el «pop», un anillo verde, chispas y el personaje que celebra.
- **Intento:** un temblor suave; la tarjeta se atenúa al 55 % y el personaje «piensa». Tras 2 intentos se ilumina la correcta.
- **Celebración grande:** solo al terminar una ronda o actividad.
- `prefers-reduced-motion: reduce` desactiva rebotes, partículas, poses y parpadeo; quedan los cambios de color.

## 7. Personajes

Los tres comparten construcción: SVG `viewBox 0 0 120 140`, contorno de tinta, colores planos y partes animables por clase.

| | **Lucía** (guía) | **Ollie** el búho (English World) | **Cami** el camaleón (Crear) |
|---|---|---|---|
| Personalidad | Curiosa, cariñosa | Sabio y juguetón, habla inglés | Creativa, cambia de color |
| Colores | Pelo #5A3A28, vestido `--coral` | Cuerpo `--mar`, pico `--sol`, bufanda `--coral` | `var(--cami)` (verde por defecto), boina `--coral` |
| Dónde | Perfiles, inicio, Descubrir, Jugar, colección, descanso, celebraciones | Menú y actividades de inglés | Menú Crear |

**Poses** (`animarPersonaje(svg, pose)`): `saluda` (brazo o ala), `rebota`, `celebra` (salto con brazos), `senala`, `gira` (giro suave al entrar), `piensa` (inclina la cabeza tras un intento).

**Ánimos** (`animoPersonaje(svg, mood)`): `feliz`, `contenta` (boca abierta), `animando` (brazos arriba), `piensa`, `sorpresa`.

Además: **parpadeo** sutil cada 4–6 s y **boca que se mueve** mientras habla la voz (`alHablar`). Tocar al personaje lo hace rebotar.

## 8. Componentes principales

| Componente | Clase |
|---|---|
| Tarjeta de mundo | `.mundo` |
| Tarjeta de actividad | `.act` y `.act.destacada` |
| Botón de escuchar | `.prompt` (altavoz de 60 px y 2–5 palabras) |
| Opción de juego | `.card` (`.bien`, `.apagada`, `.pista`) |
| Estrellas | `.estrellas` |
| Barra visual | `.progreso-barra` (sin cifras; `role=progressbar`) |
| Camino de retos | `.camino` |
| Inglés | `.en-tarjeta` y `.en-cuento` |
| Celebración | `pantallaFiesta()` |
| Panel de adultos | `.padres`, `.repfila`, `.tabs-adulto`, `.ajuste`, `.btn-adulto` |
| Diálogos | `.overlay-card.adulto` (puerta con PIN y confirmaciones) |

## 9. Herramientas de diseño evaluadas

| Repositorio | Licencia | Veredicto |
|---|---|---|
| vercel-labs/agent-skills (web-design-guidelines) | MIT | **Adoptado** como lista de verificación |
| emilkowalski/skills | MIT | **Adoptado** (movimiento) |
| pbakaus/impeccable | Apache-2.0 | Subconjunto de reglas adoptado; sin sus herramientas |
| JaimeJunr/claude-code-frontend-skills | MIT | Solo referencia (su archivo de conflictos da prioridad a las reglas de Emil) |
| Leonxlnx/taste-skill | MIT | Descartado: pensado para sitios de marketing |
| VoltAgent/awesome-design-md | MIT | Descartado: copia sistemas de marcas reales |
| vgwb/Antura · xiaochong/hi-kid · onatm/phonicorn | BSD-2 + CC-BY / MIT / MIT | Solo ideas (no se copió código ni recursos): repetición espaciada, «escucha y encuentra», cuentos cortos, reforzar sin castigo |

No se instaló ninguna de estas *skills* en el repositorio. Sus reglas, sin duplicados ni contradicciones, están resumidas en este documento.
