  /* =====================================================================
     INICIO Y MUNDOS
     Cuatro mundos grandes: Descubrir · Jugar · Crear · English World.
     ===================================================================== */

  /* Catálogo de juegos. 'nivel': en qué dificultad aparece
     ('normal' = visible en fácil y normal; 'reto' = solo con dificultad "reto",
     según la evaluación pedagógica para 3 años). Ningún juego se eliminó. */
  var JUEGOS=[
    {id:'mapa',ico:'🗺️',t:'Camino de retos',go:function(){mapa();},stat:null,nivel:'normal'},
    {id:'sonidos',ico:'🐾',t:'Busca el animal',go:function(){sonidos();},stat:'sonidos',nivel:'normal'},
    {id:'memoria',ico:'🃏',t:'Memoria',go:function(){memoria();},stat:'memoria',nivel:'normal'},
    {id:'contar',ico:'🍎',t:'Contar',go:function(){contar();},stat:'contar',nivel:'normal'},
    {id:'encaja',ico:'🔷',t:'Encaja la forma',go:function(){encajaFormas();},stat:'encaja',nivel:'normal'},
    {id:'burbujas',ico:'🫧',t:'Burbujas',go:function(){burbujas();},stat:'burbujas',nivel:'normal'},
    {id:'musica',ico:'🎵',t:'Música',go:function(){musica();},stat:'musica',nivel:'normal'},
    {id:'rompecabezas',ico:'🧩',t:'Rompecabezas',go:function(){rompecabezas();},stat:'rompecabezas',nivel:'normal'},
    {id:'clasifica',ico:'🧺',t:'¿Dónde va?',go:function(){clasifica();},stat:'clasifica',nivel:'normal'},
    {id:'situaciones',ico:'😊',t:'¿Cómo se siente?',go:function(){situaciones();},stat:'emosit',nivel:'normal'},
    {id:'historia',ico:'📖',t:'Ordena la historia',go:function(){historia();},stat:'historia',nivel:'normal'},
    {id:'patrones',ico:'🔮',t:'¿Qué sigue?',go:function(){patrones();},stat:'patrones',nivel:'reto'},
    {id:'igualdif',ico:'🔍',t:'Igual o diferente',go:function(){igualdif();},stat:'igualdif',nivel:'reto'},
    {id:'instrucciones',ico:'👂',t:'Sigue la instrucción',go:function(){instrucciones();},stat:'instrucciones',nivel:'reto'}
  ];
  function juegosVisibles(){ return JUEGOS.filter(function(j){ return j.nivel!=='reto' || configPerfil.dificultad==='reto'; }); }
  function vecesJugado(j){ if(!j.stat||!stats[j.stat]) return 0; return stats[j.stat].ok+stats[j.stat].mal; }

  /* Tarjeta de actividad: icono grande + nombre corto. El nombre se dice al tocar. */
  function tarjetaActividad(o,i){
    var b=el('button',{clase:'act stagger'+(o.destacada?' destacada':''),attrs:{'aria-label':o.t}});
    b.style.animationDelay=((i||0)*35)+'ms';
    b.innerHTML='<span class="act-ico" aria-hidden="true">'+o.ico+'</span><span class="act-t"></span>';
    b.querySelector('.act-t').textContent=o.t;
    if(o.frac!=null) b.appendChild(barraProgreso(o.frac,o.color,'Avance en '+o.t));
    if(o.hecho) b.appendChild(el('span',{clase:'act-sello',attrs:{'aria-label':'Completado'},texto:'⭐'}));
    b.addEventListener('click',function(){ sonidoTap(); hablar(o.say||o.t); o.go(); });
    return b;
  }
  function cabeceraMundo(t,sub,ilu,quien){
    var c=el('header',{clase:'mundo-cab'});
    var txt=el('div',{clase:'mc-txt'},[el('h1',{texto:t})]);
    if(sub) txt.appendChild(el('p',{texto:sub}));
    c.appendChild(txt);
    if(quien){ var pj=personaje(quien,'feliz',96); pj.classList.add('mc-pj'); c.appendChild(pj); personajeActual=pj.querySelector('svg'); _setTimeout(function(){ animarPersonaje(personajeActual,'saluda'); },300); }
    else if(ilu){ c.appendChild(el('div',{clase:'mc-ilu',html:ilu})); }
    app.appendChild(c); return c;
  }
  /* "¿Y ahora?": al terminar, 3 sugerencias sin volver al menú. */
  function sugerenciasDespues(excluirId){
    var w=el('div',{clase:'sigue'});
    w.appendChild(el('h3',{texto:'¿Y ahora?'}));
    var g=el('div',{clase:'actividades mini'});
    shuffle(juegosVisibles().filter(function(j){return j.id!==excluirId && j.id!=='mapa';})).slice(0,3).forEach(function(j,i){
      g.appendChild(tarjetaActividad({ico:j.ico,t:j.t,go:j.go},i));
    });
    w.appendChild(g); return w;
  }
  /* Recomendación del día: lo que necesita refuerzo o lo menos explorado. */
  function recomendacionHoy(){
    var refuerzo=palabrasPorReforzar(1)[0];
    var nv=nivelActual();
    var opciones=[];
    if(nv>=0) opciones.push({ico:NIVELES[nv].ico,t:'Camino de retos',say:'Sigamos el camino de retos',go:function(){ nivel(nv); }});
    var cats=categorias.map(function(c){var n=explorado[c.id]?Object.keys(explorado[c.id]).length:0; return {c:c,f:n/(TOTALES[c.id]||1),r:Math.random()};})
      .filter(function(x){return x.f<1;}).sort(function(a,b){return (a.f-b.f)||(a.r-b.r);});
    if(cats.length){ var c=cats[0].c; opciones.push({ico:c.ico,t:c.txt,say:'Descubramos '+c.txt,go:function(){categoria(c.id);}}); }
    if(refuerzo) opciones.push({ico:refuerzo.e,t:'English World',say:'Vamos a English World',go:function(){ mundoIngles(); }});
    var js=juegosVisibles().filter(function(j){return j.id!=='mapa';}).map(function(j){return {j:j,v:vecesJugado(j),r:Math.random()};}).sort(function(a,b){return (a.v-b.v)||(a.r-b.r);});
    if(js.length) opciones.push({ico:js[0].j.ico,t:js[0].j.t,go:js[0].j.go});
    // Rota la sugerencia según el día para que no sea siempre la misma.
    return opciones.length? opciones[new Date().getDate()%opciones.length] : null;
  }

  var MUNDOS=[
    {k:'descubrir',t:'Descubrir',ico:'🔎',color:'var(--cielo)',go:function(){mundoDescubrir();}},
    {k:'jugar',t:'Jugar',ico:'⭐',color:'var(--sol)',go:function(){mundoJugar();}},
    {k:'crear',t:'Crear',ico:'🖍️',color:'var(--coral)',go:function(){mundoCrear();}},
    {k:'ingles',t:'English',ico:'🦉',color:'var(--mar)',go:function(){mundoIngles();}}
  ];
  function fraccionMundo(k){
    if(k==='descubrir') return totalExplorable()?totalExplorado()/totalExplorable():0;
    if(k==='jugar') return nivelesVisibles().length? hechosVisibles()/nivelesVisibles().length : 0;
    if(k==='crear') return Math.min(1,cargarGaleria().length/10);
    if(k==='ingles') return fraccionIngles();
    return 0;
  }

  /* ---------- INICIO ---------- */
  function inicio(saludar){
    pantallaBase(null,{mundo:'inicio',barra:true});
    var actual=perfilActivo();
    var nombre=actual?actual.nombre:'Lucía';
    var home=el('div',{clase:'home'});
    var cab=el('div',{clase:'home-cab stagger'});
    var pj=personaje('lucia','feliz',120); cab.appendChild(pj);
    personajeActual=pj.querySelector('svg');
    var saludo=el('div',{clase:'home-saludo'});
    saludo.appendChild(el('h1',{texto:'¡Hola, '+nombre+'!'}));
    saludo.appendChild(el('div',{clase:'globo',texto:'¿A dónde vamos hoy?'}));
    cab.appendChild(saludo);
    pj.querySelector('svg').addEventListener('click',function(){ hablar('¡Hola, '+nombre+'! ¿A dónde vamos hoy?'); });
    home.appendChild(cab);
    var box=el('div',{clase:'mundos'});
    MUNDOS.forEach(function(m,i){
      var b=el('button',{clase:'mundo stagger mundo-'+m.k,attrs:{'aria-label':m.t}});
      b.style.animationDelay=(80+i*60)+'ms';
      b.innerHTML='<span class="m-ilu" aria-hidden="true">'+ILU[m.k]+'</span><span class="m-pie"><span class="m-t"></span></span>';
      b.querySelector('.m-t').textContent=m.t;
      b.querySelector('.m-pie').appendChild(barraProgreso(fraccionMundo(m.k),m.color,'Avance en '+m.t));
      b.addEventListener('click',function(){ sonidoTap(); hablar(m.k==='ingles'?'English World':m.t,m.k==='ingles'?'en':'es'); m.go(); });
      box.appendChild(b);
    });
    home.appendChild(box);
    var fila=el('div',{clase:'home-fila stagger'}); fila.style.animationDelay='320ms';
    var rec=recomendacionHoy();
    if(rec){
      var r=el('button',{clase:'hoy-card',attrs:{'aria-label':'Para ti hoy: '+rec.t}});
      r.innerHTML='<span class="he" aria-hidden="true">'+rec.ico+'</span><span class="hoy-txt"><small>Para ti hoy</small><b></b></span>';
      r.querySelector('b').textContent=rec.t;
      r.addEventListener('click',function(){ sonidoTap(); hablar(rec.say||rec.t); rec.go(); });
      fila.appendChild(r);
    }
    var col=el('button',{clase:'coleccion-card',attrs:{'aria-label':'Mi colección'},html:ILU.coleccion+'<b>Mi colección</b>'});
    col.addEventListener('click',function(){ sonidoTap(); hablar('Mi colección'); album(); });
    fila.appendChild(col);
    home.appendChild(fila);
    home.appendChild(el('div',{clase:'home-pie'},[
      el('button',{clase:'link-adulto',html:'<span aria-hidden="true">🔒</span> Para papás',attrs:{'aria-label':'Para papás (requiere PIN)'},on:{click:function(){ puertaPadres(function(){ reportePapa(); }); }}})
    ]));
    app.appendChild(home);
    _setTimeout(function(){ animarPersonaje(personajeActual,saludar?'gira':'saluda'); },350);
    if(saludar){ _setTimeout(function(){ hablar('¡Hola, '+nombre+'! ¿A dónde vamos hoy?'); },500); }
  }

  function mundoDescubrir(){ aprender(); }

  function mundoJugar(){
    pantallaBase(function(){inicio();},{mundo:'jugar',barra:true});
    cabeceraMundo('Jugar',null,null,'lucia');
    var box=el('div',{clase:'actividades'});
    juegosVisibles().forEach(function(j,i){
      var o={ico:j.ico,t:j.t,go:j.go};
      if(j.id==='mapa'){ o.destacada=true; o.frac=nivelesVisibles().length?hechosVisibles()/nivelesVisibles().length:0; o.color='var(--sol)'; }
      box.appendChild(tarjetaActividad(o,i));
    });
    app.appendChild(box);
    _setTimeout(function(){ hablar('¿A qué jugamos?'); },350);
  }

  function mundoCrear(){
    pantallaBase(function(){inicio();},{mundo:'crear',barra:true});
    cabeceraMundo('Crear',null,null,'cami');
    var box=el('div',{clase:'actividades tres'});
    [
      {ico:'🎨',t:'Pintar',go:function(){pintar();}},
      {ico:'🖍️',t:'Colorear',go:function(){pintar('colorear');}},
      {ico:'🙂',t:'Dibuja conmigo',go:function(){pintar('crear');}},
      {ico:'✍️',t:'Trazar',go:function(){trazar();}},
      {ico:'🖼️',t:'Mi exposición',go:function(){exposicion();},frac:Math.min(1,cargarGaleria().length/10),color:'var(--coral)'}
    ].forEach(function(o,i){ box.appendChild(tarjetaActividad(o,i)); });
    app.appendChild(box);
    _setTimeout(function(){ hablar('¿Qué creamos hoy?'); },350);
  }
