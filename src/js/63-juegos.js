  /* ---------- CONTAR (correspondencia uno a uno: cada cosa que toca se cuenta en voz alta) ---------- */
  function contar(){
    pantallaBase(mundoJugar,{mundo:'jugar'});
    marcarActividad('Contar');
    var aciertos=0, racha=0, bloqueado=false;
    var emojis=['🍎','🐶','⭐','🍓','🐟','🎈','🦋','🌸','🚗','🐥','🍌','🐞','🧸','🍪'];
    ronda();
    function ronda(){
      bloqueado=false; app.innerHTML=''; app.scrollTop=0;
      titulo('¿Cuántos hay?');
      var nMax = configPerfil.dificultad==='reto' ? (aciertos<4?3:(aciertos<9?5:(aciertos<15?7:10))) : (aciertos<4||configPerfil.dificultad==='facil' ? 3 : 5);
      var n = 1+rnd(nMax);
      var emo = emojis[rnd(emojis.length)];
      var pr=document.createElement('button');pr.type='button';pr.className='prompt';pr.innerHTML='<span class="sp">🔊</span><span>Toca cada uno y cuenta</span>';
      pr.addEventListener('click',function(){hablar('¿Cuántos hay? Toca cada uno y cuenta');animarIconoSonido(pr.querySelector('.sp'));});
      var est=document.createElement('div');est.className='estrellas';
      for(var k=0;k<5;k++){var st=document.createElement('i');if(k<racha)st.className='on';est.appendChild(st);}
      var caja=document.createElement('div');caja.className='conteo';
      var contados=0;
      for(var i=0;i<n;i++){ var sp=document.createElement('span'); sp.textContent=emo; caja.appendChild(sp); }
      var spans=Array.prototype.slice.call(caja.querySelectorAll('span'));
      spans.forEach(function(sp){
        sp.addEventListener('click',function(){
          animarTap(sp,'rebota',400); sonidoTap();
          if(sp.classList.contains('contado') || bloqueado) return;
          contados++; sp.classList.add('contado');
          var nro=document.createElement('b');nro.className='nro';nro.textContent=contados;sp.appendChild(nro);
          hablar(palabras[contados]);
        });
      });
      app.appendChild(pr);app.appendChild(est);app.appendChild(caja);
      var ops = configPerfil.dificultad==='reto'&&nMax>3?4:3;
      var set=[n], cand=[n-1,n+1,n-2,n+2,n+3]; shuffle(cand);
      for(var c=0;c<cand.length && set.length<ops;c++){var v=cand[c]; if(v>=1 && v<=nMax+2 && set.indexOf(v)<0) set.push(v);}
      while(set.length<ops){var ex=1+rnd(nMax+2); if(set.indexOf(ex)<0) set.push(ex);}
      shuffle(set);
      var grid=document.createElement('div');grid.className='opciones';
      var botones=[];
      set.forEach(function(v){var b=nuevaCard();b.innerHTML='<div class="opt-letter">'+v+'</div>';botones.push({b:b,v:v});
        b.addEventListener('click',function(e){ if(bloqueado && !b.classList.contains('pista'))return;
          if(v===n){
            bloqueado=true; b.classList.remove('pista'); b.classList.add('bien');sonidoBien();fx(b,'¡Sí! Hay '+palabras[n],e);
            if(!b.dataset.ayuda){ aciertos++; racha++; registrarStat('contar',true); }
            var s=est.children[racha-1]; if(s){s.className='on';}
            if(racha>=5){ racha=0; desbloquear('contar_win'); setTimeout(function(){ finJuego('contar',ronda,'¡Contaste muy bien!'); },900); }
            else setTimeout(ronda,1300);
          } else {
            bloqueado=true; b.classList.remove('mal');void b.offsetWidth;b.classList.add('mal');sonidoMal();registrarStat('contar',false);
            racha=0; Array.prototype.forEach.call(est.children,function(x){x.className='';});
            hablar('Casi. Contemos juntos');
            spans.forEach(function(sp){ sp.classList.remove('contado'); var x=sp.querySelector('.nro'); if(x)x.remove(); });
            setTimeout(function(){ contarJuntos(function(){
              hablar('¡Hay '+palabras[n]+'! Toca el '+palabras[n]);
              botones.forEach(function(x){ if(x.v===n){ x.b.dataset.ayuda='1'; x.b.classList.add('pista'); } else { x.b.style.opacity='.35'; } });
            }); },700);
          }
        });
        grid.appendChild(b);});
      app.appendChild(grid);
      setTimeout(function(){hablar('¿Cuántos hay? Toca cada uno y cuenta');},250);
      function contarJuntos(cb){
        var i=0;
        function paso(){ if(i>=n){ if(cb)cb(); return; }
          var sp=spans[i]; sp.classList.add('contado'); animarTap(sp,'rebota',400);
          var nro=document.createElement('b');nro.className='nro';nro.textContent=i+1;sp.appendChild(nro);
          hablar(palabras[i+1]); i++; setTimeout(paso,850);
        }
        paso();
      }
    }
  }

  /* ---------- SONIDOS (adivina el animal) ---------- */
  function sonidos(){
    pantallaBase(mundoJugar,{mundo:'jugar'});
    marcarActividad('Sonidos');
    var aciertos=0, bloqueado=false;
    ronda();
    function ronda(){
      bloqueado=false; app.innerHTML=''; app.scrollTop=0;
      titulo('¿Cuál animal es? 🔊');
      var objetivo=animales[rnd(animales.length)];
      var pr=document.createElement('div');pr.className='prompt';pr.innerHTML='<span class="sp">🔊</span><span>¿Cuál animal es?</span>';
      var iconoSon=pr.querySelector('.sp');
      pr.addEventListener('click',function(){reproducirSonidoAnimal(objetivo);animarIconoSonido(iconoSon);});
      app.appendChild(pr);
      var btnRep=document.createElement('button');btnRep.type='button';btnRep.className='toolp';btnRep.style.marginBottom='8px';
      btnRep.innerHTML='🔊 Escuchar otra vez';
      btnRep.addEventListener('click',function(){reproducirSonidoAnimal(objetivo);animarIconoSonido(iconoSon);});
      app.appendChild(btnRep);
      var sc=document.createElement('div');sc.className='progreso';sc.textContent='⭐ '+aciertos;
      app.appendChild(sc);
      var ops = (aciertos<5||configPerfil.dificultad==='facil')?3:4;
      var resto=shuffle(animales.filter(function(a){return a.e!==objetivo.e;}));
      var set=[objetivo]; for(var i=0;i<ops-1 && i<resto.length;i++) set.push(resto[i]);
      shuffle(set);
      var grid=document.createElement('div');grid.className='opciones';
      set.forEach(function(a){var b=nuevaCard();b.innerHTML='<div class="opt-big">'+a.e+'</div>';
        b.addEventListener('click',function(e){ if(bloqueado)return;
          if(a.e===objetivo.e){ bloqueado=true;b.classList.add('bien');sonidoBien();fx(b,'¡Sí! '+a.name,e);aciertos++;registrarStat('sonidos',true);
            if(aciertos>=10) desbloquear('sonidos_10');
            siguienteOFin('sonidos',aciertos,ronda,'¡Escuchaste a todos los animales!'); }
          else { b.classList.remove('mal');void b.offsetWidth;b.classList.add('mal');b.style.opacity='.45';b.style.pointerEvents='none';sonidoMal();registrarStat('sonidos',false);hablar('¡Casi! Escucha otra vez'); }
        });
        grid.appendChild(b);});
      app.appendChild(grid);
      setTimeout(function(){reproducirSonidoAnimal(objetivo);animarIconoSonido(iconoSon);},300);
    }
  }

  /* ---------- ¿QUÉ SIGUE? (patrones, con dificultad adaptativa) ---------- */
  var PATRON_TEMAS=[['🍎','🍌'],['🔵','🟡'],['🐶','🐱'],['🔴','🔵','🟢'],['⭐','🌙','☀️']];
  var PATRON_EXTRA=['🍓','🟣','🦋','🍇','🌈'];
  function generarPatron(fase){
    var simbolos = fase<=1 ? PATRON_TEMAS[fase%2] : PATRON_TEMAS[fase===2?2:(3+((fase-3)%2))];
    var n=simbolos.length, secuencia=[]; for(var i=0;i<4;i++) secuencia.push(simbolos[i%n]);
    var respuesta=simbolos[4%n]; var ops=fase<=1?2:3;
    var distractores=shuffle(simbolos.slice()).filter(function(s){return s!==respuesta;});
    var extra=shuffle(PATRON_EXTRA.slice());
    for(var k=0;k<extra.length && distractores.length<ops-1;k++){ if(distractores.indexOf(extra[k])<0) distractores.push(extra[k]); }
    var opciones=[respuesta].concat(distractores.slice(0,ops-1)); shuffle(opciones);
    return {secuencia:secuencia,respuesta:respuesta,opciones:opciones};
  }
  function patrones(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('¿Qué sigue?');
    cargarAdapt(); var bloqueado=false; ronda();
    function ronda(){
      bloqueado=false; app.innerHTML=''; app.scrollTop=0;
      titulo('¿Qué sigue? 🧩');
      var a=adapt.patrones||{n:0,racha:0}; adapt.patrones=a;
      var pat=generarPatron(configPerfil.dificultad==='reto'?Math.min(a.n,4):Math.min(a.n,1)); var acPat=(adapt.patrones&&adapt.patrones.aciertos)||0;
      var pr=document.createElement('div');pr.className='prompt';pr.style.fontSize='clamp(30px,8vw,44px)';
      pr.innerHTML=pat.secuencia.map(function(s){return '<span style="margin:0 6px">'+s+'</span>';}).join('')+'<span style="margin:0 6px">❓</span>';
      app.appendChild(pr);
      var sub=document.createElement('p');sub.className='subtitulo';sub.textContent='¿Qué sigue después?';
      app.appendChild(sub);
      var grid=document.createElement('div');grid.className='opciones';
      pat.opciones.forEach(function(o){var c=nuevaCard();c.innerHTML='<div class="opt-big">'+o+'</div>';
        c.addEventListener('click',function(e){ if(bloqueado)return;
          if(o===pat.respuesta){ bloqueado=true;c.classList.add('bien');sonidoBien();fx(c,'¡Sí! Lo encontraste',e);
            registrarStat('patrones',true); registrarAdaptativo('patrones',true,0,4); desbloquear('patrones_win');
            siguienteOFin('patrones',(adapt.patrones&&adapt.patrones.aciertos)||0,ronda,'¡Descubriste los patrones!');
          }else{ c.classList.remove('mal');void c.offsetWidth;c.classList.add('mal');sonidoMal();
            registrarStat('patrones',false); registrarAdaptativo('patrones',false,0,4);
            hablar('Mira otra vez, con calma'); setTimeout(function(){c.classList.remove('mal');},500);
          }
        });
        grid.appendChild(c);});
      app.appendChild(grid);
      setTimeout(function(){hablar('¿Qué sigue?');},300);
    }
  }

  /* ---------- ORDENA LA HISTORIA (guiada: solo entra la imagen que va en ese paso) ---------- */
  var SECUENCIAS=[
    {pasos:['🌱','🌸'],n:['una semillita','una flor']},{pasos:['🥚','🐣'],n:['un huevo','un pollito']},
    {pasos:['🐛','🦋'],n:['una oruga','una mariposa']},{pasos:['☔','🌈'],n:['la lluvia','el arcoíris']},
    {pasos:['🍞','🥪'],n:['el pan','un sándwich']},
    {pasos:['🌱','🌿','🌸'],n:['una semillita','una plantita','una flor']},{pasos:['🥚','🐣','🐥'],n:['un huevo','el pollito sale','un pollito']},
    {pasos:['🛏️','🪥','🎒'],n:['despertarse','cepillarse los dientes','ir al colegio']},
    {pasos:['🌧️','🌱','🌻'],n:['llueve','crece una plantita','sale un girasol']}
  ];
  function historia(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('Ordena la Historia');
    cargarAdapt(); ronda();
    function ronda(){
      app.innerHTML='';app.scrollTop=0;
      titulo('Ordena la historia');
      var a=adapt.historia||{n:0,racha:0}; adapt.historia=a;
      var longitud = (a.n<2||configPerfil.dificultad!=='reto')?2:3;
      var disponibles=SECUENCIAS.filter(function(s){return s.pasos.length===longitud;});
      var seq=disponibles[rnd(disponibles.length)];
      var orden=seq.pasos.slice(); var mezclado=shuffle(orden.map(function(e,i){return {e:e,i:i};}));
      var pos=0, errores=0;
      var sub=document.createElement('p');sub.className='subtitulo';sub.textContent='¿Qué pasa primero? Toca las imágenes en orden';
      app.appendChild(sub);
      var linea=document.createElement('div');linea.style.cssText='display:flex;gap:14px;justify-content:center;align-items:center;flex-wrap:wrap;margin-bottom:26px;';
      var slots=[];
      orden.forEach(function(e,s){
        if(s>0){ var fl=document.createElement('span');fl.className='flecha';fl.textContent='➜';linea.appendChild(fl); }
        var cs=document.createElement('div');cs.className='card';cs.style.cssText='cursor:default;width:clamp(130px,18vh,190px);background:var(--papel);border-style:dashed;box-shadow:none;';
        cs.innerHTML='<div class="opt-letter" style="color:var(--tinta3)">'+(s+1)+'</div>'; slots.push(cs); linea.appendChild(cs);
      });
      app.appendChild(linea);
      var grid=document.createElement('div');grid.className='opciones';
      mezclado.forEach(function(m){var c=nuevaCard();c.innerHTML='<div class="opt-big">'+m.e+'</div>';
        c.addEventListener('click',function(){
          if(c.dataset.usado) return;
          if(m.i===pos){
            c.dataset.usado='1'; c.style.opacity='.25'; c.style.pointerEvents='none';
            slots[pos].style.borderStyle='solid'; slots[pos].style.background='#fff'; slots[pos].style.boxShadow='var(--sombra)';
            slots[pos].innerHTML='<div class="opt-big">'+m.e+'</div>'; animarTap(slots[pos],'rebota',400); sonidoBien();
            hablar((pos===0?'Primero, ':(pos===orden.length-1?'Y al final, ':'Después, '))+seq.n[pos]);
            pos++;
            if(pos>=orden.length){
              var ok=errores===0;
              registrarStat('historia',ok); registrarAdaptativo('historia',ok,0,2);
              setTimeout(function(){ sonidoGane(); celebrar(10); desbloquear('historia_win');
                hablar('¡Muy bien! '+seq.n.map(function(x,i){return (i===0?'Primero ':(i===seq.n.length-1?'y al final ':'después '))+x;}).join(', '));
                setTimeout(ronda,3600);
              },900);
            }
          }else{
            errores++; c.classList.remove('mal');void c.offsetWidth;c.classList.add('mal');sonidoMal();
            hablar(pos===0?'Mmm, ¿qué pasa primero?':'¿Y qué pasa después?');
          }
        });
        grid.appendChild(c);
      });
      app.appendChild(grid);
      setTimeout(function(){hablar('¿Qué pasa primero?');},300);
    }
  }

  /* ---------- ARRASTRAR O TOCAR (para niños de 3 años: las dos formas sirven) ----------
     Cada pieza se puede arrastrar hasta su destino, o tocar la pieza y luego tocar el destino.
     Si el destino no es el correcto, la pieza vuelve suavemente a su lugar: no hay castigo. */
  function crearArrastre(cfg){
    var sel=null;
    function objetivos(){ return cfg.objetivos(); }
    function marcar(on){ objetivos().forEach(function(t){ t.classList.toggle('objetivo-tap',on); }); }
    function deseleccionar(){ if(sel) sel.classList.remove('sel'); sel=null; marcar(false); }
    function volver(p){ p.classList.add('volver'); p.style.transform=''; setTimeout(function(){p.classList.remove('volver');},400); }
    function intentar(p,t){ var ok=cfg.soltar(p,t); if(!ok) volver(p); }
    function objetivoEn(x,y){ var ts=objetivos(); for(var i=0;i<ts.length;i++){ var r=ts[i].getBoundingClientRect(); if(x>=r.left-10&&x<=r.right+10&&y>=r.top-10&&y<=r.bottom+10) return ts[i]; } return null; }
    function pieza(p){
      var ini=null, movido=false;
      p.addEventListener('pointerdown',function(e){ if(p.dataset.fijo) return; ini={x:e.clientX,y:e.clientY}; movido=false; try{p.setPointerCapture(e.pointerId);}catch(_){} });
      p.addEventListener('pointermove',function(e){ if(!ini) return; var dx=e.clientX-ini.x, dy=e.clientY-ini.y;
        if(!movido && Math.sqrt(dx*dx+dy*dy)>12){ movido=true; deseleccionar(); p.classList.add('arrastrando'); if(cfg.alTomar) cfg.alTomar(p); }
        if(movido){ e.preventDefault(); p.style.transform='translate('+dx+'px,'+dy+'px) scale(1.08)';
          var t=objetivoEn(e.clientX,e.clientY); objetivos().forEach(function(o){o.classList.toggle('objetivo-tap',o===t);}); }
      });
      p.addEventListener('pointerup',function(e){ if(!ini) return; ini=null; p.classList.remove('arrastrando');
        if(movido){ marcar(false); var t=objetivoEn(e.clientX,e.clientY); if(t) intentar(p,t); else volver(p); }
        else { if(sel===p){ deseleccionar(); } else { deseleccionar(); sel=p; p.classList.add('sel'); marcar(true); sonidoTap(); if(cfg.alTomar) cfg.alTomar(p); } }
      });
      p.addEventListener('pointercancel',function(){ ini=null; p.classList.remove('arrastrando'); marcar(false); volver(p); });
    }
    function objetivo(t){ t.addEventListener('click',function(){ if(!sel){ if(cfg.sinPieza) cfg.sinPieza(); return; } var p=sel; deseleccionar(); intentar(p,t); }); }
    return {pieza:pieza, objetivo:objetivo, deseleccionar:deseleccionar};
  }

  /* ---------- ¿DÓNDE VA? (clasificar: arrastrar o tocar) ---------- */
  var JUGUETES=[{e:'🧸',name:'oso de peluche'},{e:'⚽',name:'pelota'},{e:'🪁',name:'cometa'},{e:'🎲',name:'dados'},{e:'🚂',name:'trencito'}];
  var CLASIFICA_SETS=[
    {a:{ico:'🍓',nombre:'Frutas',items:frutas},b:{ico:'🐶',nombre:'Animales',items:animales}},
    {a:{ico:'🚗',nombre:'Vehículos',items:transporte},b:{ico:'🐶',nombre:'Animales',items:animales}},
    {a:{ico:'🍞',nombre:'Comida',items:comida},b:{ico:'🧸',nombre:'Juguetes',items:JUGUETES}}
  ];
  function clasifica(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('¿Dónde va?');
    ronda();
    function ronda(){
      app.innerHTML='';app.scrollTop=0;
      titulo('¿Dónde va?');
      var set=CLASIFICA_SETS[rnd(CLASIFICA_SETS.length)];
      var sub=document.createElement('p');sub.className='subtitulo';sub.textContent='Lleva cada cosa a su canasta (arrastra o toca)';
      app.appendChild(sub);
      var itemsA=shuffle(set.a.items.slice()).slice(0,configPerfil.dificultad==='reto'?3:2).map(function(o){return {e:o.e,name:o.name,grupo:'a'};});
      var itemsB=shuffle(set.b.items.slice()).slice(0,2).map(function(o){return {e:o.e,name:o.name,grupo:'b'};});
      var items=shuffle(itemsA.concat(itemsB)), colocados=0;
      var cestasEl=[];
      var arr=crearArrastre({
        objetivos:function(){return cestasEl;},
        alTomar:function(p){ hablar(art(p._it.name||'')); },
        sinPieza:function(){ hablar('Primero toca una cosa'); },
        soltar:function(p,t){
          var it=p._it;
          if(t.dataset.g===it.grupo){
            p.dataset.fijo='1'; p.style.transform=''; p.style.visibility='hidden';
            var mini=document.createElement('span');mini.textContent=it.e;mini.style.fontSize='34px';t.querySelector('.dentro').appendChild(mini);
            animarTap(t,'rebota',400); sonidoBien(); hablar('¡Sí! Va con '+(t.dataset.g==='a'?set.a.nombre:set.b.nombre).toLowerCase()); registrarStat('clasifica',true);
            colocados++;
            if(colocados>=items.length){ setTimeout(function(){ sonidoGane(); celebrar(10); hablar('¡Clasificaste todo, muy bien!'); desbloquear('clasifica_win'); setTimeout(ronda,2200); },700); }
            return true;
          }
          sonidoMal(); hablar('Casi. Ese va en la otra canasta'); registrarStat('clasifica',false); return false;
        }
      });
      var grid=document.createElement('div');grid.className='opciones';
      items.forEach(function(it){var c=nuevaCard();c.classList.add('pieza-card');c.style.touchAction='none';c.innerHTML='<div class="opt-big">'+it.e+'</div>';
        c._it=it; arr.pieza(c); grid.appendChild(c); });
      app.appendChild(grid);
      var cestas=document.createElement('div');cestas.className='opciones';cestas.style.marginTop='26px';cestas.style.gridTemplateColumns='repeat(2,minmax(0,340px))';
      [set.a,set.b].forEach(function(g,gi){var c=nuevaCard();c.classList.add('cesta');c.dataset.g=gi===0?'a':'b';c.style.minHeight='180px';
        c.innerHTML='<div class="big">'+g.ico+'</div><div class="name">'+g.nombre+'</div><div class="dentro" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;min-height:38px"></div>';
        arr.objetivo(c); cestasEl.push(c); cestas.appendChild(c);
      });
      app.appendChild(cestas);
      setTimeout(function(){hablar('¿Dónde va cada cosa?');},300);
    }
  }

  /* ---------- IGUAL O DIFERENTE ---------- */
  function igualdif(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('Igual o Diferente');
    cargarAdapt();
    var bancoFruta=frutas.map(function(o){return o.e;}), bancoAnimal=animales.map(function(o){return o.e;});
    var bancoTodo=bancoFruta.concat(bancoAnimal);
    var inicioRonda=Date.now();
    ronda();
    function ronda(){
      app.innerHTML='';app.scrollTop=0;
      titulo('¿Igual o diferente? 🔍');
      var a=adapt.igualdif||{n:0,racha:0}; adapt.igualdif=a;
      var nivel=Math.min(a.n,2);
      var mismaCategoria=nivel>=1; // en niveles más altos, el "diferente" se parece más (misma categoría)
      var cantidad=nivel>=2?5:3;
      var pool = mismaCategoria ? (Math.random()<0.5?bancoFruta:bancoAnimal) : bancoTodo;
      var base=pool[rnd(pool.length)];
      var esIgual=Math.random()<0.5;
      var otros=pool.filter(function(x){return x!==base;});
      var fila;
      if(esIgual){ fila=[]; for(var i=0;i<cantidad;i++)fila.push(base); }
      else { fila=[]; for(var j=0;j<cantidad-1;j++)fila.push(base); fila.push(otros[rnd(otros.length)]); fila=shuffle(fila); }
      var pr=document.createElement('div');pr.className='prompt';pr.style.fontSize='clamp(30px,8vw,46px)';
      pr.innerHTML=fila.map(function(e){return '<span style="margin:0 6px">'+e+'</span>';}).join('');
      app.appendChild(pr);
      var sub=document.createElement('p');sub.className='subtitulo';sub.textContent='¿Son todos iguales, o hay uno diferente?';
      app.appendChild(sub);
      var grid=document.createElement('div');grid.className='opciones';
      inicioRonda=Date.now();
      [{t:'Iguales',v:true,ico:'✅'},{t:'Diferente',v:false,ico:'🔍'}].forEach(function(op){
        var c=nuevaCard();c.innerHTML='<div class="opt-big">'+op.ico+'</div><div class="name">'+op.t+'</div>';
        c.addEventListener('click',function(e){
          var tiempo=Date.now()-inicioRonda;
          if(op.v===esIgual){ c.classList.add('bien');sonidoBien();fx(c,'¡Sí!',e);registrarStat('igualdif',true);
            registrarAdaptativo('igualdif',true,0,2,tiempo); desbloquear('igualdif_win');siguienteOFin('igualdif',adapt.igualdif.aciertos||0,ronda,'¡Miraste con mucha atención!');
          }else{ c.classList.remove('mal');void c.offsetWidth;c.classList.add('mal');sonidoMal();registrarStat('igualdif',false);
            registrarAdaptativo('igualdif',false,0,2,tiempo);
            hablar('Mira otra vez, con calma'); setTimeout(function(){c.classList.remove('mal');},500);
          }
        });
        grid.appendChild(c);
      });
      app.appendChild(grid);
      setTimeout(function(){hablar('¿Son iguales, o hay uno diferente?');},300);
    }
  }

  /* ---------- SIGUE LA INSTRUCCIÓN ---------- */
  var INSTR_UNIVERSO=[].concat(
    animales.map(function(o){return {e:o.e,name:o.name};}),
    frutas.map(function(o){return {e:o.e,name:o.name};})
  );
  function instrucciones(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('Sigue la Instrucción');
    cargarAdapt(); ronda();
    function ronda(){
      app.innerHTML='';app.scrollTop=0;
      titulo('Sigue la Instrucción 👂');
      var a=adapt.instrucciones||{n:0,racha:0}; adapt.instrucciones=a;
      var pasos = (a.n<2||configPerfil.dificultad!=='reto')?1:2;
      var universo=shuffle(INSTR_UNIVERSO.slice());
      var mostrados=universo.slice(0,configPerfil.dificultad==='reto'?5:4);
      var objetivo=shuffle(mostrados.slice()).slice(0,pasos);
      var texto = pasos===1 ? ('Toca '+art(objetivo[0].name)+'.') : ('Toca '+art(objetivo[0].name)+' y después '+art(objetivo[1].name)+'.');
      var pr=document.createElement('div');pr.className='prompt';pr.innerHTML='<span class="sp">🔈</span><span>'+texto+'</span>';
      pr.addEventListener('click',function(){hablar(texto);});
      app.appendChild(pr);
      var btnRep=document.createElement('button');btnRep.type='button';btnRep.className='toolp';btnRep.style.marginBottom='8px';
      btnRep.innerHTML='🔊 Escuchar otra vez';
      btnRep.addEventListener('click',function(){hablar(texto);});
      app.appendChild(btnRep);
      var progreso=0; var inicioRonda=Date.now();
      var grid=document.createElement('div');grid.className='opciones';
      mostrados.forEach(function(it){var c=nuevaCard();c.innerHTML='<div class="opt-big">'+it.e+'</div>';
        c.addEventListener('click',function(e){
          if(progreso>=objetivo.length) return; // corrección: tocar después de terminar rompía el juego
          var tiempo=Date.now()-inicioRonda;
          if(it.name===objetivo[progreso].name){ c.style.opacity='.35';c.style.pointerEvents='none'; sonidoBien(); progreso++;
            if(progreso>=objetivo.length){ fx(c,'¡Lo hiciste!',e); registrarStat('instrucciones',true); registrarAdaptativo('instrucciones',true,0,2,tiempo); desbloquear('instrucciones_win'); siguienteOFin('instrucciones',adapt.instrucciones.aciertos||0,ronda,'¡Escuchaste muy bien!'); }
            else { hablar('Muy bien, ahora '+art(objetivo[progreso].name)); }
          }else{ c.classList.remove('mal');void c.offsetWidth;c.classList.add('mal');sonidoMal();registrarStat('instrucciones',false);registrarAdaptativo('instrucciones',false,0,2,tiempo);
            hablar('Casi. Escucha otra vez'); setTimeout(function(){c.classList.remove('mal');},500);
          }
        });
        grid.appendChild(c);});
      app.appendChild(grid);
      setTimeout(function(){hablar(texto);},300);
    }
  }

  /* ---------- ¿CÓMO SE SIENTE? (emociones en situaciones) ---------- */
  var SITUACIONES=[
    {texto:'Recibe un regalo',e:'🎁',resp:'feliz'},{texto:'Perdió su juguete',e:'🧸',resp:'triste'},
    {texto:'Le quitaron su juguete',e:'😠',resp:'enojado'},{texto:'Ve una araña grande',e:'🕷️',resp:'asustado'},
    {texto:'Está lista para dormir',e:'🌙',resp:'con sueño'},{texto:'Su mamá la abraza',e:'🤗',resp:'con amor'},
    {texto:'Ve algo muy gracioso',e:'🤡',resp:'riendo'},{texto:'Encontró una sorpresa',e:'🎉',resp:'sorprendido'},
    {texto:'Jugando con su mejor amigo',e:'🥳',resp:'feliz'},{texto:'Se cayó y se raspó la rodilla',e:'🤕',resp:'triste'},
    {texto:'Alguien le hizo cosquillas',e:'😆',resp:'riendo'}
  ];
  function situaciones(volver){
    pantallaBase(volver||mundoJugar,{mundo:'jugar'}); marcarActividad('¿Cómo se siente?');
    var aciertos=0, bloqueado=false; ronda();
    function ronda(){
      bloqueado=false; app.innerHTML='';app.scrollTop=0;
      titulo('¿Cómo se siente? 😊');
      var s=SITUACIONES[rnd(SITUACIONES.length)];
      var pr=document.createElement('div');pr.className='prompt';pr.innerHTML='<span class="sp">'+s.e+'</span><span>'+s.texto+'</span>';
      pr.addEventListener('click',function(){hablar(s.texto);});
      app.appendChild(pr);
      var btnRep=document.createElement('button');btnRep.type='button';btnRep.className='toolp';btnRep.style.marginBottom='8px';
      btnRep.innerHTML='🔊 Escuchar otra vez';
      btnRep.addEventListener('click',function(){hablar(s.texto);});
      app.appendChild(btnRep);
      var sc=document.createElement('div');sc.className='progreso';sc.textContent='⭐ '+aciertos;
      app.appendChild(sc);
      var ops=(aciertos<4||configPerfil.dificultad!=='reto')?3:4;
      var objetivo=emociones.filter(function(x){return x.name===s.resp;})[0] || emociones[0];
      var resto=shuffle(emociones.filter(function(e){return e.name!==objetivo.name;}));
      var set=[objetivo]; for(var i=0;i<ops-1 && i<resto.length;i++) set.push(resto[i]);
      shuffle(set);
      var grid=document.createElement('div');grid.className='opciones';
      set.forEach(function(o){var c=nuevaCard();c.innerHTML='<div class="big">'+o.e+'</div><div class="name">'+o.name+'</div>';
        c.addEventListener('click',function(e){ if(bloqueado)return;
          if(o.name===objetivo.name){ bloqueado=true;c.classList.add('bien');sonidoBien();fx(c,'¡Sí! Se siente '+o.name,e);aciertos++;registrarStat('emosit',true);
            if(aciertos>=8) desbloquear('emociones_sit');
            siguienteOFin('situaciones',aciertos,ronda,'¡Entiendes cómo se sienten!');
          }else{ c.classList.remove('mal');void c.offsetWidth;c.classList.add('mal');sonidoMal();registrarStat('emosit',false);
            hablar('¡Intenta otra vez!'); setTimeout(function(){c.classList.remove('mal');},500);
          }
        });
        grid.appendChild(c);});
      app.appendChild(grid);
      setTimeout(function(){hablar(s.texto+'. ¿Cómo se siente?');},300);
    }
  }

  /* ---------- ROMPECABEZAS (piezas reales cortadas de un dibujo; arrastrar o tocar) ----------
     El tablero muestra una "sombra" tenue de cada pieza, así la niña busca dónde se ve igual.
     Si suelta una pieza en otro lugar, vuelve sola a la bandeja y se ilumina el lugar correcto.
     Dificultad adaptativa: 4 piezas → 6 piezas → 9 piezas. */
  var ROMPECABEZAS_ITEMS=[].concat(frutas,animales,transporte,comida);
  var FONDOS_PUZZLE=['#DCEBFA','#FDEDC8','#FBDDD6','#DAF1E2','#E8E0F6'];
  function cortarDibujo(emoji,fondo,filas,cols,S){
    var cv=document.createElement('canvas'); cv.width=S; cv.height=S; var c=cv.getContext('2d');
    c.fillStyle=fondo; c.fillRect(0,0,S,S);
    c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.arc(S*0.5,S*0.55,S*0.42,0,Math.PI*2); c.fill();
    c.textAlign='center'; c.textBaseline='middle';
    var FAM='px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif', F=Math.round(S*0.62);
    c.font=F+FAM; var mw=c.measureText(emoji).width; if(mw>S*0.8){ F=Math.floor(F*S*0.8/mw); c.font=F+FAM; }
    c.fillText(emoji,S/2,S*0.53);
    var piezas=[], w=S/cols, h=S/filas;
    for(var f=0;f<filas;f++) for(var k=0;k<cols;k++){
      var pc=document.createElement('canvas'); pc.width=Math.round(w); pc.height=Math.round(h);
      pc.getContext('2d').drawImage(cv,k*w,f*h,w,h,0,0,pc.width,pc.height);
      piezas.push(pc.toDataURL('image/png'));
    }
    return {full:cv.toDataURL('image/png'),piezas:piezas};
  }
  function rompecabezas(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('Rompecabezas');
    cargarAdapt(); ronda();
    function ronda(){
      app.innerHTML=''; app.scrollTop=0;
      titulo('Rompecabezas');
      var a=adapt.rompecabezas||{n:0,racha:0}; adapt.rompecabezas=a;
      var forma=[[1,2],[2,2],[2,3],[3,3]][Math.min(a.n,configPerfil.dificultad==='reto'?3:(configPerfil.dificultad==='facil'?1:2))], filas=forma[0], cols=forma[1];
      var sub=document.createElement('p');sub.className='subtitulo';sub.textContent='Lleva cada pieza a donde se ve igual';
      app.appendChild(sub);
      var item=ROMPECABEZAS_ITEMS[rnd(ROMPECABEZAS_ITEMS.length)];
      var disp=Math.min(window.innerWidth*0.4, window.innerHeight-260, 420);
      var celda=Math.max(80,Math.floor(disp/cols));
      var dib=cortarDibujo(item.e,FONDOS_PUZZLE[rnd(FONDOS_PUZZLE.length)],filas,cols,celda*Math.max(cols,filas)*2);
      var wrap=document.createElement('div');wrap.className='puzzle-wrap';
      var tablero=document.createElement('div');tablero.className='puzzle-tablero';
      var altoCelda=Math.round(celda*cols/filas); // cada pieza conserva la proporción del recorte
      tablero.style.gridTemplateColumns='repeat('+cols+','+celda+'px)'; tablero.style.gridTemplateRows='repeat('+filas+','+altoCelda+'px)';
      var slots=[], colocadas=0, errores=0, total=filas*cols;
      for(var i=0;i<total;i++){ var s=document.createElement('div'); s.className='puzzle-slot'; s.dataset.i=i;
        s.innerHTML='<div class="guia" style="background-image:url('+dib.piezas[i]+')"></div>'; slots.push(s); tablero.appendChild(s); }
      var bandeja=document.createElement('div');bandeja.className='puzzle-bandeja';
      bandeja.style.gridTemplateColumns='repeat('+(total<=4?2:3)+',auto)';
      var arr=crearArrastre({
        objetivos:function(){ return slots.filter(function(s){return !s.classList.contains('lleno');}); },
        soltar:function(p,t){
          if(p.dataset.i===t.dataset.i){
            t.classList.add('lleno'); t.style.backgroundImage='url('+dib.piezas[+p.dataset.i]+')';
            p.dataset.fijo='1'; p.style.visibility='hidden'; p.style.transform='';
            sonidoFlip(); animarTap(t,'rebota',380); colocadas++; registrarStat('rompecabezas',true);
            if(colocadas>=total) terminar();
            return true;
          }
          errores++; sonidoMal(); registrarStat('rompecabezas',false); hablar('Casi. Busca donde se ve igual');
          slots[+p.dataset.i].classList.add('objetivo-tap'); setTimeout(function(){ slots[+p.dataset.i].classList.remove('objetivo-tap'); },1300);
          return false;
        }
      });
      slots.forEach(function(s){ arr.objetivo(s); });
      shuffle(slots.map(function(s,i){return i;})).forEach(function(i){
        var p=document.createElement('button');p.type='button';p.className='puzzle-pieza';p.dataset.i=i;
        p.style.width=Math.round(celda*0.78)+'px'; p.style.height=Math.round(altoCelda*0.78)+'px'; p.style.backgroundImage='url('+dib.piezas[i]+')';
        p.setAttribute('aria-label','pieza '+(i+1));
        arr.pieza(p); bandeja.appendChild(p);
      });
      wrap.appendChild(tablero);wrap.appendChild(bandeja);app.appendChild(wrap);
      hablar('Arma el dibujo. Lleva cada pieza a donde se ve igual');
      function terminar(){
        registrarAdaptativo('rompecabezas',errores<=1,0,3);
        setTimeout(function(){
          sonidoGane(); hablar('¡Lo lograste! Es '+art(item.name)); desbloquear('rompecabezas_try');
          celebrar(14);
          bandeja.remove();
          var f=document.createElement('div');f.className='fiesta';
          f.innerHTML='<h2>¡Es '+art(item.name)+'!</h2>';
          var btns=document.createElement('div');btns.className='btns';
          var b1=document.createElement('button');b1.className='btng';b1.style.background='var(--pasto)';b1.style.color='#fff';b1.textContent='Otro rompecabezas';
          b1.addEventListener('click',function(){ronda();});
          btns.appendChild(b1);f.appendChild(btns);f.appendChild(sugerenciasDespues('rompecabezas'));app.appendChild(f);
        },450);
      }
    }
  }

  /* ---------- ENCAJA LA FORMA (inspirado en los juegos de encajar figuras) ---------- */
  var FORMAS_SVG={
    circulo:{n:'el círculo',d:'<circle cx="50" cy="50" r="40"/>'},
    cuadrado:{n:'el cuadrado',d:'<rect x="12" y="12" width="76" height="76" rx="8"/>'},
    triangulo:{n:'el triángulo',d:'<polygon points="50,8 93,88 7,88"/>'},
    estrella:{n:'la estrella',d:'<polygon points="50,5 61,37 95,37 68,57 78,90 50,70 22,90 32,57 5,37 39,37"/>'},
    corazon:{n:'el corazón',d:'<path d="M50 88 C18 66 6 48 10 30 C14 14 34 8 50 26 C66 8 86 14 90 30 C94 48 82 66 50 88Z"/>'},
    rombo:{n:'el rombo',d:'<polygon points="50,5 95,50 50,95 5,50"/>'},
    luna:{n:'la luna',d:'<path d="M60 8 A42 42 0 1 0 92 72 A32 32 0 1 1 60 8Z"/>'},
    rectangulo:{n:'el rectángulo',d:'<rect x="6" y="24" width="88" height="52" rx="8"/>'}
  };
  var COLORES_PIEZA=['#3D8BD9','#EC6A55','#F2AE2E','#3FA463','#7A5AB5','#E86FA6','#2EC4B6','#FF9F45'];
  function svgForma(k,relleno,esHueco){
    var est=esHueco?'fill="#EFE6D6" stroke="#9C93AC" stroke-width="3" stroke-dasharray="7 5"':'fill="'+relleno+'" stroke="#2A2238" stroke-width="3.5" stroke-linejoin="round"';
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><g '+est+'>'+FORMAS_SVG[k].d+'</g></svg>';
  }
  function encajaFormas(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('Encaja la forma');
    cargarAdapt(); var rondas=0; ronda();
    function ronda(){
      app.innerHTML=''; app.scrollTop=0;
      titulo('Encaja la forma');
      var a=adapt.encaja||{n:0,racha:0}; adapt.encaja=a;
      var cuantas=[2,3,4,5][Math.min(a.n,configPerfil.dificultad==='reto'?3:2)];
      var claves=shuffle(Object.keys(FORMAS_SVG)).slice(0,cuantas);
      var cols=shuffle(COLORES_PIEZA.slice());
      var sub=document.createElement('p');sub.className='subtitulo';sub.textContent='Lleva cada forma a su hueco (arrastra o toca)';
      app.appendChild(sub);
      var tablero=document.createElement('div');tablero.className='tablero-formas';tablero.style.setProperty('--n',Math.min(cuantas,5));
      var huecos=[], puestas=0, errores=0;
      shuffle(claves.slice()).forEach(function(k){ var h=document.createElement('div');h.className='hueco';h.dataset.k=k;h.innerHTML=svgForma(k,null,true); huecos.push(h); tablero.appendChild(h); });
      var bandeja=document.createElement('div');bandeja.className='bandeja';
      var arr=crearArrastre({
        objetivos:function(){ return huecos.filter(function(h){return !h.classList.contains('lleno');}); },
        alTomar:function(p){ hablar(FORMAS_SVG[p.dataset.k].n); },
        sinPieza:function(){ hablar('Primero toca una forma'); },
        soltar:function(p,t){
          var k=p.dataset.k;
          if(t.dataset.k===k){
            t.classList.add('lleno'); t.innerHTML=svgForma(k,p.dataset.c,false); animarTap(t,'rebota',400);
            p.dataset.fijo='1'; p.style.visibility='hidden'; p.style.transform='';
            sonidoBien(); hablar('¡Encajó '+FORMAS_SVG[k].n+'!'); registrarStat('encaja',true);
            var r=t.getBoundingClientRect(); chispas(r.left+r.width/2,r.top+r.height/2);
            puestas++; if(puestas>=cuantas) terminar();
            return true;
          }
          errores++; sonidoMal(); registrarStat('encaja',false);
          hablar('Ahí no cabe. Busca el hueco de '+FORMAS_SVG[k].n);
          return false;
        }
      });
      huecos.forEach(function(h){ arr.objetivo(h); });
      shuffle(claves.slice()).forEach(function(k,i){
        var p=document.createElement('button');p.type='button';p.className='pieza';p.dataset.k=k;p.dataset.c=cols[i%cols.length];
        p.setAttribute('aria-label',FORMAS_SVG[k].n);
        p.innerHTML=svgForma(k,cols[i%cols.length],false); arr.pieza(p); bandeja.appendChild(p);
      });
      app.appendChild(tablero); app.appendChild(bandeja);
      setTimeout(function(){ hablar('Lleva cada forma a su hueco'); },300);
      function terminar(){
        rondas++; registrarAdaptativo('encaja',errores<=1,0,3);
        if(rondas>=2) desbloquear('encaja_win');
        setTimeout(function(){
          sonidoGane(); celebrar(12); hablar('¡Todas las formas encajaron!');
          bandeja.innerHTML='';
          var f=document.createElement('div');f.className='fiesta';
          var btns=document.createElement('div');btns.className='btns';
          var b1=document.createElement('button');b1.className='btng';b1.style.background='var(--pasto)';b1.style.color='#fff';b1.textContent='¡Otra vez!';
          b1.addEventListener('click',function(){ronda();});btns.appendChild(b1);
          f.appendChild(btns); f.appendChild(sugerenciasDespues('encaja')); app.appendChild(f);
        },600);
      }
    }
  }

  /* ---------- BURBUJAS (causa-efecto + discriminación de colores, números y vocales) ----------
     Las burbujas suben despacio; se revientan las que se piden. Si toca otra, solo se le dice
     qué era ("esa es azul"): no hay tiempo límite ni se pierde nada. Cada burbuja correcta se
     cuenta en voz alta (uno, dos, tres...). */
  var BURB_COLS=[{n:'rojo',f:'roja',pl:'rojas',hex:'#EC6A55'},{n:'azul',f:'azul',pl:'azules',hex:'#4D9BE6'},{n:'amarillo',f:'amarilla',pl:'amarillas',hex:'#F5CF3F'},
                 {n:'verde',f:'verde',pl:'verdes',hex:'#4CB672'},{n:'morado',f:'morada',pl:'moradas',hex:'#9677D3'},{n:'rosado',f:'rosada',pl:'rosadas',hex:'#F291BE'}];
  function burbujas(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('Burbujas');
    cargarAdapt(); var rondasHechas=0, intervalo=null;
    ronda();
    function ronda(){
      if(intervalo){ window.clearInterval(intervalo); intervalo=null; }
      app.innerHTML=''; app.scrollTop=0;
      var a=adapt.burbujas||{n:0,racha:0}; adapt.burbujas=a;
      var fase=Math.min(a.n,configPerfil.dificultad==='reto'?3:1), META=5, logradas=0, errores=0;
      var obj, distract, etiqueta, frase, decirOtra;
      if(fase<=1){
        var pal=shuffle(BURB_COLS.slice()).slice(0,fase===0?2:4);
        obj=pal[0]; distract=pal.slice(1);
        etiqueta=function(x){return '';}; colorDe=function(x){return x.hex;};
        frase='Revienta las burbujas '+obj.pl; decirOtra=function(x){return 'Esa es '+x.f;};
      } else if(fase===2){
        var nums=shuffle([1,2,3,4,5]).slice(0,4).map(function(n){return {v:n};});
        obj=nums[0]; distract=nums.slice(1);
        etiqueta=function(x){return x.v;}; colorDe=function(){return BURB_COLS[rnd(BURB_COLS.length)].hex;};
        frase='Revienta las burbujas con el número '+palabras[obj.v]; decirOtra=function(x){return 'Ese es el '+palabras[x.v];};
      } else {
        var vs=shuffle(['A','E','I','O','U']).slice(0,4).map(function(l){return {v:l};});
        obj=vs[0]; distract=vs.slice(1);
        etiqueta=function(x){return x.v;}; colorDe=function(){return BURB_COLS[rnd(BURB_COLS.length)].hex;};
        frase='Revienta las burbujas con la letra '+obj.v; decirOtra=function(x){return 'Esa es la letra '+x.v;};
      }
      var pr=document.createElement('button');pr.type='button';pr.className='prompt';
      pr.innerHTML='<span class="sp">🔊</span><span>'+frase+'</span>'+(fase<=1?'<span style="width:34px;height:34px;border-radius:50%;border:2px solid var(--tinta);background:'+obj.hex+'"></span>':'');
      pr.addEventListener('click',function(){hablar(frase);animarIconoSonido(pr.querySelector('.sp'));});
      app.appendChild(pr);
      var marc=document.createElement('div');marc.className='marcador';
      for(var i=0;i<META;i++){var m=document.createElement('i');m.style.setProperty('--bc',fase<=1?obj.hex:'var(--sol)');marc.appendChild(m);}
      app.appendChild(marc);
      var zona=document.createElement('div');zona.className='burbujero';app.appendChild(zona);
      var quieto=reduce();
      function crear(){
        if(!document.body.contains(zona)){ window.clearInterval(intervalo); intervalo=null; return; }
        if(zona.querySelectorAll('.burbuja:not(.pum)').length>=(quieto?8:7)) return;
        var esObj=Math.random()<0.45, x=esObj?obj:distract[rnd(distract.length)];
        var W=zona.clientWidth, H=zona.clientHeight;
        var d=Math.round(Math.max(92,Math.min(150,W/7))*(0.85+Math.random()*0.3));
        var b=document.createElement('button');b.type='button';b.className='burbuja';
        b.style.setProperty('--d',d+'px'); b.style.setProperty('--bc',colorDe(x)); b.style.setProperty('--t',(fase===0?11:9.5)+Math.random()*2+'s');
        b.style.left=Math.round(Math.random()*Math.max(1,W-d))+'px';
        if(quieto){ b.style.bottom='auto'; b.style.top=Math.round(Math.random()*Math.max(1,H-d))+'px'; }
        b.textContent=etiqueta(x);
        b.addEventListener('animationend',function(ev){ if(ev.animationName==='flota') b.remove(); });
        b.addEventListener('pointerdown',function(ev){
          ev.preventDefault();
          if(b.classList.contains('pum')) return;
          if(x===obj){
            var tr=getComputedStyle(b).transform; b.style.setProperty('--pos',tr==='none'?'none':tr); b.style.transform=tr==='none'?'':tr;
            b.classList.add('pum'); setTimeout(function(){b.remove();},320);
            sonidoPop(); logradas++; registrarStat('burbujas',true);
            var mk=marc.children[logradas-1]; if(mk){mk.className='on';animarTap(mk,'rebota',350);}
            hablar(palabras[logradas]);
            if(logradas>=META) terminar();
          } else {
            errores++; registrarStat('burbujas',false); animarTap(b,'rebota',350); hablar(decirOtra(x));
          }
        });
        zona.appendChild(b);
      }
      for(var k=0;k<(quieto?6:3);k++) setTimeout(crear,k*350);
      intervalo=intervaloPantalla(crear,quieto?1400:900);
      setTimeout(function(){hablar(frase);},300);
      function terminar(){
        window.clearInterval(intervalo); intervalo=null; rondasHechas++;
        registrarAdaptativo('burbujas',errores<=2,0,3);
        if(rondasHechas>=3) desbloquear('burbujas_win');
        setTimeout(function(){
          sonidoGane(); celebrar(12); hablar('¡Cinco burbujas! ¡Muy bien!');
          Array.prototype.forEach.call(zona.querySelectorAll('.burbuja'),function(x){ x.style.transition='opacity .4s'; x.style.opacity='0'; });
          var f=document.createElement('div');f.className='fiesta';f.style.position='absolute';f.style.inset='0';f.style.justifyContent='center';f.style.maxWidth='none';
          f.innerHTML=personajeSVG('animando',120);
          var btns=document.createElement('div');btns.className='btns';
          var b1=document.createElement('button');b1.className='btng';b1.style.background='var(--pasto)';b1.style.color='#fff';b1.textContent='¡Más burbujas!';
          b1.addEventListener('click',function(){ronda();});
          var b2=document.createElement('button');b2.className='btng';b2.textContent='Otro juego';
          b2.addEventListener('click',function(){mundoJugar();});
          btns.appendChild(b1);btns.appendChild(b2);f.appendChild(btns);zona.appendChild(f);
        },500);
      }
    }
    var colorDe=function(){return '#fff';};
  }

  /* Cada juego "sin fin" ahora termina tras 5 aciertos con una celebración y la opción de
     seguir (sesiones cortas y pausas naturales). */
  function siguienteOFin(id,aciertos,ronda,frase){
    if(aciertos>0 && aciertos%5===0) setTimeout(function(){ finJuego(id,ronda,frase); },1000);
    else setTimeout(ronda,1250);
  }
  function finJuego(id,ronda,frase){
    app.innerHTML=''; app.scrollTop=0;
    app.appendChild(pantallaFiesta({titulo:frase||'¡Muy bien jugado!',decir:frase||'¡Muy bien jugado!',estrellas:5,
      botones:[{ico:'🔁',t:'Otra vez',go:function(){ ronda(); }},{ico:'⭐',t:'Otro juego',go:function(){ mundoJugar(); }}],sugerir:id}));
  }
