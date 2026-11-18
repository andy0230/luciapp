  /* ---------- POOLS DEL JUEGO ---------- */
  function emojiPool(pref,lista,sayFn){ return lista.map(function(o,i){return {id:pref+i,nombre:art(o.name),html:'<div class="opt-big">'+o.e+'</div>',prompt:(pref==='emo'?('¿Quién está '+o.name+'?'):('Busca '+art(o.name))),say:sayFn?sayFn(o):('busca '+art(o.name))};}); }
  function opcionesPool(tipo){
    if(tipo==='color') return colores.slice(0,configPerfil.dificultad==='reto'?colores.length:8).map(function(o,i){return {id:'color'+i,html:'<div class="opt-swatch" style="background:'+o.hex+'"></div>',nombre:'el '+o.name,prompt:'Busca el color: '+o.name,say:'busca el color '+o.name};});
    if(tipo==='fruta') return emojiPool('fruta',frutas);
    if(tipo==='animal')return emojiPool('animal',animales);
    if(tipo==='transporte')return emojiPool('trans',transporte);
    if(tipo==='comida')return emojiPool('comida',comida);
    if(tipo==='cuerpo')return emojiPool('cuerpo',cuerpo);
    if(tipo==='vocal') return vocales.map(function(o,i){return {id:'vocal'+i,nombre:'la '+o.l,html:'<div class="opt-letter">'+o.l+'</div>',prompt:'Busca la letra: '+o.l,say:'busca la letra '+o.l};});
    if(tipo==='numero')return numeros.slice(0,configPerfil.dificultad==='reto'?10:5).map(function(o,i){return {id:'numero'+i,nombre:'el '+o.say,html:'<div class="opt-letter">'+o.n+'</div>',prompt:'Busca el número: '+o.say,say:'busca el número '+o.say};});
    if(tipo==='numero20')return numeros.map(function(o,i){return {id:'num20_'+i,nombre:'el '+o.say,html:'<div class="opt-letter">'+o.n+'</div>',prompt:'Busca el número: '+o.say,say:'busca el número '+o.say};});
    if(tipo==='forma') return formas.map(function(o,i){return {id:'forma'+i,nombre:art(o.name),html:formaHtml(o),prompt:'Busca: '+o.name,say:'busca '+o.name};});
    if(tipo==='emocion')return emojiPool('emo',emociones,function(o){return 'busca quién está '+o.name;});
    return [];
  }
  var TIPOS=['color','fruta','animal','vocal','numero','forma','transporte','comida','cuerpo','emocion','numero20'];
  var TODAS=null;
  function todasOpciones(){ var r=[]; TIPOS.forEach(function(t){ if(t==='numero20' && configPerfil.dificultad!=='reto') return; if(t==='vocal' && configPerfil.dificultad==='facil') return; r=r.concat(opcionesPool(t)); }); return r; }
  function armarRonda(conf){
    var tiposOk=TIPOS.filter(function(x){return x!=='numero20'||configPerfil.dificultad==='reto';}); var tt=conf.tipo==='mezcla'?tiposOk[rnd(tiposOk.length)]:conf.tipo;
    var tp=opcionesPool(tt); var target=tp[rnd(tp.length)];
    var universo=conf.mixto?todasOpciones():tp;
    var resto=universo.filter(function(o){return o.id!==target.id;}); shuffle(resto);
    var lista=[target]; for(var i=0;i<conf.ops-1 && i<resto.length;i++) lista.push(resto[i]);
    shuffle(lista); return {lista:lista,target:target};
  }

  /* ---------- CAMINO DE RETOS ----------
     Un camino visual (no una cuadrícula de 30 casillas). Los niveles ganados se pueden
     repetir; el actual late; los futuros se ven como siluetas sin candado ni regaño. */
  var COLS_NIVEL=['var(--cielo-c)','var(--sol-c)','var(--coral-c)','var(--pasto-c)','var(--uva-c)'];
  function mapa(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('Camino de retos');
    var vis=nivelesVisibles(), actual=nivelActual();
    var cab=el('div',{clase:'cat-cab'});
    cab.appendChild(el('h1',{clase:'titulo',texto:'Camino de retos'}));
    cab.appendChild(barraProgreso(hechosVisibles()/vis.length,'var(--sol)','Camino recorrido'));
    cab.appendChild(acompanante('lucia'));
    app.appendChild(cab);
    var m=el('ol',{clase:'camino'}), actualBtn=null;
    vis.forEach(function(idx,i){
      var nv=NIVELES[idx], hecho=!!nivelesHechos[idx], esActual=idx===actual;
      var futuro=!hecho && !esActual;
      var li=el('li',{clase:'paso '+(i%2?'der':'izq')});
      var b=el('button',{clase:'nivelbtn stagger'+(hecho?' hecho':'')+(esActual?' actual':'')+(futuro?' bloq':''),
        attrs:{'aria-label':nv.t+(hecho?' (ganado)':esActual?' (siguiente)':' (más adelante)')}});
      b.style.animationDelay=Math.min(i*30,450)+'ms';
      b.innerHTML='<span class="circ" aria-hidden="true" style="background:'+COLS_NIVEL[i%COLS_NIVEL.length]+'">'+nv.ico+'</span>'+(hecho?'<span class="estado" aria-hidden="true">⭐</span>':'');
      if(esActual) actualBtn=b;
      b.addEventListener('click',function(){
        if(futuro){ hablar('Ese viene después. ¡Sigamos por aquí!'); if(actualBtn){ animarTap(actualBtn,'rebota',500); } animarPersonaje(personajeActual,'senala'); return; }
        sonidoTap(); hablar(nv.t); nivel(idx);
      });
      li.appendChild(b); m.appendChild(li);
    });
    app.appendChild(m);
    if(actual<0) app.appendChild(el('p',{clase:'subtitulo',texto:'¡Recorriste todo el camino! Puedes repetir el que quieras.'}));
    if(actualBtn){ setTimeout(function(){ try{ actualBtn.scrollIntoView({block:'center',behavior:reduce()?'auto':'smooth'}); }catch(e){} },350); }
    _setTimeout(function(){ hablar(actual>=0?'Toca la estrella que salta para jugar':'¡Recorriste todo el camino!'); },400);
  }

  /* ---------- NIVEL (sin castigo: sin vidas ni "game over") ---------- */
  function nivel(idx){
    pantallaBase(mapa,{mundo:'jugar'});
    var conf=confNivel(idx), aciertos=0, bloqueado=false;
    var pj=acompanante('lucia');
    mostrar();
    function mostrar(){
      bloqueado=false; app.innerHTML=''; app.scrollTop=0;
      var r=armarRonda(conf);
      var cab=el('div',{clase:'juego-cab'});
      cab.appendChild(botonEscuchar(conf.soloVoz?'Escucha y busca':r.target.prompt,r.target.say));
      cab.appendChild(pj);
      app.appendChild(cab);
      var prog=filaEstrellas(conf.rondas,aciertos); app.appendChild(prog);
      var grid=el('div',{clase:'opciones n'+r.lista.length}), cartas=[], fallos=0;
      r.lista.forEach(function(o){var c=nuevaCard();c.innerHTML=o.html;c.setAttribute('aria-label',o.nombre||'opción');cartas.push({c:c,o:o});
        c.addEventListener('click',function(e){
          if(bloqueado)return;
          if(o.id===r.target.id){ bloqueado=true;c.classList.add('bien');sonidoBien();fx(c,elogio(),e);aciertos++;
            registrarStat(prefijoDe(r.target.id),true); encenderEstrella(prog,aciertos-1);
            setTimeout(function(){ aciertos<conf.rondas ? mostrar() : completar(); },1250);
          }else{
            fallos++; c.classList.remove('mal');void c.offsetWidth;c.classList.add('mal');c.classList.add('apagada');
            sonidoMal(); registrarStat(prefijoDe(r.target.id),false);
            if(fallos>=2){ cartas.forEach(function(x){ if(x.o.id===r.target.id) x.c.classList.add('pista'); }); hablar('Ese es '+(o.nombre||'otro')+'. Mira, es este'); }
            else hablar('Ese es '+(o.nombre||'otro')+'. ¡Intenta otra vez!');
          }
        });
        grid.appendChild(c);});
      app.appendChild(grid);
      setTimeout(function(){hablar(r.target.say);},250);
      recordarSiInactivo(function(){ hablar(r.target.say); });
    }
    function completar(){
      var nuevo=!nivelesHechos[idx];
      if(nuevo){ nivelesHechos[idx]=true; guardarProg();
        if([3,6,9,12,15,18,21,24,27,30].indexOf(completados)>=0) desbloquear('niv_'+completados);
      }
      var sig=nivelActual();
      app.innerHTML='';app.scrollTop=0;
      var botones=[];
      if(sig>=0 && sig!==idx) botones.push({ico:'➜',t:'Siguiente',decir:'¡Vamos!',go:function(){nivel(sig);}});
      botones.push({ico:'🔁',t:'Otra vez',decir:'¡Otra vez!',go:function(){nivel(idx);}});
      botones.push({ico:'🗺️',t:'Camino',go:function(){mapa();}});
      app.appendChild(pantallaFiesta({titulo:'¡Lo lograste!',decir:'¡Lo lograste! Escuchaste y buscaste muy bien.',estrellas:conf.rondas,botones:botones,sugerir:'mapa'}));
    }
  }
  /* Elogios que celebran el esfuerzo (variados, nunca "eres inteligente"). */
  var ELOGIOS=['¡Lo encontraste!','¡Sí, ese es!','¡Escuchaste muy bien!','¡Bien mirado!','¡Eso es!','¡Lo hiciste!'];
  function elogio(){ return ELOGIOS[rnd(ELOGIOS.length)]; }
