  /* =====================================================================
     MI COLECCIÓN (álbum de stickers) y MUNDO DESCUBRIR
     ===================================================================== */
  function album(){
    pantallaBase(function(){inicio();},{mundo:'coleccion'});
    var ganados=cargarStickers(), total=Object.keys(STICKERS).length;
    cabeceraMundo('Mi colección',null,null,'lucia');
    var cab=app.lastChild; cab.classList.add('album-cab');
    cab.querySelector('.mc-txt').appendChild(barraProgreso(ganados.length/total,'var(--uva)','Stickers de la colección'));
    var grid=el('div',{clase:'stickergrid'});
    ganados.forEach(function(id,i){
      var s=STICKERS[id];
      var d=el('button',{clase:'sticker stagger',attrs:{'aria-label':s.nombre}});
      d.style.animationDelay=Math.min(i*25,500)+'ms';
      d.innerHTML='<span class="semoji" aria-hidden="true">'+s.emoji+'</span>';
      d.addEventListener('click',function(){ animarTap(d,'rebota',400); hablar(s.nombre); });
      grid.appendChild(d);
    });
    // Los espacios vacíos se muestran como siluetas sin texto (no hay nada que leer).
    var faltan=Math.min(total-ganados.length, Math.max(3, 12-ganados.length));
    for(var k=0;k<faltan;k++) grid.appendChild(el('div',{clase:'sticker bloqueado',attrs:{'aria-hidden':'true'},html:'<span class="semoji">✦</span>'}));
    app.appendChild(grid);
    _setTimeout(function(){ hablar(ganados.length? 'Tu colección. Toca un sticker para escucharlo.' : 'Tu álbum te espera. Jugando encuentras stickers.'); },350);
  }

  /* ---------- DESCUBRIR ---------- */
  function aprender(){
    pantallaBase(function(){inicio();},{mundo:'descubrir',barra:true});
    cabeceraMundo('Descubrir',null,null,'lucia');
    var menu=el('div',{clase:'actividades'});
    categorias.forEach(function(c,i){
      var n=explorado[c.id]?Object.keys(explorado[c.id]).length:0, tot=TOTALES[c.id]||1;
      menu.appendChild(tarjetaActividad({ico:c.ico,t:c.txt,frac:n/tot,color:'var(--cielo)',hecho:n>=tot,go:function(){categoria(c.id);}},i));
    });
    app.appendChild(menu);
    _setTimeout(function(){ hablar('¿Qué quieres descubrir?'); },350);
  }

  var NOMBRE_CAT={}; categorias.forEach(function(c){ NOMBRE_CAT[c.id]=c.txt; });
  function categoria(id){
    if(!TOTALES[id]) id='animales';
    pantallaBase(aprender,{mundo:'descubrir',pantalla:'cat:'+id});
    marcarActividad('Descubrir: '+NOMBRE_CAT[id]);
    var c=categorias.filter(function(x){return x.id===id;})[0];
    var cab=el('div',{clase:'cat-cab'});
    cab.appendChild(el('h1',{clase:'titulo',texto:c.txt}));
    var n=explorado[id]?Object.keys(explorado[id]).length:0;
    var barra=barraProgreso(n/TOTALES[id],'var(--cielo)','Descubierto en '+c.txt);
    cab.appendChild(barra); app.appendChild(cab);
    cab.appendChild(acompanante('lucia'));
    function actualizarBarra(){ var k=explorado[id]?Object.keys(explorado[id]).length:0; var nb=barraProgreso(k/TOTALES[id],'var(--cielo)','Descubierto en '+c.txt); cab.replaceChild(nb,barra); barra=nb; }
    var grid=el('div',{clase:'rejilla'});
    function tarjeta(html,clave,decir,en){
      var card=nuevaCard(); card.innerHTML=html+bilingueTag(en);
      if(explorado[id]&&explorado[id][clave]) card.classList.add('visto');
      card.addEventListener('click',function(e){ fx(card,decir,e); tocarAprender(id,clave,TOTALES[id]); card.classList.add('visto'); actualizarBarra(); decirEN(en); });
      grid.appendChild(card);
    }
    if(id==='vocales'){ vocales.forEach(function(v){
      tarjeta('<div class="vletra">'+v.l+'</div><div class="vejemplos" aria-hidden="true">'+v.ej.map(function(x){return '<span>'+x.e+'</span>';}).join('')+'</div>',v.l,v.say); }); }
    else if(id==='numeros'){ numeros.forEach(function(o){
      var d=''; for(var k=0;k<o.n;k++) d+='<span class="dot"></span>';
      tarjeta('<div class="numgrande">'+o.n+'</div><div class="dots" aria-hidden="true">'+d+'</div>',o.n,o.say+', '+o.say,o.en); }); }
    else if(id==='colores'){ colores.forEach(function(o){
      tarjeta('<div class="swatch" style="background:'+o.hex+'"></div><div class="name">'+esc(o.name)+'</div>',o.name,'color '+o.name,o.en); }); }
    else if(id==='formas'){ formas.forEach(function(o){
      tarjeta(formaHtml(o)+'<div class="name">'+esc(o.name)+'</div>',o.name,o.name,o.en); }); }
    else {
      var listas={frutas:frutas,animales:animales,cuerpo:cuerpo,transporte:transporte,comida:comida,emociones:emociones};
      var decir={animales:function(o){return o.say;},cuerpo:function(o){return art(o.name);},transporte:function(o){return art(o.name);},emociones:function(o){return 'está '+o.name;}};
      listas[id].forEach(function(o){ tarjeta('<div class="big" aria-hidden="true">'+o.e+'</div><div class="name">'+esc(o.name)+'</div>',o.name,decir[id]?decir[id](o):o.name,o.en); });
    }
    app.appendChild(grid);
    if(id==='emociones'){
      app.appendChild(el('button',{clase:'modo stagger',html:'<span class="ico" aria-hidden="true">🎭</span><span class="txt">¿Cómo se siente?</span>',
        on:{click:function(){ hablar('¿Cómo se siente?'); situaciones(function(){categoria('emociones');}); }}}));
    }
    _setTimeout(function(){ hablar(c.txt+'. Toca y escucha.'); },300);
  }
