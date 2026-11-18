  /* ---------- MEMORIA ---------- */
  function memoria(){
    pantallaBase(mundoJugar,{mundo:'jugar'}); marcarActividad('Memoria');
    var pool=[].concat(frutas,animales,transporte,comida);
    seleccionar();
    function seleccionar(){
      app.innerHTML=''; app.scrollTop=0;
      cabeceraMundo('Memoria',null,null,'lucia');
      var box=el('div',{clase:'actividades memo-sel'});
      var tam=[{n:2,cols:2},{n:3,cols:3},{n:4,cols:4},{n:6,cols:4}];
      if(configPerfil.dificultad==='reto') tam=tam.concat([{n:8,cols:4},{n:12,cols:6}]);
      if(configPerfil.dificultad==='facil') tam=tam.slice(0,3);
      tam.forEach(function(d,i){
        var cartas=''; for(var k=0;k<d.n*2;k++) cartas+='<i></i>';
        var b=el('button',{clase:'act stagger memo-op',attrs:{'aria-label':palabras[d.n]+' parejas'},html:'<span class="memo-mini c'+d.cols+'" aria-hidden="true">'+cartas+'</span>'});
        b.style.animationDelay=(i*40)+'ms';
        b.addEventListener('click',function(){ sonidoTap(); hablar(palabras[d.n]+' parejas'); jugar(d.n,d.cols); });
        box.appendChild(b);
      });
      app.appendChild(box);
      _setTimeout(function(){ hablar('Memoria. ¿Cuántas cartas quieres?'); },350);
    }
    function jugar(nPares,cols){
      var elegidos=shuffle(pool.slice()).slice(0,nPares);
      var cartas=shuffle(elegidos.concat(elegidos)).map(function(o,i){return {i:i,o:o,e:o.e,volteada:false,encontrada:false};});
      var abiertas=[], encontradas=0, bloqueado=true, vista=true;
      var filas=Math.ceil(cartas.length/cols);
      app.innerHTML=''; app.scrollTop=0;
      titulo('Memoria'); app.lastChild.classList.add('solo-lector');
      var info=document.createElement('div');info.className='memoinfo';app.appendChild(info);
      var grid=document.createElement('div');grid.className='memogrid';grid.style.setProperty('--cols',cols);grid.style.setProperty('--ratio',(cols/filas).toFixed(2));
      app.appendChild(grid);
      var botones=cartas.map(function(c){
        var b=document.createElement('button');b.type='button';b.className='memocard volteada';
        b.setAttribute('aria-label','carta');
        b.innerHTML='<div class="memocard-inner"><div class="memocard-face back"><span class="back">⭐</span></div><div class="memocard-face front">'+c.e+'</div></div>';
        b.addEventListener('click',function(){
          if(bloqueado||vista||c.volteada||c.encontrada)return;
          c.volteada=true; b.classList.add('volteada'); sonidoFlip(); hablar(c.o.name);
          abiertas.push({c:c,b:b});
          if(abiertas.length===2){
            bloqueado=true;
            var a1=abiertas[0], a2=abiertas[1];
            if(a1.c.e===a2.c.e){
              a1.c.encontrada=a2.c.encontrada=true; encontradas++;
              setTimeout(function(){
                a1.b.classList.add('bien'); a2.b.classList.add('bien');
                sonidoBien(); hablar('¡Pareja! '+art(a1.c.o.name)); registrarStat('memoria',true);
                var r=a2.b.getBoundingClientRect(); chispas(r.left+r.width/2,r.top+r.height/2);
                actualizar(); abiertas=[]; bloqueado=false;
                if(encontradas>=nPares) setTimeout(ganar,900);
              },350);
            }else{
              registrarStat('memoria',false);
              setTimeout(function(){
                sonidoMal();
                a1.c.volteada=a2.c.volteada=false; a1.b.classList.remove('volteada'); a2.b.classList.remove('volteada');
                abiertas=[]; bloqueado=false;
              },1100);
            }
          }
        });
        grid.appendChild(b); return b;
      });
      var est=filaEstrellas(nPares,0); info.appendChild(est);
      function actualizar(){ Array.prototype.forEach.call(est.children,function(x,i){ x.className=i<encontradas?'on':''; }); info.classList.toggle('mirando',vista); }
      actualizar(); hablar('Mira bien dónde está cada una');
      setTimeout(function(){ vista=false; bloqueado=false; botones.forEach(function(b){b.classList.remove('volteada');}); actualizar(); }, 1800+nPares*250);
      function ganar(){
        app.innerHTML='';app.scrollTop=0; desbloquear('memoria_win');
        app.appendChild(pantallaFiesta({titulo:'¡Todas las parejas!',decir:'¡Encontraste todas las parejas! Recordaste muy bien.',
          botones:[{ico:'🔁',t:'Otra vez',go:function(){jugar(nPares,cols);}},{ico:'🃏',t:'Más cartas',go:function(){seleccionar();}}],sugerir:'memoria'}));
      }
    }
  }
