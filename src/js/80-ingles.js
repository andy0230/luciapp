  /* =====================================================================
     ENGLISH WORLD — Mi mundo en inglés (guía: Ollie el búho)
     Recorrido: escuchar → observar → asociar → reconocer → repetir → reforzar.
     · Contenido en 15-ingles-datos.js (ampliable: agregar palabras/categorías ahí).
     · Progreso por perfil en lucia_p{id}_ingles.
     · Repetición espaciada sencilla (cajas 0–4 → 0,1,3,7,14 días).
     · Máximo 3 palabras NUEVAS por día en los juegos (Descubrir palabras es libre).
     · Nunca se exige pronunciar ni se califica la pronunciación.
     ===================================================================== */
  var ENGLISH_TODAS=[], ENGLISH_POR_ID={};
  ENGLISH.categorias.forEach(function(c){ c.palabras.forEach(function(p){ p.cat=c.id; ENGLISH_TODAS.push(p); ENGLISH_POR_ID[p.id]=p; }); });
  var INTERVALOS_DIAS=[0,1,3,7,14];
  var NUEVAS_POR_DIA=3;
  var progIngles={palabras:{},historias:{},hoy:{fecha:'',nuevas:[]},soporte:'es'};
  function cargarIngles(){
    var p=leerJSON(claves('ingles'),{},esObjeto);
    progIngles={palabras:{},historias:esObjeto(p.historias)?p.historias:{},hoy:esObjeto(p.hoy)&&Array.isArray(p.hoy.nuevas)?p.hoy:{fecha:'',nuevas:[]},soporte:p.soporte==='en'?'en':'es'};
    if(esObjeto(p.palabras)) Object.keys(p.palabras).forEach(function(id){ var w=p.palabras[id]; if(ENGLISH_POR_ID[id] && esObjeto(w)) progIngles.palabras[id]={v:+w.v||0,a:+w.a||0,f:+w.f||0,c:Math.max(0,Math.min(4,+w.c||0)),u:typeof w.u==='string'?w.u:''}; });
    if(progIngles.hoy.fecha!==fechaLocal()) progIngles.hoy={fecha:fechaLocal(),nuevas:[]};
  }
  function guardarIngles(){ escribir(claves('ingles'),progIngles); }
  function regPalabra(id){ if(!progIngles.palabras[id]) progIngles.palabras[id]={v:0,a:0,f:0,c:0,u:''}; return progIngles.palabras[id]; }
  function verPalabra(p){
    var nueva=!progIngles.palabras[p.id]; var w=regPalabra(p.id); w.v++; if(!w.u) w.u=fechaLocal(); guardarIngles();
    if(nueva){ var n=palabrasInglesVistas().length; if(n>=3) desbloquear('en_primeras'); if(n>=10) desbloquear('en_10');
      var cat=ENGLISH.categorias.filter(function(c){return c.id===p.cat;})[0];
      if(cat && cat.palabras.every(function(x){return progIngles.palabras[x.id];})) desbloquear('en_categoria'); }
  }
  function respuestaPalabra(id,bien){
    var w=regPalabra(id); if(bien){ w.a++; w.c=Math.min(4,w.c+1); } else { w.f++; w.c=Math.max(0,w.c-1); }
    w.u=fechaLocal(); guardarIngles(); registrarStat('ingles',bien);
  }
  function diasDesde(f){ if(!f) return 999; var p=f.split('-'); var d=new Date(+p[0],+p[1]-1,+p[2]); return Math.floor((Date.now()-d.getTime())/86400000); }
  function palabrasInglesVistas(){ return ENGLISH_TODAS.filter(function(p){ return progIngles.palabras[p.id]; }); }
  function palabrasAprendidas(){ return ENGLISH_TODAS.filter(function(p){ var w=progIngles.palabras[p.id]; return w && w.c>=3; }); }
  function palabrasPorReforzar(n){ return ENGLISH_TODAS.filter(function(p){ var w=progIngles.palabras[p.id]; return w && (w.f>w.a || (w.a+w.f>0 && w.c<2)); }).slice(0,n||99); }
  function fraccionIngles(){ var s=0; ENGLISH_TODAS.forEach(function(p){ var w=progIngles.palabras[p.id]; if(w) s+=0.4+0.15*w.c; }); return ENGLISH_TODAS.length? Math.min(1,s/ENGLISH_TODAS.length) : 0; }
  function vencida(p){ var w=progIngles.palabras[p.id]; return w && diasDesde(w.u)>=INTERVALOS_DIAS[w.c]; }
  /* Elige palabras para un juego: primero las vencidas/por reforzar, luego vistas,
     y como máximo NUEVAS_POR_DIA palabras nuevas (nivel 1 primero). */
  function elegirPalabras(n,filtro){
    var pool=ENGLISH_TODAS.filter(filtro||function(){return true;});
    var debidas=shuffle(pool.filter(vencida)), vistas=shuffle(pool.filter(function(p){return progIngles.palabras[p.id] && !vencida(p);}));
    var nuevasHoy=progIngles.hoy.nuevas, cupo=Math.max(0,NUEVAS_POR_DIA-nuevasHoy.length);
    var nuevas=pool.filter(function(p){return !progIngles.palabras[p.id];}).sort(function(a,b){return (a.nivel||1)-(b.nivel||1)||Math.random()-0.5;});
    var deHoy=nuevasHoy.map(function(id){return ENGLISH_POR_ID[id];}).filter(function(p){return p && pool.indexOf(p)>=0 && debidas.indexOf(p)<0;});
    var r=debidas.concat(deHoy);
    r=r.concat(nuevas.slice(0,cupo)).concat(vistas);
    if(r.length<n) r=r.concat(shuffle(nuevas.slice(cupo)));     // si aún no hay suficientes, se completa
    var out=[]; r.forEach(function(p){ if(out.indexOf(p)<0 && out.length<n) out.push(p); });
    out.forEach(function(p){ if(!progIngles.palabras[p.id] && nuevasHoy.indexOf(p.id)<0) nuevasHoy.push(p.id); });
    guardarIngles();
    return out;
  }

  /* Dice una palabra: con apoyo en español ("Perro… Dog. Dog.") o solo inglés. */
  function decirPalabra(p,op){ op=op||{};
    var en=p.en;
    if(progIngles.soporte==='es' && !op.soloEN){ hablar(p.es,'es',{fin:function(){ hablarEN(en,{encolar:true}); hablarEN(en,{encolar:true,lento:true}); }}); }
    else { hablarEN(en); if(!op.unaVez) hablarEN(en,{encolar:true,lento:true}); }
  }
  function ilustracion(p,grande){
    var cls=grande?'en-ilu grande':'en-ilu';
    if(p.hex) return '<span class="'+cls+'"><span class="en-color" style="background:'+p.hex+'"></span><span class="en-obj">'+p.e+'</span></span>';
    if(p.n){ var s=''; for(var i=0;i<p.n;i++) s+='<span>⭐</span>'; return '<span class="'+cls+' en-num"><b>'+p.n+'</b><span class="en-cant">'+s+'</span></span>'; }
    return '<span class="'+cls+'"><span class="en-emoji">'+p.e+'</span></span>';
  }

  /* ---------- MENÚ ---------- */
  var SECCIONES_EN=[
    {k:'palabras',ico:'📚',en:'My First Words',es:'Mis primeras palabras',go:function(){ enCategorias(); }},
    {k:'escucha',ico:'🎧',en:'Listen and Find',es:'Escucha y encuentra',go:function(){ enEscucha(); }},
    {k:'repite',ico:'🗣️',en:'Repeat with Me',es:'Repite conmigo',go:function(){ enRepite(); }},
    {k:'colores',ico:'🎨',en:'Colors',es:'Colores en inglés',go:function(){ enVisor('colors'); }},
    {k:'numeros',ico:'🔢',en:'Numbers',es:'Números en inglés',go:function(){ enVisor('numbers'); }},
    {k:'animales',ico:'🐮',en:'Animal Sounds',es:'Sonidos de animales',go:function(){ enAnimales(); }},
    {k:'cuentos',ico:'📗',en:'Little Stories',es:'Cuentos cortos',go:function(){ enCuentos(); }},
    {k:'coleccion',ico:'⭐',en:'My Collection',es:'Mi colección en inglés',go:function(){ enColeccion(); }}
  ];
  function mundoIngles(){
    pantallaBase(function(){inicio();},{mundo:'ingles',barra:true}); marcarActividad('English World');
    var cab=cabeceraMundo('English World',null,null,'ollie');
    cab.appendChild(selectorSoporte());
    var box=el('div',{clase:'actividades en-menu'});
    SECCIONES_EN.forEach(function(s,i){
      var o={ico:s.ico,t:s.en,go:s.go,say:null};
      var b=tarjetaActividad(o,i);
      b.querySelector('.act-t').setAttribute('lang','en');
      b.appendChild(el('span',{clase:'act-es',texto:s.es}));
      if(s.k==='palabras'){ b.classList.add('destacada'); b.appendChild(barraProgreso(fraccionIngles(),'var(--mar)','Avance en inglés')); }
      // al tocar: dice el nombre en inglés y su apoyo en español
      b.addEventListener('click',function(){ hablarEN(s.en); },true);
      box.appendChild(b);
    });
    app.appendChild(box);
    _setTimeout(function(){ hablarEN('Hello! Welcome to English World!',{fin:function(){ if(progIngles.soporte==='es') hablar('¡Hola! Bienvenida al mundo en inglés','es',{encolar:true}); }}); },350);
  }
  /* Cambiar el apoyo: español + inglés, o solo inglés. */
  function selectorSoporte(){
    var b=el('button',{clase:'chip-soporte',attrs:{'aria-label':'Cambiar idioma de apoyo','aria-pressed':String(progIngles.soporte==='en')}});
    function pintar(){ b.innerHTML=progIngles.soporte==='es'?'<span aria-hidden="true">ES + EN</span>':'<span aria-hidden="true">EN</span>'; }
    pintar();
    b.addEventListener('click',function(){ progIngles.soporte=progIngles.soporte==='es'?'en':'es'; guardarIngles(); pintar();
      if(progIngles.soporte==='en') hablarEN('Only English!'); else hablar('Español e inglés'); });
    return b;
  }
  function cabEn(titulo,volver,quien){
    pantallaBase(volver,{mundo:'ingles'});
    var cab=el('div',{clase:'juego-cab'});
    cab.appendChild(el('h1',{clase:'titulo',texto:titulo,attrs:{lang:'en'}}));
    cab.appendChild(acompanante(quien||'ollie'));
    app.appendChild(cab);
    return cab;
  }

  /* ---------- A. MY FIRST WORDS ---------- */
  function enCategorias(){
    cabEn('My First Words',mundoIngles); marcarActividad('English: palabras');
    var box=el('div',{clase:'actividades'});
    ENGLISH.categorias.forEach(function(c,i){
      var vistas=c.palabras.filter(function(p){return progIngles.palabras[p.id];}).length;
      var b=tarjetaActividad({ico:c.ico,t:c.en,frac:vistas/c.palabras.length,color:'var(--mar)',hecho:vistas>=c.palabras.length,go:function(){ enVisor(c.id); }},i);
      b.querySelector('.act-t').setAttribute('lang','en');
      b.appendChild(el('span',{clase:'act-es',texto:c.es}));
      b.addEventListener('click',function(){ hablarEN(c.en); },true);
      box.appendChild(b);
    });
    app.appendChild(box);
    _setTimeout(function(){ hablarEN('Choose a topic!',{fin:function(){ if(progIngles.soporte==='es') hablar('Elige un tema','es',{encolar:true}); }}); },300);
  }
  /* Visor de tarjetas grandes: una palabra a la vez (menos estímulos, más foco). */
  function enVisor(catId){
    var cat=ENGLISH.categorias.filter(function(c){return c.id===catId;})[0]; if(!cat){ enCategorias(); return; }
    var volver=(catId==='colors'||catId==='numbers')?mundoIngles:enCategorias;
    cabEn(cat.en,volver); marcarActividad('English: '+cat.en);
    var lista=cat.palabras.slice().sort(function(a,b){return (a.nivel||1)-(b.nivel||1);}), i=0;
    var visor=el('div',{clase:'en-visor'});
    var ant=el('button',{clase:'flecha-btn',attrs:{'aria-label':'Anterior'},html:'<span aria-hidden="true">‹</span>'});
    var sig=el('button',{clase:'flecha-btn',attrs:{'aria-label':'Siguiente'},html:'<span aria-hidden="true">›</span>'});
    var tarjeta=el('button',{clase:'en-tarjeta'});
    visor.appendChild(ant); visor.appendChild(tarjeta); visor.appendChild(sig);
    app.appendChild(visor);
    var puntos=el('div',{clase:'en-puntos',attrs:{'aria-hidden':'true'}}); lista.forEach(function(){ puntos.appendChild(el('i')); }); app.appendChild(puntos);
    var acciones=el('div',{clase:'en-acciones'});
    var otra=el('button',{clase:'btng',html:'<span aria-hidden="true">🔊</span> <span lang="en">Again</span>',on:{click:function(){ decirPalabra(lista[i],{soloEN:true}); animarTap(tarjeta,'pop',450); }}});
    var ejemplo=el('button',{clase:'btng',html:'<span aria-hidden="true">💬</span> <span lang="en">Example</span>',on:{click:function(){ var p=lista[i]; hablarEN(p.ej,{fin:function(){ if(progIngles.soporte==='es'&&p.ejEs) hablar(p.ejEs,'es',{encolar:true}); }}); }}});
    var jugar=el('button',{clase:'btng primario',html:'<span aria-hidden="true">🎧</span> <span lang="en">Play</span>',on:{click:function(){ enEscucha(function(p){return p.cat===catId;},function(){ enVisor(catId); }); }}});
    acciones.appendChild(otra); acciones.appendChild(ejemplo); acciones.appendChild(jugar);
    app.appendChild(acciones);
    function mostrar(dir){
      var p=lista[i];
      tarjeta.innerHTML=ilustracion(p,true)+'<span class="en-palabra" lang="en"></span><span class="en-es"></span>';
      tarjeta.querySelector('.en-palabra').textContent=p.en;
      tarjeta.querySelector('.en-es').textContent=p.es;
      tarjeta.setAttribute('aria-label',p.en+', '+p.es);
      tarjeta.classList.remove('entra-d','entra-i'); void tarjeta.offsetWidth; tarjeta.classList.add(dir<0?'entra-i':'entra-d');
      Array.prototype.forEach.call(puntos.children,function(x,k){ x.className=k===i?'on':(progIngles.palabras[lista[k].id]?'visto':''); });
      ejemplo.style.visibility=p.ej?'visible':'hidden';
      verPalabra(p); decirPalabra(p);
      if(personajeActual) animarPersonaje(personajeActual,'senala');
    }
    tarjeta.addEventListener('click',function(e){ decirPalabra(lista[i],{soloEN:true}); fx(tarjeta,null,e); });
    ant.addEventListener('click',function(){ sonidoFlip(); i=(i-1+lista.length)%lista.length; mostrar(-1); });
    sig.addEventListener('click',function(){ sonidoFlip(); i=(i+1)%lista.length; mostrar(1); });
    // deslizar con el dedo
    var x0=null; tarjeta.addEventListener('pointerdown',function(e){ x0=e.clientX; });
    tarjeta.addEventListener('pointerup',function(e){ if(x0==null) return; var dx=e.clientX-x0; x0=null; if(Math.abs(dx)>60){ (dx<0?sig:ant).click(); } });
    _setTimeout(function(){ mostrar(1); },250);
  }

  /* ---------- B. LISTEN AND FIND ---------- */
  function enEscucha(filtro,volver){
    var titulo='Listen and Find';
    cabEn(titulo,volver||mundoIngles); marcarActividad('English: Listen and Find');
    var rondas=5, aciertos=0, objetivos=elegirPalabras(rondas,filtro);
    if(!objetivos.length){ mundoIngles(); return; }
    var est=filaEstrellas(objetivos.length,0); app.appendChild(est);
    var zona=el('div',{clase:'zona-juego'}); app.appendChild(zona);
    function ronda(){
      zona.innerHTML='';
      var p=objetivos[aciertos], fallos=0, bloqueado=false;
      var nOps=(progIngles.palabras[p.id]&&progIngles.palabras[p.id].a>=2)||configPerfil.dificultad==='reto'?3:2;
      var mismos=ENGLISH_TODAS.filter(function(x){ return x.cat===p.cat && x.id!==p.id && x.e!==p.e; });
      var otros=ENGLISH_TODAS.filter(function(x){ return x.cat!==p.cat && x.e!==p.e; });
      var dist=shuffle(mismos.length>=nOps-1?mismos:mismos.concat(otros)).slice(0,nOps-1);
      var ops=shuffle([p].concat(dist));
      zona.appendChild(botonEscuchar('Listen!',function(){ hablarEN(p.en,{lento:true}); },'en'));
      zona.querySelector('.prompt-t').setAttribute('lang','en');
      var grid=el('div',{clase:'opciones n'+ops.length});
      ops.forEach(function(o){
        var c=nuevaCard(); c.innerHTML=ilustracion(o); c.setAttribute('aria-label',o.es);
        c.addEventListener('click',function(e){
          if(bloqueado) return;
          if(o===p){ bloqueado=true; c.classList.add('bien'); sonidoBien(); respuestaPalabra(p.id,fallos===0);
            fx(c,null,e); hablarEN('Yes! '+p.en+'!'); aciertos++; encenderEstrella(est,aciertos-1);
            setTimeout(function(){ aciertos<objetivos.length? ronda() : fin(); },1500);
          } else {
            fallos++; c.classList.remove('mal'); void c.offsetWidth; c.classList.add('mal'); c.classList.add('apagada'); sonidoMal();
            if(fallos===1) respuestaPalabra(p.id,false);
            hablarEN(o.en,{fin:function(){ if(progIngles.soporte==='es') hablar('Ese es '+o.es+'. Escucha otra vez','es',{encolar:true,fin:function(){ hablarEN(p.en,{encolar:true,lento:true}); }}); else hablarEN('Listen again: '+p.en,{encolar:true}); }});
            if(fallos>=1 && ops.length<=2 || fallos>=2) grid.querySelectorAll('.card').forEach(function(x,k){ if(ops[k]===p) x.classList.add('pista'); });
          }
        });
        grid.appendChild(c);
      });
      zona.appendChild(grid);
      setTimeout(function(){ hablarEN(p.en,{lento:true}); },350);
      recordarSiInactivo(function(){ hablarEN(p.en,{lento:true}); });
    }
    function fin(){
      desbloquear('en_escucha');
      app.innerHTML='';
      app.appendChild(pantallaFiesta({pj:'ollie',titulo:'Great job!',decir:'Great job! ¡Escuchaste muy bien!',estrellas:objetivos.length,
        botones:[{ico:'🔁',t:'Again',decir:'Again!',go:function(){ enEscucha(filtro,volver); }},{ico:'🦉',t:'English World',go:function(){ mundoIngles(); }}]}));
    }
    ronda();
  }

  /* ---------- C. REPEAT WITH ME ---------- */
  function enRepite(){
    cabEn('Repeat with Me',mundoIngles); marcarActividad('English: Repeat with Me');
    var lista=elegirPalabras(5), k=0;
    var zona=el('div',{clase:'en-repite'}); app.appendChild(zona);
    var est=filaEstrellas(lista.length,0); app.insertBefore(est,zona);
    var usarMic=ajustes.mic && micDisponible();
    function paso(){
      zona.innerHTML='';
      var p=lista[k];
      var t=el('button',{clase:'en-tarjeta mediana',attrs:{'aria-label':p.en},html:ilustracion(p,true)+'<span class="en-palabra" lang="en"></span>'});
      t.querySelector('.en-palabra').textContent=p.en;
      t.addEventListener('click',function(){ hablarEN(p.en,{lento:true}); });
      zona.appendChild(t);
      var turno=el('div',{clase:'en-turno',attrs:{'aria-live':'polite'}});
      zona.appendChild(turno);
      var acciones=el('div',{clase:'en-acciones'});
      acciones.appendChild(el('button',{clase:'btng',html:'<span aria-hidden="true">🔊</span> <span lang="en">Listen</span>',on:{click:function(){ hablarEN(p.en,{lento:true}); }}}));
      if(usarMic){
        acciones.appendChild(el('button',{clase:'btng mic',html:'<span aria-hidden="true">🎤</span> <span lang="en">My turn</span>',on:{click:function(){
          turno.textContent='👂'; hablar('','es');
          escuchar('en-US',function(r){
            var dijo=r.ok && r.texto;
            var acerto=dijo && r.texto.indexOf(p.en.toLowerCase())>=0;
            turno.textContent='';
            celebrarIntento(acerto?'Wow! '+p.en+'! Great!':'Great try!');
          }); }}}));
      }
      acciones.appendChild(el('button',{clase:'btng primario',html:'<span aria-hidden="true">👏</span> <span lang="en">I said it!</span>',on:{click:function(){ celebrarIntento('Great!'); }}}));
      zona.appendChild(acciones);
      verPalabra(p);
      // Escucha → pausa "Your turn!" → la niña repite si quiere (nunca se exige).
      hablarEN(p.en,{lento:true,fin:function(){ hablarEN(p.en,{encolar:true,fin:function(){ turno.textContent='Your turn!'; hablarEN('Your turn!',{encolar:true}); if(personajeActual) animarPersonaje(personajeActual,'senala'); }}); }});
      var listo=false;
      function celebrarIntento(frase){
        if(listo) return; listo=true; detenerEscucha();
        sonidoBien(); reaccionPersonaje(true); hablarEN(frase); desbloquear('en_repetir');
        encenderEstrella(est,k); k++;
        setTimeout(function(){ k<lista.length? paso() : fin(); },1600);
      }
    }
    function fin(){
      app.innerHTML='';
      app.appendChild(pantallaFiesta({pj:'ollie',titulo:'You did it!',decir:'You did it! ¡Repetiste muy bien!',estrellas:lista.length,
        botones:[{ico:'🔁',t:'Again',go:function(){ enRepite(); }},{ico:'🎵',t:'Chants',go:function(){ enCantos(); }},{ico:'🦉',t:'English World',go:function(){ mundoIngles(); }}]}));
    }
    paso();
  }
  /* Rimas para repetir (cancionesEco). */
  function enCantos(){
    cabEn('Chants',enRepite); marcarActividad('English: Chants');
    var box=el('div',{clase:'actividades'});
    (ENGLISH.cancionesEco||[]).forEach(function(c,i){
      box.appendChild(tarjetaActividad({ico:c.ico||'🎵',t:c.titulo||('Chant '+(i+1)),go:function(){ enCanto(c); }},i));
    });
    app.appendChild(box);
  }
  function enCanto(c){
    cabEn(c.titulo||'Chant',enCantos);
    var i=0, caja=el('div',{clase:'en-cuento'}); app.appendChild(caja);
    function linea(){
      var l=c.lineas[i]; caja.innerHTML='';
      caja.appendChild(el('p',{clase:'en-frase',texto:l.en,attrs:{lang:'en'}}));
      if(progIngles.soporte==='es') caja.appendChild(el('p',{clase:'en-apoyo',texto:l.es}));
      hablarEN(l.en,{fin:function(){ setTimeout(function(){ hablarEN(l.en,{encolar:true,lento:true}); },1200); }});
    }
    app.appendChild(el('div',{clase:'en-acciones'},[
      el('button',{clase:'btng',html:'<span aria-hidden="true">🔊</span>',attrs:{'aria-label':'Repetir'},on:{click:function(){ linea(); }}}),
      el('button',{clase:'btng primario',html:'<span aria-hidden="true">›</span>',attrs:{'aria-label':'Siguiente'},on:{click:function(){ i++; if(i>=c.lineas.length){ app.innerHTML=''; app.appendChild(pantallaFiesta({pj:'ollie',titulo:'Yay!',decir:'Yay! Good singing!',botones:[{ico:'🔁',t:'Again',go:function(){enCanto(c);}},{ico:'🎵',t:'Chants',go:enCantos}]})); return; } linea(); }}})
    ]));
    linea();
  }

  /* ---------- F. ANIMAL SOUNDS ---------- */
  function enAnimales(){
    cabEn('Animal Sounds',mundoIngles); marcarActividad('English: Animal Sounds');
    var cat=ENGLISH.categorias.filter(function(c){return c.id==='animals';})[0];
    var grid=el('div',{clase:'rejilla'});
    cat.palabras.forEach(function(p){
      var c=nuevaCard(); c.innerHTML=ilustracion(p)+'<div class="name" lang="en"></div>';
      c.querySelector('.name').textContent=p.en;
      c.addEventListener('click',function(e){ fx(c,null,e); verPalabra(p);
        hablarEN(p.en,{fin:function(){ hablarEN(p.ej||p.en,{encolar:true,fin:function(){ if(progIngles.soporte==='es'&&p.ejEs) hablar(p.ejEs,'es',{encolar:true}); }}); }}); });
      grid.appendChild(c);
    });
    app.appendChild(grid);
    app.appendChild(el('button',{clase:'btng primario centro',html:'<span aria-hidden="true">🎧</span> <span lang="en">Play</span>',on:{click:function(){ enEscucha(function(p){return p.cat==='animals';},enAnimales); }}}));
    _setTimeout(function(){ hablarEN('Touch an animal!'); },300);
  }

  /* ---------- G. LITTLE STORIES ---------- */
  function enCuentos(){
    cabEn('Little Stories',mundoIngles); marcarActividad('English: Stories');
    var box=el('div',{clase:'actividades'});
    ENGLISH.historias.forEach(function(h,i){
      var b=tarjetaActividad({ico:h.ico,t:h.tituloEn,hecho:!!progIngles.historias[h.id],go:function(){ enCuento(h); }},i);
      b.querySelector('.act-t').setAttribute('lang','en'); b.appendChild(el('span',{clase:'act-es',texto:h.titulo}));
      box.appendChild(b);
    });
    var cantos=tarjetaActividad({ico:'🎵',t:'Chants',go:function(){ enCantos(); }},ENGLISH.historias.length);
    cantos.appendChild(el('span',{clase:'act-es',texto:'Rimas para repetir'})); box.appendChild(cantos);
    app.appendChild(box);
  }
  function enCuento(h){
    cabEn(h.tituloEn,enCuentos);
    var i=0, caja=el('div',{clase:'en-cuento'});
    var puntos=el('div',{clase:'en-puntos',attrs:{'aria-hidden':'true'}}); h.paginas.forEach(function(){ puntos.appendChild(el('i')); });
    app.appendChild(caja); app.appendChild(puntos);
    var ant=el('button',{clase:'flecha-btn',attrs:{'aria-label':'Página anterior'},html:'<span aria-hidden="true">‹</span>'});
    var rep=el('button',{clase:'btng',attrs:{'aria-label':'Leer otra vez'},html:'<span aria-hidden="true">🔊</span>'});
    var sig=el('button',{clase:'flecha-btn',attrs:{'aria-label':'Página siguiente'},html:'<span aria-hidden="true">›</span>'});
    app.appendChild(el('div',{clase:'en-acciones'},[ant,rep,sig]));
    function pagina(dir){
      var pg=h.paginas[i]; caja.innerHTML='';
      var ilu=el('div',{clase:'en-cuento-ilu',texto:pg.e,attrs:{'aria-hidden':'true'}}); caja.appendChild(ilu);
      caja.appendChild(el('p',{clase:'en-frase',texto:pg.en,attrs:{lang:'en'}}));
      if(progIngles.soporte==='es') caja.appendChild(el('p',{clase:'en-apoyo',texto:pg.es}));
      caja.classList.remove('entra-d','entra-i'); void caja.offsetWidth; caja.classList.add(dir<0?'entra-i':'entra-d');
      Array.prototype.forEach.call(puntos.children,function(x,k){ x.className=k===i?'on':''; });
      leer();
    }
    function leer(){ var pg=h.paginas[i]; hablarEN(pg.en,{fin:function(){ if(progIngles.soporte==='es') hablar(pg.es,'es',{encolar:true}); }}); }
    rep.addEventListener('click',leer);
    ant.addEventListener('click',function(){ if(i>0){ i--; sonidoFlip(); pagina(-1); } });
    sig.addEventListener('click',function(){
      if(i<h.paginas.length-1){ i++; sonidoFlip(); pagina(1); return; }
      progIngles.historias[h.id]=true; guardarIngles(); desbloquear('en_historia');
      app.innerHTML=''; app.appendChild(pantallaFiesta({pj:'ollie',titulo:'The end!',decir:'The end! ¡Fin del cuento!',
        botones:[{ico:'🔁',t:'Again',go:function(){ enCuento(h); }},{ico:'📗',t:'Stories',go:enCuentos}]}));
    });
    pagina(1);
  }

  /* ---------- H. MY ENGLISH COLLECTION ---------- */
  function enColeccion(){
    cabEn('My Collection',mundoIngles); marcarActividad('English: Collection');
    app.appendChild(barraProgreso(fraccionIngles(),'var(--mar)','Palabras en inglés'));
    var vistas=palabrasInglesVistas();
    var grid=el('div',{clase:'stickergrid en-col'});
    vistas.forEach(function(p){
      var w=progIngles.palabras[p.id];
      var b=el('button',{clase:'sticker'+(w.c>=3?' brillo':''),attrs:{'aria-label':p.en}});
      b.innerHTML=ilustracion(p)+'<span class="snombre" lang="en"></span>'; b.querySelector('.snombre').textContent=p.en;
      b.addEventListener('click',function(){ animarTap(b,'rebota',400); hablarEN(p.en); });
      grid.appendChild(b);
    });
    var faltan=Math.min(ENGLISH_TODAS.length-vistas.length,Math.max(4,12-vistas.length));
    for(var k=0;k<faltan;k++) grid.appendChild(el('div',{clase:'sticker bloqueado',attrs:{'aria-hidden':'true'},html:'<span class="semoji">?</span>'}));
    app.appendChild(grid);
    _setTimeout(function(){ hablarEN(vistas.length?'Your words!':'Let\'s find new words!'); },300);
  }
