  /* =====================================================================
     MÚSICA — xilófono de colores + "Eco" (Lucía toca, la niña repite).
     Ritmo y escucha, sin respuestas "malas": cualquier intento se celebra.
     ===================================================================== */
  var TECLAS=[{n:'do',c:'#EC6A55',e:'🐶'},{n:'re',c:'#F2994A',e:'🐱'},{n:'mi',c:'#F2C94C',e:'🐥'},{n:'fa',c:'#6FCF97',e:'🐸'},
              {n:'sol',c:'#56CCF2',e:'🐳'},{n:'la',c:'#5B8DEF',e:'🦋'},{n:'si',c:'#9B6BD6',e:'🦄'},{n:'do2',c:'#E86FA6',e:'🌸'}];
  function musica(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('Música');
    var cab=el('div',{clase:'juego-cab'});
    var modo='libre', secuencia=[], pos=0, ecos=0;
    var bLibre=el('button',{clase:'tab sel',html:'<span aria-hidden="true">🎹</span> Tocar'}), bEco=el('button',{clase:'tab',html:'<span aria-hidden="true">👂</span> Eco'});
    cab.appendChild(el('div',{clase:'tabs'},[bLibre,bEco]));
    cab.appendChild(acompanante('lucia'));
    app.appendChild(cab);
    var est=filaEstrellas(5,0); est.style.visibility='hidden'; app.appendChild(est);
    var xilo=el('div',{clase:'xilofono'}), teclas=[];
    TECLAS.forEach(function(t,i){
      var b=el('button',{clase:'tecla',attrs:{'aria-label':'Nota '+t.n.replace('2','')}});
      b.style.setProperty('--tc',t.c); b.style.setProperty('--h',(100-i*6)+'%');
      b.innerHTML='<span aria-hidden="true">'+t.e+'</span>';
      b.addEventListener('pointerdown',function(e){ e.preventDefault(); tocar(i,true); });
      b.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); tocar(i,true); } });
      teclas.push(b); xilo.appendChild(b);
    });
    app.appendChild(xilo);
    function tocar(i,porNina){
      nota(NOTAS[TECLAS[i].n],0.7); animarTap(teclas[i],'suena',300);
      if(!porNina) return;
      registrarStatMusica();
      if(modo==='eco' && secuencia.length){
        pos++;
        if(pos>=secuencia.length){ ecos++; encenderEstrella(est,ecos-1); reaccionPersonaje(true); sonidoBien();
          hablar(['¡Qué bonito!','¡Lo repetiste!','¡Muy buen oído!'][rnd(3)]);
          secuencia=[]; pos=0;
          if(ecos>=5){ desbloquear('musica_win'); setTimeout(function(){ app.innerHTML=''; app.appendChild(pantallaFiesta({titulo:'¡Hiciste música!',decir:'¡Hiciste música! Escuchaste muy bien.',estrellas:5,botones:[{ico:'🔁',t:'Otra vez',go:musica},{ico:'⭐',t:'Otro juego',go:mundoJugar}],sugerir:'musica'})); },1300); }
          else setTimeout(nuevoEco,1700);
        }
      }
    }
    var contadorLibre=0;
    function registrarStatMusica(){ contadorLibre++; if(contadorLibre%12===0){ registrarStat('musica',true); if(contadorLibre>=24) desbloquear('musica_win'); } }
    function nuevoEco(){
      var largo=ecos<2?2:3; secuencia=[]; pos=0;
      var base=rnd(TECLAS.length-2); for(var k=0;k<largo;k++) secuencia.push(Math.min(TECLAS.length-1,base+rnd(3)));
      hablar('Escucha','es',{fin:function(){ secuencia.forEach(function(n,k){ setTimeout(function(){ tocar(n,false); },400+k*650); });
        setTimeout(function(){ hablar('¡Ahora tú!'); },400+secuencia.length*650+200); }});
    }
    bLibre.addEventListener('click',function(){ modo='libre'; bLibre.classList.add('sel'); bEco.classList.remove('sel'); est.style.visibility='hidden'; hablar('Toca las teclas y haz música'); });
    bEco.addEventListener('click',function(){ modo='eco'; ecos=0; bEco.classList.add('sel'); bLibre.classList.remove('sel'); est.style.visibility='visible';
      Array.prototype.forEach.call(est.children,function(x){x.className='';}); nuevoEco(); });
    _setTimeout(function(){ hablar('Toca las teclas y haz música'); },300);
  }
