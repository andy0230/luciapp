  /* =====================================================================
     ARRANQUE: botones fijos, service worker (modo sin conexión) y primera pantalla.
     ===================================================================== */
  function actualizarBtnSon(){ btnSon.classList.toggle('apagado',!sonido); btnSon.setAttribute('aria-pressed',String(sonido)); btnSon.setAttribute('aria-label',sonido?'Sonido encendido':'Sonido apagado'); }
  function actualizarBtnIdioma(){ btnIdioma.querySelector('.idioma-txt').textContent=modoBilingue?'ES·EN':'ES'; btnIdioma.setAttribute('aria-pressed',String(modoBilingue)); btnIdioma.classList.toggle('activo',modoBilingue); }
  btnAtras.addEventListener('click',function(){ sonidoTap(); var f=contextoAtras; f(); });
  /* Silenciar requiere mantener 1 s (evita que la niña lo apague sin querer);
     un toque corto solo da una pista. Desde el panel de papás se cambia libremente. */
  (function(){ var t=null, hecho=false;
    btnSon.addEventListener('pointerdown',function(){ hecho=false; btnSon.classList.add('presionando'); t=_setTimeout(function(){ hecho=true; btnSon.classList.remove('presionando');
      sonido=!sonido; ajustes.sonido=sonido; guardarAjustes(); actualizarBtnSon(); if(sonido) hablar('¡Sonido encendido!'); else if('speechSynthesis' in window) speechSynthesis.cancel(); },900); });
    function soltar(){ if(t){ clearTimeout(t); t=null; } btnSon.classList.remove('presionando'); }
    btnSon.addEventListener('pointerup',soltar); btnSon.addEventListener('pointerleave',soltar); btnSon.addEventListener('pointercancel',soltar);
    btnSon.addEventListener('click',function(e){ if(e.detail===0){ sonido=!sonido; ajustes.sonido=sonido; guardarAjustes(); actualizarBtnSon(); } else if(!hecho){ animarTap(btnSon,'rebota',350); } });
  })();
  btnIdioma.addEventListener('click',function(){
    modoBilingue=!modoBilingue; guardarBilingue(); actualizarBtnIdioma();
    if(modoBilingue) hablar('Spanish and English','en'); else hablar('Español');
    if(pantalla.indexOf('cat:')===0) categoria(pantalla.slice(4));
  });
  document.addEventListener('visibilitychange',function(){ if(document.hidden) guardarSesionActual(); });
  window.addEventListener('pagehide',function(){ guardarSesionActual(); });

  /* Service worker: solo cuando se sirve por http(s) (GitHub Pages). Abierto como archivo, no aplica. */
  if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
    window.addEventListener('load',function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); });
  }

  cargarBilingue(); actualizarBtnIdioma(); actualizarBtnSon();
  try{ escribir('lucia_version',VERSION_APP); }catch(e){}
  pantallaPerfiles();
