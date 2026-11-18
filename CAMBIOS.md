# Cambios v5 → v2.0

## Nuevo

- **🦉 English World — Mi mundo en inglés:** un cuarto mundo guiado por Ollie el búho. Tiene ocho secciones:
  - My First Words: 10 temas y 75 palabras en tarjetas grandes con voz, ejemplo, deslizar y «Again».
  - Listen and Find: 2 opciones al inicio y 3 después.
  - Repeat with Me: escuchar, «Your turn!» y celebrar el intento; micrófono opcional.
  - Colors y Numbers: colores y cantidades.
  - Animal Sounds.
  - Little Stories: 4 cuentos y 3 rimas.
  - My Collection.

  Además: repetición espaciada, máximo 3 palabras nuevas por día en los juegos y apoyo en español que se puede quitar («ES + EN» o «EN»).
- **Personajes animados:** Lucía, Ollie y Cami. Parpadean, saludan, giran al entrar, rebotan, celebran, señalan, «piensan» tras un intento y mueven la boca mientras habla la voz.
- **Música:** xilófono de colores y juego «Eco».
- **Camino de retos:** un camino visual en lugar de una cuadrícula de 30 casillas. Los niveles ganados se pueden repetir.
- **Dificultad por perfil** (Fácil, Normal o Reto), basada en la evaluación pedagógica. Ningún juego se eliminó: los más avanzados aparecen en Reto.
- **Panel de papás nuevo**, protegido con **PIN**:
  - Resumen con gráfico de 7 días, favoritas y sugerencias sin pantalla.
  - Progreso con estados en palabras.
  - Inglés: descubiertas, reconocidas y por reforzar.
  - Ajustes de voz, efectos, dificultad, límite, micrófono y PIN.
  - Gestión de perfiles.
  - Exportar, importar, reiniciar y borrar todo.
- **Barras de progreso visuales** en mundos, temas, camino, colección e inglés. La niña no ve números.
- **PWA:** se instala en el iPad desde GitHub Pages y funciona sin conexión.
- **Respaldo:** exportar e importar el progreso en JSON validado.
- **Stickers nuevos** que premian el esfuerzo: «¡No te rendiste!», «Hiciste música», 6 de inglés…
- **Instrucción repetida:** si no hay interacción en 9 s, se repite la instrucción.

## Corregido / mejorado

- La app ya no queda en blanco si los datos guardados están dañados (validación de todas las lecturas).
- La puerta de papás pasa de pulsación larga a **PIN**; crear y borrar perfiles salió de la pantalla infantil.
- Borrar un perfil elimina **todos** sus datos; el perfil nuevo no hereda progreso ajeno.
- El límite de tiempo ya no se salta: hay descanso de 45 min y aviso 2 min antes.
- La galería ya no borra dibujos sin avisar. Las miniaturas pasan a JPEG, 30 como máximo.
- «Guardar» ya no descarga archivos, solo cuelga el dibujo en la exposición. «Limpiar» pide un segundo toque.
- Silenciar requiere mantener presionado 1 s.
- Juegos sin final: ahora terminan cada 5 aciertos con una celebración y «Otra vez».
- Menos opciones por ronda (3–4), números 1–5 y 8 colores básicos en Normal; elogios que celebran el esfuerzo («¡Lo encontraste!») y nombran el error con cariño («Ese es el gato»).
- Memoria se elige por dibujo (mini cartas), no leyendo «Difícil». Hay 2 parejas como mínimo.
- Rompecabezas: nuevo nivel de 2 piezas.
- Trazar en Normal: vocales y 1–3, con tolerancia más amplia y sin «mal».
- Seguridad: escape de HTML, CSP, sin Google Fonts (privacidad y sin conexión), voces locales preferidas.
- Accesibilidad:
  - Botones de 64 px o más con nombre accesible.
  - Foco visible y enlace «Ir al contenido».
  - `aria-live`, `role=progressbar` y `lang="en"` en los textos en inglés.
  - Se respeta `prefers-reduced-motion`.
- Arquitectura: código modular en `src/` y build a un único archivo. Los intervalos se cancelan al cambiar de pantalla.

## Conservado

Perfiles y su progreso: se usan las mismas claves `lucia_*` y los índices de niveles no cambian.

Además, todo el contenido y los juegos de la v5:
- Descubrir (10 temas).
- Contar, Memoria, Encaja, Burbujas, Busca el animal, Rompecabezas, ¿Qué sigue?, Ordena la historia, ¿Dónde va?, Igual o diferente, Sigue la instrucción y ¿Cómo se siente?
- Pintar, Colorear (20 figuras), Dibuja conmigo, Trazar y Mi exposición.
- Stickers, adaptación de dificultad, límite de sesión y modo bilingüe.
