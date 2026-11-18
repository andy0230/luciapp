# ROADMAP — Lucía · Aprende Jugando

Criterio: incorporar solo lo que aporte valor educativo o mejore la experiencia de una niña de 3 años. Prioriza la calidad sobre la cantidad.

## Evaluación de funcionalidades propuestas

| # | Funcionalidad | Prioridad | Estado en v2 | Notas |
|---|---|---|---|---|
| 1 | Rutinas de aprendizaje personalizadas | Media | — | Ej. «mañana: 1 juego + 1 palabra en inglés + 1 dibujo», configurable en el panel |
| 2 | Recomendaciones según el progreso | **Alta** | ✅ Hecho | «Para ti hoy»: 1 sugerencia que rota (reto actual, tema menos explorado, inglés por reforzar, juego menos usado) |
| 3 | Repetición inteligente de conceptos | **Alta** (inglés) / Media (resto) | ✅ En inglés | Cajas 0–4 → 0, 1, 3, 7 y 14 días. Pendiente: aplicarla a Descubrir |
| 4 | Detección de categorías que necesitan refuerzo | Media | ✅ Hecho | El panel marca «Conviene practicarlo más» y sugiere actividades sin pantalla |
| 5 | Historias interactivas | Media | ✅ Parcial | 4 *Little Stories* en inglés. Futuro: cuentos en español en los que se elige qué pasa |
| 6 | Juegos de asociación | Media | ✅ | Listen and Find, ¿Dónde va?, Memoria |
| 7 | Música y ritmo | Media | ✅ Hecho | Nuevo: xilófono de colores y «Eco» (repetir 2–3 notas) |
| 8 | Reconocimiento de emociones | **Alta** | ✅ | Emociones y «¿Cómo se siente?» en dificultad normal |
| 9 | Motricidad fina | Media | ✅ Parcial | Pintar, colorear, trazar y encajar. Futuro: trazos de preescritura (líneas, círculo, zigzag) |
| 10 | Exploración de naturaleza y entorno | Futuras versiones | — | Nuevo mundo «Afuera» (estaciones, clima, plantas) |
| 11 | Seguimiento del tiempo de pantalla | **Alta** | ✅ Hecho | Minutos por día (7 días), límite configurable, aviso previo y descanso que no se salta |
| 12 | Logros sin presión competitiva | **Alta** | ✅ Hecho | Stickers por explorar, persistir, crear y volver; nada de «campeona» |
| 13 | Modo sin conexión | **Alta** | ✅ Hecho | Archivo único y service worker en GitHub Pages |
| 14 | Respaldo y recuperación | **Alta** | ✅ Hecho | Exportar e importar JSON validado |
| 15 | Personalización de personajes | Futuras versiones | — | Elegir color de ropa o accesorio de Lucía (sin compras) |
| 16 | Nuevos mundos de aprendizaje | Futuras versiones | — | La estructura lo permite (ver README, «Agregar un mundo») |
| 17 | Actividades compartidas entre padres e hijos | **Alta** | ✅ Parcial | «Para practicar juntos (sin pantalla)» en el panel. Futuro: «modo juntos» con instrucciones para el adulto |

## Siguientes pasos sugeridos

### v2.1 (corto plazo)

- Probar en iPad real (Safari y modo «pantalla de inicio»): voces, persistencia, sin conexión, tamaños.
- Agregar trazos de preescritura antes de las vocales en «Trazar».
- Aplicar la repetición espaciada a Descubrir (temas vistos hace tiempo).
- Calcular el hash CSP del script en el build para quitar `'unsafe-inline'`.
- Permitir audios grabados por la familia (opcional) para las palabras en inglés: estructura `audio:` por palabra.

### v2.2

- Cuentos interactivos en español.
- Más categorías de inglés (ropa, casa, clima) y más cuentos.
- «Modo juntos»: el adulto lee una consigna y la niña juega.

### Publicación como app (App Store / Google Play)

1. Empaquetar con **Capacitor**: `npm i @capacitor/core @capacitor/cli @capacitor/ios`, `webDir: "."` o una carpeta `dist/` con `index.html`, `icons` y `manifest`. La app no necesita cambios de código.
2. Categoría *Kids*:
   - Sin analítica ni publicidad de terceros (ya se cumple).
   - Puerta parental antes de cualquier enlace o permiso (PIN, ya se cumple).
   - Política de privacidad publicada.
3. Permisos de iOS (`Info.plist`) solo si se mantiene el micrófono opcional: `NSMicrophoneUsageDescription` y `NSSpeechRecognitionUsageDescription`.
4. Voces: en una app nativa conviene usar el TTS nativo mediante un plugin, por calidad y para no depender del navegador.
5. Revisión legal (ver `SECURITY_AUDIT.md`, apartado 2).
