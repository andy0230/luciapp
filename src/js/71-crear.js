  /* ---------- TRAZAR ---------- */
  function trazar(){
    pantallaBase(mundoCrear,{mundo:'crear'}); marcarActividad('Trazar');
    var setL='ABC', idx=0, color='#4D8BFF', W=0,H=0,ctx=null;
    var letras=(configPerfil.dificultad==='reto'?'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ':'AEIOU').split('');
    var nums=(configPerfil.dificultad==='reto'?'0123456789':'123').split('');
    var numsSay=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];
    function lista(){return setL==='ABC'?letras:nums;}
    var cont=document.createElement('div');cont.className='pintar';
    var tabs=document.createElement('div');tabs.className='tabs';
    var tA=document.createElement('button');tA.className='tab sel';tA.type='button';tA.textContent='ABC';
    var tN=document.createElement('button');tN.className='tab';tN.type='button';tN.textContent='123';
    tabs.appendChild(tA);tabs.appendChild(tN);
    var wrap=document.createElement('div');wrap.className='lienzo-wrap';
    var cv=document.createElement('canvas');wrap.appendChild(cv);
    var puntoDom=document.createElement('div');puntoDom.className='puntoinicio';puntoDom.style.display='none';wrap.appendChild(puntoDom);
    var tools=document.createElement('div');tools.className='herramientas';
    cont.appendChild(tabs);cont.appendChild(wrap);cont.appendChild(tools);app.appendChild(cont);
    var pal=['#4D8BFF','#FF5D5D','#3FC46B','#9B6BFF','#FF9F45'],sw=[];
    pal.forEach(function(hex){var t=document.createElement('button');t.className='tinta';t.type='button';t.style.background=hex;
      if(hex===color)t.classList.add('sel');
      t.addEventListener('click',function(){color=hex;sw.forEach(function(s){s.classList.remove('sel');});t.classList.add('sel');});
      sw.push(t);tools.appendChild(t);});
    function tb(html,fn){var b=document.createElement('button');b.className='toolp';b.type='button';b.innerHTML=html;b.addEventListener('click',fn);tools.appendChild(b);return b;}
    function decir(){var ch=lista()[idx];hablar(setL==='ABC'?('letra '+ch):numsSay[parseInt(ch,10)]);}

    // ---- Validación geométrica aproximada del trazo ----
    // No hay reconocimiento caligráfico real: se compara, por coordenadas, el camino que
    // dibujó el dedo contra los píxeles de la guía (la letra/número gris de fondo).
    var fsActual=0, inicioPt=null, finPt=null, mascara=[], trazoPuntos=[];
    function distancia(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }
    function calcularMascara(){
      var pts=[]; if(!ctx)return pts;
      try{
        var dpr=window.devicePixelRatio||1;
        var datos=ctx.getImageData(0,0,cv.width,cv.height).data;
        var paso=Math.max(6,Math.round(9*dpr));
        for(var y=0;y<cv.height;y+=paso){
          for(var x=0;x<cv.width;x+=paso){
            var i=(y*cv.width+x)*4;
            if(!(datos[i]>250 && datos[i+1]>250 && datos[i+2]>250)){ pts.push({x:x/dpr,y:y/dpr}); }
          }
        }
      }catch(e){}
      // Reduce a un número manejable de puntos representativos.
      if(pts.length>220){ var k=Math.ceil(pts.length/220); pts=pts.filter(function(_,i){return i%k===0;}); }
      return pts;
    }
    function calcularFin(pts,inicio){
      if(!pts.length) return inicio;
      var mejor=pts[0], mejorPunt=-Infinity;
      pts.forEach(function(p){ var punt=p.y+p.x*0.35; if(punt>mejorPunt){mejorPunt=punt; mejor=p;} });
      return mejor;
    }
    function validarTrazo(){
      if(trazoPuntos.length<6) return {nivel:'bajo',score:0};
      var hol=configPerfil.dificultad==='reto'?1:1.4; var tolGuia=fsActual*0.17*hol, tolIni=fsActual*0.32*hol, tolFin=fsActual*0.36*hol, tolCobertura=fsActual*0.22*hol;
      var dentro=0;
      trazoPuntos.forEach(function(p){ var min=Infinity;
        for(var i=0;i<mascara.length;i++){ var d=distancia(p,mascara[i]); if(d<min)min=d; if(min<tolGuia)break; }
        if(min<tolGuia) dentro++;
      });
      var pctGuia = dentro/trazoPuntos.length;
      var cubiertos=0;
      mascara.forEach(function(m){ var min=Infinity;
        for(var i=0;i<trazoPuntos.length;i++){ var d=distancia(m,trazoPuntos[i]); if(d<min)min=d; if(min<tolCobertura)break; }
        if(min<tolCobertura) cubiertos++;
      });
      var pctCobertura = mascara.length? cubiertos/mascara.length : 0;
      var inicioOk = inicioPt ? distancia(trazoPuntos[0],inicioPt) < tolIni : true;
      var finOk = finPt ? distancia(trazoPuntos[trazoPuntos.length-1],finPt) < tolFin : true;
      var score = pctCobertura*0.45 + pctGuia*0.30 + (inicioOk?0.125:0) + (finOk?0.125:0);
      var nivel = score>=0.55 ? 'alto' : (score>=0.28 ? 'medio' : 'bajo');
      return {nivel:nivel,score:score};
    }
    function guia(){ if(!ctx)return; ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,W,H);
      var ch=lista()[idx]; var fs=Math.min(H*0.82,W*0.82); fsActual=fs;
      ctx.fillStyle='#E7E1F2';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.font='700 '+fs+'px Fredoka, sans-serif'; ctx.fillText(ch,W/2,H/2+fs*0.03);
      inicioPt={x:W/2-fs*0.32,y:H/2-fs*0.32};
      // punto de inicio: ayuda a saber por dónde empezar a trazar, sin exigir precisión.
      ctx.beginPath(); ctx.arc(inicioPt.x,inicioPt.y,7,0,Math.PI*2); ctx.fillStyle='#3FC46B'; ctx.fill();
      puntoDom.style.left=inicioPt.x+'px'; puntoDom.style.top=inicioPt.y+'px'; puntoDom.style.display='block';
      mascara=calcularMascara(); finPt=calcularFin(mascara,inicioPt); trazoPuntos=[];
    }
    function ir(d){var L=lista();idx=(idx+d+L.length)%L.length;guia();decir();}
    tb('<span aria-hidden="true">⬅️</span><span class="solo-lector">Anterior</span>',function(){ir(-1);}); tb('<span aria-hidden="true">🧽</span><span class="solo-lector">Borrar</span>',function(){guia();}); tb('<span aria-hidden="true">➡️</span><span class="solo-lector">Siguiente</span>',function(){ir(1);});
    tb('<span aria-hidden="true">✅</span><span class="solo-lector">Listo</span>',function(){
      var r=validarTrazo();
      registrarStat('trazado', r.nivel==='alto');
      if(r.nivel==='alto'){ sonidoGane(); hablar('¡Muy bien!'); if(!reduce()){var rc=wrap.getBoundingClientRect(); chispas(rc.left+rc.width/2,rc.top+rc.height/2);} setTimeout(function(){ir(1);},900); }
      else if(r.nivel==='medio'){ sonidoBien(); hablar('¡Muy bien! Probemos otra vez'); setTimeout(function(){guia();decir();},900); }
      else { sonidoBien(); hablar('¡Lo intentaste! Hagámoslo otra vez juntas'); setTimeout(function(){guia();decir();},900); }
    });
    tA.addEventListener('click',function(){setL='ABC';idx=0;tA.classList.add('sel');tN.classList.remove('sel');guia();decir();});
    tN.addEventListener('click',function(){setL='123';idx=0;tN.classList.add('sel');tA.classList.remove('sel');guia();decir();});
    function iniciar(){var w=wrap.clientWidth,h=wrap.clientHeight,dpr=window.devicePixelRatio||1;
      if(!w||!h){setTimeout(iniciar,50);return;}
      cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);ctx=cv.getContext('2d');ctx.scale(dpr,dpr);ctx.lineCap='round';ctx.lineJoin='round';
      W=w;H=h;guia();setTimeout(guia,300);
      var dib=false,lx=0,ly=0,gr=Math.max(16,Math.round(w*0.035));
      function pos(e){var r=cv.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
      function registrarPunto(p){ var u=trazoPuntos[trazoPuntos.length-1]; if(!u || distancia(u,p)>=4) trazoPuntos.push(p); }
      cv.addEventListener('pointerdown',function(e){dib=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}var p=pos(e);lx=p.x;ly=p.y;registrarPunto(p);ctx.fillStyle=color;ctx.beginPath();ctx.arc(lx,ly,gr/2,0,Math.PI*2);ctx.fill();});
      cv.addEventListener('pointermove',function(e){if(!dib)return;e.preventDefault();var p=pos(e);ctx.strokeStyle=color;ctx.lineWidth=gr;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(p.x,p.y);ctx.stroke();lx=p.x;ly=p.y;registrarPunto(p);});
      cv.addEventListener('pointerup',function(){dib=false;});cv.addEventListener('pointercancel',function(){dib=false;});cv.addEventListener('pointerleave',function(){dib=false;});
    }
    setTimeout(function(){iniciar();decir();},30);
  }

  /* ---------- PINTAR ---------- */
  function pintar(vistaInicial){
    pantallaBase(mundoCrear,{mundo:'crear'}); marcarActividad(vistaInicial==='galeria'?'Mi exposición':'Pintar');
    var modo='dibujar', figIdx=0, color='#FF4D4D', grosor=14, ultimoGrosor=14;
    var cont=document.createElement('div');cont.className='pintar';
    var tabs=document.createElement('div');tabs.className='tabs';
    var tDib=document.createElement('button');tDib.className='tab';tDib.type='button';tDib.innerHTML='<span aria-hidden="true">✏️</span> Pintar';
    var tCol=document.createElement('button');tCol.className='tab';tCol.type='button';tCol.innerHTML='<span aria-hidden="true">🖍️</span> Colorear';
    var tCrea=document.createElement('button');tCrea.className='tab';tCrea.type='button';tCrea.innerHTML='<span aria-hidden="true">🙂</span> Conmigo';
    var tGal=document.createElement('button');tGal.className='tab';tGal.type='button';tGal.innerHTML='<span aria-hidden="true">🖼️</span> Exposición';
    tabs.appendChild(tDib);tabs.appendChild(tCol);tabs.appendChild(tCrea);tabs.appendChild(tGal);
    var wrap=document.createElement('div');wrap.className='lienzo-wrap';
    var tools=document.createElement('div');tools.className='herramientas';
    cont.appendChild(tabs);cont.appendChild(wrap);cont.appendChild(tools);app.appendChild(cont);

    function paleta(){ var pal=['#FF4D4D','#FF9F45','#FFD23F','#4CC26B','#4D8BFF','#A66CFF','#FF7EC8','#A9744F','#333333'],arr=[];
      pal.forEach(function(hex){var t=document.createElement('button');t.className='tinta';t.type='button';t.style.background=hex;
        if(hex===color)t.classList.add('sel');
        t.addEventListener('click',function(){color=hex;if(modo==='dibujar')grosor=ultimoGrosor;arr.forEach(function(s){s.classList.remove('sel');});t.classList.add('sel');});
        arr.push(t);tools.appendChild(t);}); return arr; }
    function toolBtn(html,fn){var b=document.createElement('button');b.className='toolp';b.type='button';b.innerHTML=html;b.addEventListener('click',fn);tools.appendChild(b);return b;}
    /* Acciones que borran: piden un segundo toque (el botón tiembla y avisa). */
    function toolBtnDoble(html,fn){ var armado=false, b=toolBtn(html,function(){
      if(!armado){ armado=true; b.classList.add('armado'); animarTap(b,'mal',450); hablar('¿Borrar todo? Toca otra vez'); _setTimeout(function(){ armado=false; b.classList.remove('armado'); },3000); return; }
      armado=false; b.classList.remove('armado'); fn(); }); return b; }
    function limpiarBanner(){ var b=cont.querySelector('.crea-banner'); if(b) b.remove(); }

    function verDibujar(){
      limpiarBanner();
      modo='dibujar';tDib.classList.add('sel');tCol.classList.remove('sel');tCrea.classList.remove('sel');tGal.classList.remove('sel');
      wrap.style.cssText='';wrap.innerHTML='';tools.innerHTML='';
      var cv=document.createElement('canvas');wrap.appendChild(cv);
      var sw=paleta();
      var tams=[{v:6,d:8},{v:14,d:16},{v:26,d:26}],tb=[];
      tams.forEach(function(o){var b=document.createElement('button');b.className='tam';b.type='button';
        b.innerHTML='<span class="pt" style="width:'+o.d+'px;height:'+o.d+'px"></span>';
        if(o.v===grosor)b.classList.add('sel');
        b.addEventListener('click',function(){grosor=o.v;ultimoGrosor=o.v;tb.forEach(function(x){x.classList.remove('sel');});b.classList.add('sel');});
        tb.push(b);tools.appendChild(b);});
      toolBtn('<span aria-hidden="true">🧽</span><span class="solo-lector">Borrador</span>',function(){color='#FFFFFF';grosor=30;sw.forEach(function(s){s.classList.remove('sel');});});
      var ctx; function limpiar(){ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,cv.clientWidth,cv.clientHeight);}
      toolBtnDoble(ICO_LIMPIAR,function(){limpiar();hablar('Hoja limpia');});
      toolBtn(ICO_GUARDAR,function(ev){ try{ guardarEnExposicion(cv.toDataURL('image/png'),ev); }catch(e){} });
      function iniciar(){ var w=wrap.clientWidth,h=wrap.clientHeight,dpr=window.devicePixelRatio||1;
        if(!w||!h){setTimeout(iniciar,50);return;}
        cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);ctx=cv.getContext('2d');ctx.scale(dpr,dpr);ctx.lineCap='round';ctx.lineJoin='round';limpiar();
        var dib=false,lx=0,ly=0; function pos(e){var r=cv.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
        cv.addEventListener('pointerdown',function(e){dib=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}var p=pos(e);lx=p.x;ly=p.y;ctx.fillStyle=color;ctx.beginPath();ctx.arc(lx,ly,grosor/2,0,Math.PI*2);ctx.fill();});
        cv.addEventListener('pointermove',function(e){if(!dib)return;e.preventDefault();var p=pos(e);ctx.strokeStyle=color;ctx.lineWidth=grosor;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(p.x,p.y);ctx.stroke();lx=p.x;ly=p.y;});
        cv.addEventListener('pointerup',function(){dib=false;});cv.addEventListener('pointercancel',function(){dib=false;});cv.addEventListener('pointerleave',function(){dib=false;});
      } setTimeout(iniciar,30);
    }

    function verColorear(){
      limpiarBanner();
      modo='colorear';tCol.classList.add('sel');tDib.classList.remove('sel');tCrea.classList.remove('sel');tGal.classList.remove('sel');
      wrap.style.cssText='';wrap.innerHTML='';tools.innerHTML='';
      var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 200 200');
      function pintarFigura(){ svg.innerHTML=ESTILO_SVG+FIGURAS[figIdx].svg;
        var regs=svg.querySelectorAll('.region');
        for(var i=0;i<regs.length;i++){(function(el){ el.style.fill='#FFFFFF';
          el.addEventListener('click',function(){el.style.fill=color;}); })(regs[i]);} }
      pintarFigura(); wrap.appendChild(svg); paleta();
      toolBtn('<span aria-hidden="true">🔄</span><span class="solo-lector">Otra figura</span>',function(){figIdx=(figIdx+1)%FIGURAS.length;pintarFigura();hablar('Colorea la '+FIGURAS[figIdx].name);});
      toolBtnDoble(ICO_LIMPIAR,function(){var regs=svg.querySelectorAll('.region');for(var i=0;i<regs.length;i++)regs[i].style.fill='#FFFFFF';});
      toolBtn(ICO_GUARDAR,function(ev){ try{ var data=new XMLSerializer().serializeToString(svg); var img=new Image();
        img.onload=function(){var c=document.createElement('canvas');c.width=600;c.height=600;var cx=c.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,600,600);cx.drawImage(img,0,0,600,600);guardarEnExposicion(c.toDataURL('image/png'),ev);};
        img.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(data))); }catch(e){} });
      hablar('Colorea la '+FIGURAS[figIdx].name);
    }

    var PASOS_CREAR=[
      'Vamos a hacer una cara. Dibuja un círculo grande para la cabeza.',
      'Ahora pon dos ojos.','Ahora una nariz.','Ahora una boca sonriendo.','¡Ya casi! Agrega el pelo.'
    ];
    function verCrear(){
      limpiarBanner();
      modo='crear';tCrea.classList.add('sel');tDib.classList.remove('sel');tCol.classList.remove('sel');tGal.classList.remove('sel');
      wrap.style.cssText='';wrap.innerHTML='';tools.innerHTML='';
      var banner=document.createElement('div');banner.className='prompt crea-banner';
      cont.insertBefore(banner,wrap);
      var cv=document.createElement('canvas');wrap.appendChild(cv);
      var sw=paleta();
      var pasoIdx=0, ctx=null;
      function actualizarBanner(){ banner.innerHTML='<span class="sp">🔈</span><span>'+PASOS_CREAR[pasoIdx]+'</span>'; hablar(PASOS_CREAR[pasoIdx]); }
      banner.addEventListener('click',function(){hablar(PASOS_CREAR[pasoIdx]);});
      function limpiar(){ if(ctx){ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,cv.clientWidth,cv.clientHeight);} }
      var btnListo=toolBtn('<span aria-hidden="true">✅</span><span class="solo-lector">Listo, sigo</span>',function(){
        if(pasoIdx<PASOS_CREAR.length-1){ sonidoBien(); pasoIdx++; actualizarBanner(); }
        else { sonidoGane(); hablar('¡Mira tu dibujo! Qué bonito');
          if(!reduce()){ var r=btnListo.getBoundingClientRect(); chispas(r.left+r.width/2,r.top+r.height/2); }
          try{ var url=cv.toDataURL('image/png'); agregarAGaleria(url,function(){ desbloquear('crea_win'); }); }catch(e){}
          btnListo.disabled=true; btnListo.style.opacity='.5';
        }
      });
      toolBtnDoble(ICO_LIMPIAR,function(){ pasoIdx=0; limpiar(); actualizarBanner(); btnListo.disabled=false; btnListo.style.opacity='1'; });
      function iniciar(){ var w=wrap.clientWidth,h=wrap.clientHeight,dpr=window.devicePixelRatio||1;
        if(!w||!h){setTimeout(iniciar,50);return;}
        cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);ctx=cv.getContext('2d');ctx.scale(dpr,dpr);ctx.lineCap='round';ctx.lineJoin='round';limpiar();
        var dib=false,lx=0,ly=0,gr=14; function pos(e){var r=cv.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
        cv.addEventListener('pointerdown',function(e){dib=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}var p=pos(e);lx=p.x;ly=p.y;ctx.fillStyle=color;ctx.beginPath();ctx.arc(lx,ly,gr/2,0,Math.PI*2);ctx.fill();});
        cv.addEventListener('pointermove',function(e){if(!dib)return;e.preventDefault();var p=pos(e);ctx.strokeStyle=color;ctx.lineWidth=gr;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(p.x,p.y);ctx.stroke();lx=p.x;ly=p.y;});
        cv.addEventListener('pointerup',function(){dib=false;});cv.addEventListener('pointercancel',function(){dib=false;});cv.addEventListener('pointerleave',function(){dib=false;});
      }
      setTimeout(iniciar,30); actualizarBanner();
    }

    function verGaleria(){
      limpiarBanner();
      modo='galeria';tGal.classList.add('sel');tDib.classList.remove('sel');tCol.classList.remove('sel');tCrea.classList.remove('sel');
      tools.innerHTML=''; wrap.innerHTML=''; wrap.style.cssText='overflow-y:auto; align-items:flex-start; justify-content:flex-start;';
      var gal=cargarGaleria().slice().reverse();
      if(gal.length===0){
        var v=document.createElement('div');v.className='galeria-vacio';v.style.width='100%';
        v.innerHTML='<div class="vacio-ico" aria-hidden="true">🖼️</div>'; hablar('Aquí se cuelgan tus dibujos. Pinta algo y guárdalo.');
        wrap.appendChild(v);
      }else{
        var grid=document.createElement('div');grid.className='galeria-grid';
        gal.forEach(function(item){
          var b=document.createElement('button');b.type='button';b.className='galeria-item';
          var im=new Image(); im.alt='Dibujo'; im.src=item.url; b.appendChild(im);
          b.addEventListener('click',function(){ verImagen(item); });
          grid.appendChild(b);
        });
        wrap.appendChild(grid);
      }
    }
    function verImagen(item){
      var ov=document.createElement('div');ov.className='overlay';
      var card=document.createElement('div');card.className='overlay-card';
      var im2=new Image(); im2.alt='Dibujo'; im2.src=item.url; card.appendChild(im2);
      var btns=document.createElement('div');btns.className='overlay-btns';
      var bc=document.createElement('button');bc.className='btng';bc.style.background='var(--cielo)';bc.textContent='Cerrar';
      bc.addEventListener('click',function(){ov.remove();});
      var bd=document.createElement('button');bd.className='toolp';
      bd.innerHTML='🔒 Borrar (adultos)';
      bd.addEventListener('click',function(){ ov.remove(); puertaPadres(function(){
        guardarGaleria(cargarGaleria().filter(function(g){return g.id!==item.id;})); pintar('galeria'); },function(){ pintar('galeria'); }); });
      btns.appendChild(bc);btns.appendChild(bd);
      card.appendChild(btns);ov.appendChild(card);
      ov.addEventListener('click',function(e){ if(e.target===ov) ov.remove(); });
      document.body.appendChild(ov);
    }

    tDib.addEventListener('click',function(){if(modo!=='dibujar')verDibujar();});
    tCol.addEventListener('click',function(){if(modo!=='colorear')verColorear();});
    tCrea.addEventListener('click',function(){if(modo!=='crear')verCrear();});
    tGal.addEventListener('click',function(){if(modo!=='galeria')verGaleria();});
    if(vistaInicial==='galeria') verGaleria(); else if(vistaInicial==='colorear') verColorear(); else if(vistaInicial==='crear') verCrear(); else verDibujar();
  }
  function exposicion(){ pintar('galeria'); }

  var ICO_GUARDAR='<span aria-hidden="true">💾</span><span class="solo-lector">Guardar en mi exposición</span>';
  var ICO_LIMPIAR='<span aria-hidden="true">🗑️</span><span class="solo-lector">Limpiar (toca dos veces)</span>';
  /* Guarda en "Mi exposición" (no descarga archivos: eso lo hace un adulto al exportar). */
  function guardarEnExposicion(url,ev){
    agregarAGaleria(url,function(ok,motivo){
      if(ok){ sonidoBien(); if(!reduce()) chispas(ev&&ev.clientX?ev.clientX:window.innerWidth/2,ev&&ev.clientY?ev.clientY:window.innerHeight/2);
        hablar('¡Lo colgamos en tu exposición!'); reaccionCami(); }
      else { hablar('Tu exposición está llena. Pídele a un adulto que guarde algunos dibujos.'); }
    });
  }
  /* Cami (el camaleón) toma el color que elijas. */
  function reaccionCami(color){ var c=document.querySelector('#app .pj-cami'); if(!c) return; if(color) c.style.setProperty('--cami',color); animarPersonaje(c,'celebra'); }
