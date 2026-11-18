# Auditoría de seguridad y privacidad — Lucía · Aprende Jugando

**Alcance:** versión v5 original (`legacy/lucia-v5-original.html`) y versión 2.0 (`src/` → `index.html`).
**Método:** revisión manual del código completo, hecha por el agente de seguridad, más pruebas automatizadas en navegador (ver `TEST_REPORT.md`). La auditoría sobre la v5 se hizo leyendo el código; las correcciones de la v2 se verificaron con pruebas.
**Contexto:** la app es local y no tiene servidor ni cuentas. Los datos viven en el `localStorage` del navegador y la usuaria es una niña de 3 años.

> ⚠️ Este documento **no es una certificación de cumplimiento legal**. Los apartados normativos son orientativos y requieren revisión de un abogado si la app se distribuye públicamente (p. ej. en la App Store).

## 1. Hallazgos y estado

| ID | Hallazgo (v5) | Severidad | Estado en v2 | Medida aplicada |
|---|---|---|---|---|
| F-01 | Un `lucia_perfiles` con JSON válido pero de otra forma (`null`, `{}`, `[null]`) rompía el arranque y la app quedaba en blanco | **Alta** | ✅ Corregido | `leerJSON()` con validador y valor por defecto. `cargarPerfiles()` valida cada perfil (id, nombre y avatar) y descarta duplicados |
| F-02 | Las claves por perfil se leían sin validar su forma, lo que provocaba errores dentro del perfil | Media | ✅ Corregido | Validación de forma en `stats`, `explorado`, `stickers`, `adapt`, `sesiones`, `galeria`, `ingles`, `niveles` y `config` |
| F-03 | La zona de papás solo pedía mantener presionado 2,2 s, algo que una niña puede hacer | Media | ✅ Corregido | PIN de 4 dígitos con sal y hash. Tras 3 fallos hay que esperar 30 s. La recuperación exige escribir «BORRAR PIN» |
| F-04 | Se podía borrar un perfil manteniendo presionado en la pantalla infantil, sin confirmación | Media | ✅ Corregido | Crear, editar y borrar perfiles solo se hace en el panel (con PIN) y con diálogo de confirmación |
| F-05 | Al borrar un perfil quedaban sus datos y el siguiente perfil de esa ranura los heredaba | Media | ✅ Corregido | `borrarDatosPerfil()` elimina todas las claves `lucia_pN_*`; un perfil nuevo empieza con la ranura limpia |
| F-06 | Si se llenaba la cuota, la galería conservaba solo los últimos 8 dibujos sin avisar | Media | ✅ Corregido | Miniaturas JPEG de 320 px (unos 20 KB), tope de 30 dibujos y nunca se borra sin avisar: la niña oye «pídele a un adulto…» |
| F-07 | Un error de cuota pasaba toda la app a memoria a mitad de sesión | Baja | ✅ Corregido | `escribir()` distingue el error de cuota (devuelve `false`) del almacenamiento no disponible |
| F-08 | Inyección HTML/XSS por el nombre o el avatar del perfil | Baja | ✅ Corregido | `textContent` y `esc()` en todo lo que viene del almacenamiento; nombre limpiado (14 caracteres, sin `<>`) y avatar en lista blanca |
| F-09 | La URL de la galería se concatenaba en `<img src>` | Baja | ✅ Corregido | Solo se acepta `data:image/(png\|jpeg);base64,…` y se asigna con `new Image().src` |
| F-10 | Otros valores guardados se mostraban con `innerHTML` en el reporte | Baja | ✅ Corregido | El panel nuevo se construye con `el()` y `textContent` |
| F-11 | Google Fonts en cada inicio filtraba la IP y hacía depender la app de internet | Baja | ✅ Corregido | Sin fuentes remotas: se usa la fuente redondeada del sistema (SF Pro Rounded en iPad) |
| F-12 | Sin Content-Security-Policy | Baja | ✅ Corregido | CSP en `<meta>`: `default-src 'self'`, `connect-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'` |
| F-13 | Las voces en la nube podían enviar el texto hablado (incluido el nombre de la niña) fuera del dispositivo | Baja | ✅ Mitigado | Si el dispositivo tiene voces locales (`localService`), se usan solo esas |
| F-14 | El límite de tiempo se saltaba tocando «Salir» | Baja | ✅ Corregido | Al cumplirse, el perfil queda en **descanso 45 min**, aunque se recargue; solo un adulto con PIN lo levanta |
| F-15 | El origen del almacenamiento puede compartirse con otras páginas | Baja | ⚠️ Pendiente / documentado | En GitHub Pages, **todos los repos de `andy0230.github.io` comparten `localStorage`** (por ejemplo `twister-familiar`). Las claves usan el prefijo `lucia_`. Mitigación recomendada: dominio propio o subdominio dedicado |
| F-16 | La migración heredada podía sobrescribir los datos de la ranura 0 | Baja | ✅ Corregido | Solo copia si la clave destino no existe |
| F-17 | «Reiniciar todo» solo pedía mantener presionado 2 s | Baja | ✅ Corregido | PIN, confirmación explícita y reinicio limitado al perfil seleccionado |
| F-18 | «Guardar» abría una descarga en cada toque | Info | ✅ Corregido | Guardar solo cuelga el dibujo en «Mi exposición»; exportar es tarea de adultos |
| F-19 | Manipulación del progreso | Info | Aceptado | Es local y sin competencia: no hay incentivo para manipularlo, y la importación valida las claves con lista blanca |
| F-20 | Temporizadores e intervalos | Info | ✅ Mejorado | `nuevaPantalla()` cancela intervalos y la voz; `intervaloPantalla()` registra los intervalos |
| F-21 | Red, rastreadores y sensores | Info | ✅ Verificado | Sin peticiones a terceros, sin analítica, sin cookies. El micrófono es opcional y está **apagado por defecto** |
| F-22 | Volumen de los efectos | Info | ✅ | Efectos con envolvente suave y volumen ≤ 0,16, que se pueden apagar en el panel |

### Hallazgos nuevos introducidos o evaluados en la v2

| ID | Tema | Riesgo | Medida |
|---|---|---|---|
| N-01 | Importar respaldo (archivo externo) | Medio | Se exige `app:'lucia-aprende-jugando'`, el archivo pesa ≤ 15 MB y solo se aceptan claves de la lista blanca (`CLAVE_VALIDA`) con valores de texto. Se pide confirmación y, si falla por cuota, se **restaura** el estado anterior. Los ajustes y el PIN actuales no se sobrescriben |
| N-02 | Reconocimiento de voz | Medio (privacidad) | Opcional, apagado por defecto y activable solo con PIN. El panel advierte que Safari y Chrome pueden procesarlo en servidores de Apple o Google. **No se graba ni se guarda audio**; el texto reconocido se compara y se descarta. Se corta solo a los 6 s |
| N-03 | Service worker | Bajo | Solo cachea archivos del mismo origen y no intercepta peticiones a terceros. No se registra al abrir la app como archivo (`file://`) |
| N-04 | Fuerza del PIN | Bajo (aceptado) | Un PIN de 4 dígitos con hash FNV y sal **no resiste a un adulto con acceso al dispositivo**: puede borrar los datos del sitio. Su objetivo es que una niña no entre por accidente. Está documentado en el panel y en el código |
| N-05 | Enlaces externos en el entorno infantil | — | No hay ninguno. La única salida a un archivo (exportar) está detrás del PIN |

## 2. Privacidad infantil (orientativo)

**Datos que trata la app:** el nombre o apodo del niño y un avatar emoji; el progreso de juego; la duración y las actividades de cada sesión; los dibujos (imágenes) y las palabras de inglés vistas. **Todo se guarda solo en el dispositivo.** No hay cuentas, ni servidores, ni publicidad, ni rastreadores, ni chat abierto, ni IA conversacional.

**Principios aplicados:**
- **Minimización:** solo se pide un nombre, y puede ser un apodo. No se piden fecha de nacimiento, foto ni correo.
- **Procesamiento local:** las voces son las del dispositivo y se prefieren las locales. Con el micrófono apagado, ningún dato sale del dispositivo.
- **Control parental:** exportar, importar, reiniciar y borrar todo se hace desde el panel con PIN.
- **Sin patrones adictivos:** no hay rachas con castigo, ni temporizadores de presión, ni recompensas aleatorias. Hay un límite de tiempo configurable con pantalla de descanso.

**Marco de referencia (no constituye asesoría legal):**
- **Colombia:**
  - Ley 1581 de 2012, art. 7: los datos de niñas, niños y adolescentes se tratan respetando su interés superior y sus derechos fundamentales.
  - Decreto 1377 de 2013, art. 12 (incorporado al Decreto 1074 de 2015): el tratamiento requiere autorización del representante legal, y debe tenerse en cuenta la opinión del menor según su madurez.

  Como la app no recolecta datos en servidores, el «responsable» es la propia familia en su dispositivo. Si se publicara como servicio que recoge datos, haría falta una política de tratamiento y una autorización.
- **Internacional (como buenas prácticas):** COPPA (EE. UU.: consentimiento parental verificable si se recogen datos de menores de 13), RGPD art. 8 y el *Age Appropriate Design Code* del Reino Unido (configuración más privada por defecto, minimización, nada de *nudges*).
- **App Store (si se publica):** la categoría *Kids* de Apple (Guidelines 1.3 y 5.1.4) exige no tener analítica ni publicidad de terceros y poner una **puerta parental** antes de enlaces externos, compras o solicitudes de permisos. La v2 ya cumple el diseño (PIN), pero debe revisarse al empaquetar.

## 3. Pendientes y recomendaciones

1. **Origen compartido (F-15):** publicar en un dominio o subdominio propio, o aceptar el riesgo; `twister-familiar` no usa claves `lucia_`.
2. **Prueba en iPad real:** las pruebas automáticas usan Chromium. Hay que verificar en Safari/iPadOS la persistencia, las voces, el modo sin conexión y el comportamiento al «Agregar a pantalla de inicio».
3. **CSP con `'unsafe-inline'`:** la app es un único archivo con el script incrustado. Una mejora futura es calcular un hash `sha256-…` del script en `tools/build.mjs` para quitar `'unsafe-inline'` de `script-src`.
4. **Respaldo cifrado (opcional):** el JSON exportado contiene el nombre y los dibujos. Recomendar a la familia guardarlo en un lugar privado.
5. **Si se publica en la App Store:** revisión legal de la política de privacidad, la etiqueta de privacidad (*nutrition label*) y el permiso del micrófono (`NSMicrophoneUsageDescription`, `NSSpeechRecognitionUsageDescription`).
