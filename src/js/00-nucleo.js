  /* =====================================================================
     NÚCLEO: temporizadores por pantalla, almacenamiento seguro, escape de
     HTML, voz (español/inglés) y efectos de sonido.
     Todos los archivos de src/js comparten este ámbito (ver tools/build.mjs).
     ===================================================================== */

  /* ---------- TEMPORIZADORES LIGADOS A LA PANTALLA ----------
     Cada cambio de pantalla incrementa pantallaId; los temporizadores de la pantalla
     anterior simplemente no se ejecutan (evita que una ronda vieja se dibuje encima
     del menú). Lo que debe sobrevivir al cambio (avisos, chispas) usa _setTimeout.
     Los intervalos se registran para cancelarse al cambiar de pantalla. */
  var pantallaId=0;
  var _setTimeout=window.setTimeout.bind(window);
  var _intervalosPantalla=[];
  function setTimeout(fn,ms){ var id=pantallaId; return _setTimeout(function(){ if(id===pantallaId) fn(); }, ms); }
  function intervaloPantalla(fn,ms){ var h=window.setInterval(fn,ms); _intervalosPantalla.push(h); return h; }
  function nuevaPantalla(){
    pantallaId++;
    _intervalosPantalla.forEach(function(h){ window.clearInterval(h); }); _intervalosPantalla=[];
    if('speechSynthesis' in window){ try{ speechSynthesis.cancel(); }catch(e){} }
    detenerEscucha();
  }

  /* ---------- ESCAPE DE HTML (defensa XSS) ----------
     Cualquier texto que venga del almacenamiento o que escriba un adulto (nombres de
     perfil) se escapa antes de entrar en innerHTML o en un atributo. */
  function esc(s){ return String(s==null?'':s).replace(/[&<>"'`]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c]; }); }
  /* Constructor de elementos: el(tag, {clase, texto, html, attrs, on}, hijos) */
  function el(tag,o,hijos){
    var n=document.createElement(tag); o=o||{};
    if(o.clase) n.className=o.clase;
    if(o.texto!=null) n.textContent=o.texto;
    if(o.html!=null) n.innerHTML=o.html;           // solo con HTML construido por la app
    if(o.attrs) Object.keys(o.attrs).forEach(function(k){ n.setAttribute(k,o.attrs[k]); });
    if(o.estilo) n.style.cssText=o.estilo;
    if(o.on) Object.keys(o.on).forEach(function(k){ n.addEventListener(k,o.on[k]); });
    if(tag==='button' && !n.hasAttribute('type')) n.type='button';
    (hijos||[]).forEach(function(h){ if(h) n.appendChild(typeof h==='string'?document.createTextNode(h):h); });
    return n;
  }

  /* ---------- ALMACENAMIENTO RESISTENTE ----------
     iOS puede fallar en silencio (vista previa de Archivos/Mail, modo privado):
     verificamos escribiendo y releyendo. Si falla, usamos memoria para que la sesión
     no se rompa y avisamos SOLO a los adultos. */
  var almacenamientoDisponible = true;
  var _memoriaAlmacen = {};
  function crearAlmacenMemoria(){
    return {
      getItem:function(k){ return Object.prototype.hasOwnProperty.call(_memoriaAlmacen,k) ? _memoriaAlmacen[k] : null; },
      setItem:function(k,v){ _memoriaAlmacen[k]=String(v); },
      removeItem:function(k){ delete _memoriaAlmacen[k]; },
      key:function(i){ return Object.keys(_memoriaAlmacen)[i]||null; },
      get length(){ return Object.keys(_memoriaAlmacen).length; }
    };
  }
  var localStorage=(function(){
    try{
      var k='__lucia_test__', v=String(Date.now());
      window.localStorage.setItem(k,v);
      var leido=window.localStorage.getItem(k);
      window.localStorage.removeItem(k);
      if(leido!==v) throw new Error('no persiste');
      return window.localStorage;
    }catch(e){ almacenamientoDisponible=false; return crearAlmacenMemoria(); }
  })();
  function marcarAlmacenamientoFallido(){
    if(!almacenamientoDisponible) return;
    almacenamientoDisponible=false;
    // Copiamos lo que haya para no perder la sesión en curso.
    try{ for(var i=0;i<window.localStorage.length;i++){ var k=window.localStorage.key(i); if(k&&k.indexOf('lucia_')===0) _memoriaAlmacen[k]=window.localStorage.getItem(k); } }catch(e){}
    localStorage=crearAlmacenMemoria();
  }
  /* Lectura JSON validada: si el dato está corrupto o tiene otra forma, se usa el
     valor por defecto (nunca rompe la app ni deja a la niña sin poder entrar). */
  function leerJSON(clave,defecto,validar){
    try{
      var v=localStorage.getItem(clave); if(v==null) return defecto;
      var o=JSON.parse(v);
      if(validar && !validar(o)) return defecto;
      return o;
    }catch(e){ return defecto; }
  }
  function escribir(clave,valor){
    var txt=typeof valor==='string'?valor:JSON.stringify(valor);
    try{
      localStorage.setItem(clave,txt);
      if(localStorage.getItem(clave)!==txt){ marcarAlmacenamientoFallido(); localStorage.setItem(clave,txt); }
      return true;
    }catch(e){
      // Cuota llena: no marcamos fallo general, quien llama decide (ej. galería recorta).
      if(e && (e.name==='QuotaExceededError' || e.code===22)) return false;
      marcarAlmacenamientoFallido(); try{ localStorage.setItem(clave,txt); }catch(e2){}
      return false;
    }
  }
  function esObjeto(o){ return o!==null && typeof o==='object' && !Array.isArray(o); }

  /* ---------- AJUSTES GLOBALES (los cambia un adulto en el panel) ---------- */
  var AJUSTES_DEF={sonido:true, efectos:true, velocidadVoz:0.9, mic:false, pin:null, modoInglesUI:'bilingue', idioma:'es'};
  var ajustes=(function(){
    var a=leerJSON('lucia_ajustes',{},esObjeto), r={};
    Object.keys(AJUSTES_DEF).forEach(function(k){ r[k]=(a[k]!==undefined && typeof a[k]===typeof AJUSTES_DEF[k] || (k==='pin' && (a[k]===null || typeof a[k]==='string'))) ? a[k] : AJUSTES_DEF[k]; });
    if(r.velocidadVoz<0.6||r.velocidadVoz>1.2) r.velocidadVoz=0.9;
    return r;
  })();
  function guardarAjustes(){ escribir('lucia_ajustes',ajustes); }

  /* ---------- VOZ (síntesis del propio dispositivo: privada y sin conexión) ---------- */
  var vozES=null, vozEN=null;
  var sonido=ajustes.sonido;
  function puntuarVoz(v,pref){ var s=0; if(pref.test(v.lang)) s+=10; if(v.localService) s+=3; if(/enhanced|premium|natural|neural|siri/i.test(v.name)) s+=4; if(/compact|eloquence|novelty|bells|whisper|zarvox|trinoids|bad news|bahh|boing|bubbles|cellos|jester|organ|superstar|wobble|albert|fred|junior|ralph|kathy|grandma|grandpa|rocko|shelley|sandy|flo|reed|eddy/i.test(v.name)) s-=8; return s; }
  function elegirVoz(){ if(!('speechSynthesis' in window))return; var vs=speechSynthesis.getVoices()||[];
    // Privacidad: si hay voces locales (en el dispositivo) se usan SOLO esas, para que el
    // texto hablado (p. ej. el nombre de la niña) no se envíe a servicios de voz en la nube.
    var locales=vs.filter(function(v){return v.localService;}); if(locales.length) vs=locales;
    var es=vs.filter(function(v){return /^es/i.test(v.lang);}), en=vs.filter(function(v){return /^en/i.test(v.lang);});
    es.sort(function(a,b){return puntuarVoz(b,/^es[-_]?(CO|MX|US|419)/i)-puntuarVoz(a,/^es[-_]?(CO|MX|US|419)/i);});
    en.sort(function(a,b){return puntuarVoz(b,/^en[-_]?(US|GB)/i)-puntuarVoz(a,/^en[-_]?(US|GB)/i);});
    vozES=es[0]||null; vozEN=en[0]||null; }
  if('speechSynthesis' in window){ elegirVoz(); try{ speechSynthesis.addEventListener('voiceschanged',elegirVoz); }catch(e){ speechSynthesis.onvoiceschanged=elegirVoz; } }
  var alHablar=null; // gancho: el personaje "habla" mientras suena la voz
  function hablar(t,idioma,opciones){ opciones=opciones||{};
    if(!t) return;
    anunciar(t);
    if(!sonido || !('speechSynthesis' in window)){ if(opciones.fin) _setTimeout(opciones.fin,300); return; }
    try{ if(!opciones.encolar) speechSynthesis.cancel(); var u=new SpeechSynthesisUtterance(String(t));
      var voz = idioma==='en' ? vozEN : vozES;
      u.lang = voz ? voz.lang : (idioma==='en'?'en-US':'es-ES'); if(voz)u.voice=voz;
      u.rate=(idioma==='en'?0.82:1)*ajustes.velocidadVoz*(opciones.lento?0.8:1); u.pitch=1.08; u.volume=1;
      if(alHablar) alHablar(true);
      u.onend=u.onerror=function(){ if(alHablar) alHablar(false); if(opciones.fin) opciones.fin(); };
      speechSynthesis.speak(u); }catch(e){} }
  function hablarEN(t,op){ hablar(t,'en',op); }
  /* Región "aria-live" para lectores de pantalla (adultos con lector). */
  function anunciar(t){ var v=document.getElementById('vivo'); if(v){ v.textContent=''; v.textContent=String(t); } }

  /* Modo bilingüe en Descubrir (muestra/dice la palabra en inglés). Clave original conservada. */
  var modoBilingue=false;
  function cargarBilingue(){ modoBilingue = localStorage.getItem('lucia_bilingue')==='1'; }
  function guardarBilingue(){ escribir('lucia_bilingue', modoBilingue?'1':'0'); }
  function bilingueTag(en){ return (modoBilingue && en) ? '<div class="name-en" lang="en">'+esc(en)+'</div>' : ''; }
  function decirEN(en){ if(modoBilingue && en){ setTimeout(function(){ hablar(en,'en'); },900); } }

  /* ---------- SONIDOS (Web Audio, independientes de la voz) ---------- */
  var audioCtx=null;
  function ctxAudio(){ if(!audioCtx){ try{ audioCtx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return audioCtx; }
  document.addEventListener('pointerdown', function(){ var c=ctxAudio(); if(c && c.state==='suspended'){ try{c.resume();}catch(e){} } }, {once:true});
  function beep(freq,dur,tipo,vol){ if(!sonido || !ajustes.efectos)return; var c=ctxAudio(); if(!c)return;
    try{ var o=c.createOscillator(), g=c.createGain(); o.type=tipo||'sine'; o.frequency.value=freq;
      var t=c.currentTime; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol||0.14,t+0.012); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+0.03); }catch(e){} }
  function tono(f1,f2,dur,tipo,vol){ if(!sonido || !ajustes.efectos)return; var c=ctxAudio(); if(!c)return;
    try{ var o=c.createOscillator(), g=c.createGain(); o.type=tipo||'sine';
      var t=c.currentTime; o.frequency.setValueAtTime(f1,t); o.frequency.exponentialRampToValueAtTime(Math.max(f2,1),t+dur);
      g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol||0.16,t+0.01); g.gain.exponentialRampToValueAtTime(0.001,t+dur+0.02);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+0.05); }catch(e){} }
  function sonidoBien(){ beep(660,0.11); _setTimeout(function(){beep(880,0.15);},100); }
  // "Casi": dos notas suaves que bajan (sin zumbidos ni alarmas)
  function sonidoMal(){ beep(392,0.13,'triangle',0.08); _setTimeout(function(){beep(330,0.18,'triangle',0.07);},120); }
  function sonidoGane(){ [660,780,880,1040].forEach(function(f,i){ _setTimeout(function(){beep(f,0.18);},i*110); }); }
  function sonidoTap(){ tono(700,900,0.05,'sine',0.07); }
  function sonidoFlip(){ tono(500,750,0.07,'sine',0.09); }
  function sonidoPop(){ tono(520,1300,0.09,'sine',0.14); }
  /* Notas musicales (para el juego de música/ritmo) */
  var NOTAS={do:261.63,re:293.66,mi:329.63,fa:349.23,sol:392.0,la:440.0,si:493.88,do2:523.25};
  function nota(f,dur){ if(!sonido)return; var c=ctxAudio(); if(!c)return;
    try{ var t=c.currentTime, g=c.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.2,t+0.015); g.gain.exponentialRampToValueAtTime(0.001,t+(dur||0.6)); g.connect(c.destination);
      [1,2].forEach(function(m,i){ var o=c.createOscillator(); o.type=i?'sine':'triangle'; o.frequency.value=f*m; var gg=c.createGain(); gg.gain.value=i?0.25:1; o.connect(gg); gg.connect(g); o.start(t); o.stop(t+(dur||0.6)+0.05); });
    }catch(e){} }

  /* ---------- RECONOCIMIENTO DE VOZ (opcional, apagado por defecto) ----------
     Solo si un adulto lo activa en el panel. No se graba ni se guarda audio: el
     navegador transcribe y descartamos todo menos "¿se parece a la palabra?".
     Aviso: en Safari/Chrome el reconocimiento puede procesarse en servidores de
     Apple/Google; por eso es opcional y se explica en el panel de papás. */
  var _reconocedor=null;
  function micDisponible(){ return !!(window.SpeechRecognition||window.webkitSpeechRecognition); }
  function detenerEscucha(){ if(_reconocedor){ try{ _reconocedor.onresult=_reconocedor.onerror=_reconocedor.onend=null; _reconocedor.abort(); }catch(e){} _reconocedor=null; } }
  function escuchar(lang,cb){ // cb({ok:bool, texto:string|null, error?:string})
    detenerEscucha();
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!ajustes.mic || !SR){ cb({ok:false,texto:null,error:'no-disponible'}); return; }
    try{
      var r=new SR(); _reconocedor=r; r.lang=lang||'en-US'; r.interimResults=false; r.maxAlternatives=4; r.continuous=false;
      var hecho=false; function fin(x){ if(hecho)return; hecho=true; _reconocedor=null; cb(x); }
      r.onresult=function(ev){ var alts=[]; try{ for(var i=0;i<ev.results[0].length;i++) alts.push(String(ev.results[0][i].transcript||'').toLowerCase()); }catch(e){} fin({ok:true,texto:alts.join(' | ')}); };
      r.onerror=function(ev){ fin({ok:false,texto:null,error:ev&&ev.error||'error'}); };
      r.onend=function(){ fin({ok:false,texto:null,error:'sin-voz'}); };
      r.start();
      _setTimeout(function(){ if(_reconocedor===r){ try{ r.stop(); }catch(e){} } },6000);
    }catch(e){ cb({ok:false,texto:null,error:'error'}); }
  }
