  /* =====================================================================
     UI: helpers de pantalla, navegación, componentes reutilizables.
     ===================================================================== */
  var app=document.getElementById('app');
  var btnAtras=document.getElementById('btnAtras');
  var btnSon=document.getElementById('btnSon');
  var btnIdioma=document.getElementById('btnIdioma');
  var contextoAtras=function(){ inicio(); };
  var pantalla='';
  function rnd(n){return Math.floor(Math.random()*n);}
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=rnd(i+1);var t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function reduce(){return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);}
  function chispas(x,y){ if(reduce())return; var set=['⭐','✨','💫'];
    for(var i=0;i<5;i++){var s=document.createElement('div');s.className='chispa';s.setAttribute('aria-hidden','true');s.textContent=set[rnd(set.length)];
      s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',(Math.random()*120-60)+'px');s.style.setProperty('--rot',(Math.random()*120-60)+'deg');
      document.body.appendChild(s);_setTimeout((function(n){return function(){n.remove();};})(s),1000);} }
  function fx(card,say,ev){ hablar(say);card.classList.remove('pop');void card.offsetWidth;card.classList.add('pop');
    var r=card.getBoundingClientRect(); chispas((ev&&ev.clientX)?ev.clientX:r.left+r.width/2,(ev&&ev.clientY)?ev.clientY:r.top+r.height/2);
    reaccionPersonaje(true); }
  function animarTap(n,clase,ms){ if(!n)return; n.classList.remove(clase); void n.offsetWidth; n.classList.add(clase); _setTimeout(function(){n.classList.remove(clase);}, ms||700); }
  function animarIconoSonido(n){ animarTap(n,'sonando',700); }
  /* artículo para nombres en español (el perro, la vaca, las uvas, los arándanos) */
  var ART_EXC={nariz:'la',mano:'la',leche:'la',moto:'la',miel:'la',sal:'la',flor:'la',luz:'la',pie:'el',cohete:'el',tomate:'el',aguacate:'el',chocolate:'el',queso:'el',helicóptero:'el'};
  function art(n){ n=String(n||''); var w=n.split(' ')[0].toLowerCase(); if(ART_EXC[w]) return ART_EXC[w]+' '+n;
    if(/as$/.test(w)) return 'las '+n; if(/os$/.test(w)) return 'los '+n; if(/a$/.test(w)) return 'la '+n; return 'el '+n; }
  /* lluvia de chispas para celebraciones grandes */
  function celebrar(n){ if(reduce())return; var W=window.innerWidth,H=window.innerHeight; for(var i=0;i<(n||12);i++){(function(d){setTimeout(function(){chispas(rnd(W),H*0.3+rnd(Math.round(H*0.3)));},d);})(i*70);} }
  /* fecha local (no UTC): en Colombia, después de las 7 p. m. UTC ya es "mañana" */
  function fechaLocal(d){ d=d||new Date(); var m=d.getMonth()+1, dd=d.getDate(); return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(dd<10?'0':'')+dd; }
  function nuevaCard(){ return el('button',{clase:'card'}); }
  function titulo(txt){ var h=el('h1',{clase:'titulo',texto:txt}); app.appendChild(h); return h; }
  function formaHtml(o){ if(o.emoji)return '<div class="big">'+o.emoji+'</div>';
    var st=o.cls==='sh-triangulo'?'border-bottom-color:'+o.color:'background:'+o.color;
    return '<div class="forma"><div class="sh '+o.cls+'" style="'+st+'"></div></div>'; }

  /* ---------- NAVEGACIÓN ----------
     pantallaBase(atras, {mundo, barra}) limpia, decide si se ve "Volver" y tematiza
     el fondo según el mundo (descubrir/jugar/crear/ingles/padres). */
  function pantallaBase(atras,op){
    op=op||{};
    barraInferior(!!op.barra);                     // incluye nuevaPantalla()
    contextoAtras=atras||function(){ inicio(); };
    btnAtras.classList.toggle('visible',!!atras);
    document.body.setAttribute('data-mundo',op.mundo||'');
    app.innerHTML=''; app.scrollTop=0; pantalla=op.pantalla||'';
    personajeActual=null;
    _ultimaInteraccion=Date.now();
  }

  /* ---------- COMPONENTES ---------- */
  /* Barra de progreso visual (sin números para la niña; el valor queda para lectores). */
  function barraProgreso(frac,color,etiqueta){
    frac=Math.max(0,Math.min(1,frac||0));
    var b=el('div',{clase:'progreso-barra',attrs:{role:'progressbar','aria-valuemin':'0','aria-valuemax':'100','aria-valuenow':String(Math.round(frac*100)),'aria-label':etiqueta||'Progreso'}});
    if(color) b.style.setProperty('--pc',color);
    b.appendChild(el('span',{estilo:'width:'+(frac>0?Math.max(6,frac*100):0)+'%'}));
    return b;
  }
  /* Fila de estrellas (rondas de una actividad) */
  function filaEstrellas(total,on){
    var p=el('div',{clase:'estrellas',attrs:{'aria-hidden':'true'}});
    for(var k=0;k<total;k++){ p.appendChild(el('i',{clase:k<on?'on':''})); }
    return p;
  }
  function encenderEstrella(fila,i){ var e=fila&&fila.children[i]; if(e){ e.className='on'; animarTap(e,'rebota',400); } }
  /* Botón grande de "escuchar" (la instrucción siempre es hablada) */
  function botonEscuchar(texto,decir,idioma){
    var b=el('button',{clase:'prompt',attrs:{'aria-label':'Escuchar: '+texto}});
    b.innerHTML='<span class="sp" aria-hidden="true">'+ICONO_ALTAVOZ+'</span><span class="prompt-t"></span>';
    b.querySelector('.prompt-t').textContent=texto;
    b.addEventListener('click',function(){ (typeof decir==='function'?decir:function(){hablar(decir||texto,idioma);})(); animarIconoSonido(b.querySelector('.sp')); });
    return b;
  }
  var ICONO_ALTAVOZ='<svg viewBox="0 0 32 32" width="26" height="26"><path d="M6 12h5l7-6v20l-7-6H6z" fill="currentColor"/><path d="M22 11c2 2.5 2 7.5 0 10M25.5 7.5c4 4.5 4 12.5 0 17" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';

  /* Personaje que acompaña la actividad: aparece en una esquina, reacciona a aciertos
     ("¡bien!") y a intentos ("piensa" sin tristeza). */
  var personajeActual=null;
  function acompanante(quien,globo){
    var w=personaje(quien||'lucia','feliz',84,globo);
    w.classList.add('pj-acompana');
    personajeActual=w.querySelector('svg');
    _setTimeout(function(){ animarPersonaje(personajeActual,'saluda'); },250);
    return w;
  }
  function reaccionPersonaje(bien){
    if(!personajeActual || !document.body.contains(personajeActual)) return;
    if(bien){ animoPersonaje(personajeActual,'contenta','celebra'); }
    else { animoPersonaje(personajeActual,'piensa','piensa'); }
    var pj=personajeActual;
    _setTimeout(function(){ if(document.body.contains(pj)) animoPersonaje(pj,'feliz'); },1400);
  }

  /* Repite la instrucción si no hay interacción en 9 s (una sola vez por ronda). */
  var _ultimaInteraccion=Date.now();
  document.addEventListener('pointerdown',function(){ _ultimaInteraccion=Date.now(); },true);
  function recordarSiInactivo(fn,ms){
    var marca=Date.now(); ms=ms||9000;
    setTimeout(function(){ if(_ultimaInteraccion<=marca) fn(); },ms);
  }

  /* Pantalla de celebración reutilizable. */
  function pantallaFiesta(o){
    var f=el('div',{clase:'fiesta'});
    var pjw=personaje(o.pj||'lucia','animando',140); f.appendChild(pjw);
    _setTimeout(function(){ animarPersonaje(pjw.querySelector('svg'),'celebra'); },120);
    if(o.titulo) f.appendChild(el('h2',{texto:o.titulo}));
    if(o.sub) f.appendChild(el('p',{clase:'fiesta-sub',texto:o.sub}));
    if(o.estrellas) f.appendChild(filaEstrellas(o.estrellas,o.estrellas));
    var btns=el('div',{clase:'btns'});
    (o.botones||[]).forEach(function(b,i){
      btns.appendChild(el('button',{clase:'btng'+(i===0?' primario':''),html:(b.ico?'<span aria-hidden="true">'+b.ico+'</span> ':'')+esc(b.t),
        on:{click:function(){ sonidoTap(); if(b.decir) hablar(b.decir); b.go(); }}}));
    });
    f.appendChild(btns);
    if(o.sugerir) f.appendChild(sugerenciasDespues(o.sugerir));
    sonidoGane(); celebrar(o.chispas||14);
    if(o.decir) hablar(o.decir);
    return f;
  }

  /* ---------- BARRA INFERIOR (solo en inicio y menús de mundo) ----------
     Muestra el avatar, el nombre y un "frasco de estrellas" que se llena con todo lo
     que ha hecho (niveles, descubrimientos, palabras en inglés, stickers). Sin números:
     los números viven en el panel de papás. */
  var barraInfEl=null;
  function totalExplorado(){ var n=0; Object.keys(explorado).forEach(function(k){ if(esObjeto(explorado[k])) n+=Object.keys(explorado[k]).length; }); return n; }
  function totalExplorable(){ var n=0; Object.keys(TOTALES).forEach(function(k){ n+=TOTALES[k]; }); return n; }
  function perfilActivo(){ return cargarPerfiles().find(function(x){return String(x.id)===String(perfilActual);}); }
  function fraccionGlobal(){
    var ganados=cargarStickers().length, totalStk=Object.keys(STICKERS).length;
    var partes=[ nivelesVisibles().length? Math.min(1,completados/nivelesVisibles().length):0,
      totalStk?ganados/totalStk:0,
      totalExplorable()?totalExplorado()/totalExplorable():0,
      fraccionIngles() ];
    return partes.reduce(function(s,v){return s+v;},0)/partes.length;
  }
  function barraInferior(mostrar){
    nuevaPantalla();
    document.body.classList.remove('modo-papas');
    if(!barraInfEl){
      barraInfEl=el('nav',{clase:'barrainf',attrs:{'aria-label':'Mi progreso'}});
      document.body.appendChild(barraInfEl);
    }
    if(!mostrar || perfilActual==null){
      barraInfEl.classList.remove('visible');
      document.body.classList.remove('tiene-barrainf');
      return;
    }
    var p=perfilActivo(), ganados=cargarStickers();
    var recientes=ganados.slice(-3).reverse().map(function(id){return STICKERS[id];}).filter(Boolean);
    barraInfEl.innerHTML='';
    barraInfEl.appendChild(el('button',{clase:'binf-av',attrs:{'aria-label':'Cambiar de jugador'},texto:p?p.avatar:'🌟',
      on:{click:function(){ hablar('¿Quién va a jugar?'); pantallaPerfiles(); }}}));
    var info=el('div',{clase:'binf-info'});
    info.appendChild(el('span',{clase:'binf-nombre',texto:p?p.nombre:''}));
    info.appendChild(barraProgreso(fraccionGlobal(),'var(--pasto)','Todo lo que has descubierto'));
    barraInfEl.appendChild(info);
    var stks=el('button',{clase:'binf-stks',attrs:{'aria-label':'Mi colección de stickers'},on:{click:function(){ hablar('Mi colección'); album(); }}});
    for(var i=0;i<3;i++){ var s=recientes[i]; stks.appendChild(el('span',{clase:'binf-stk'+(s?'':' vacio'),texto:s?s.emoji:'✦',attrs:{'aria-hidden':'true'}})); }
    barraInfEl.appendChild(stks);
    barraInfEl.classList.add('visible');
    document.body.classList.add('tiene-barrainf');
  }

  /* Diálogo de confirmación para adultos (acciones destructivas). */
  function confirmar(msg,textoOk,cb){
    var ov=el('div',{clase:'overlay',attrs:{role:'dialog','aria-modal':'true','aria-label':'Confirmar'}});
    var card=el('div',{clase:'overlay-card adulto'});
    card.appendChild(el('p',{clase:'conf-msg',texto:msg}));
    var btns=el('div',{clase:'overlay-btns'});
    var no=el('button',{clase:'btn-adulto',texto:'Cancelar',on:{click:function(){ov.remove();}}});
    var si=el('button',{clase:'btn-adulto peligro',texto:textoOk||'Sí, continuar',on:{click:function(){ov.remove();cb();}}});
    btns.appendChild(no); btns.appendChild(si); card.appendChild(btns); ov.appendChild(card);
    ov.addEventListener('click',function(e){ if(e.target===ov) ov.remove(); });
    document.body.appendChild(ov); no.focus();
  }
  function aviso(msg){ var t=el('div',{clase:'aviso-toast',attrs:{role:'status'},texto:msg}); document.body.appendChild(t); _setTimeout(function(){ t.classList.add('fuera'); _setTimeout(function(){t.remove();},400); },2600); }
