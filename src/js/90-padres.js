  /* =====================================================================
     PARA PAPÁS — puerta con PIN de 4 dígitos + panel sobrio para adultos.
     El PIN se guarda con sal y hash (no en texto plano). Su objetivo es evitar
     que una niña de 3 años entre por accidente; NO es una protección contra un
     adulto con acceso al dispositivo (cualquiera puede borrar los datos del sitio).
     ===================================================================== */
  function hashPin(sal,pin){ var h=2166136261>>>0, s=sal+'|'+pin+'|lucia';
    for(var r=0;r<2000;r++){ for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619)>>>0; } s=h.toString(36)+s.slice(0,24); }
    return h.toString(36); }
  function pinGuardado(){ var p=ajustes.pin; return (typeof p==='string' && /^[a-z0-9]+:[a-z0-9]+$/.test(p)) ? p : null; }
  function verificarPin(pin){ var p=pinGuardado(); if(!p) return false; var x=p.split(':'); return hashPin(x[0],pin)===x[1]; }
  function fijarPin(pin){ var sal=Math.random().toString(36).slice(2,10)||'s'; ajustes.pin=sal+':'+hashPin(sal,pin); guardarAjustes(); }
  var _fallosPin=0, _bloqueoPinHasta=0;

  /* puertaPadres(alAbrir, alCancelar): teclado numérico en un diálogo. */
  function puertaPadres(alAbrir,alCancelar){
    var creando=!pinGuardado(), primero=null, valor='';
    var ov=el('div',{clase:'overlay puerta',attrs:{role:'dialog','aria-modal':'true','aria-labelledby':'puerta-t'}});
    var card=el('div',{clase:'overlay-card adulto puerta-card'});
    var tit=el('h2',{attrs:{id:'puerta-t'}}), sub=el('p',{clase:'puerta-sub'});
    var puntos=el('div',{clase:'pin-puntos',attrs:{'aria-hidden':'true'}},[el('i'),el('i'),el('i'),el('i')]);
    var msg=el('p',{clase:'pin-msg',attrs:{role:'alert'}});
    card.appendChild(tit); card.appendChild(sub); card.appendChild(puntos); card.appendChild(msg);
    var teclado=el('div',{clase:'pin-teclado'});
    ['1','2','3','4','5','6','7','8','9','','0','⌫'].forEach(function(k){
      if(!k){ teclado.appendChild(el('span')); return; }
      teclado.appendChild(el('button',{clase:'pin-tecla',texto:k,attrs:{'aria-label':k==='⌫'?'Borrar dígito':k},on:{click:function(){ tecla(k); }}}));
    });
    card.appendChild(teclado);
    var pie=el('div',{clase:'overlay-btns'});
    pie.appendChild(el('button',{clase:'btn-adulto',texto:'Cancelar',on:{click:function(){ cerrar(); if(alCancelar) alCancelar(); }}}));
    if(!creando) pie.appendChild(el('button',{clase:'btn-adulto link',texto:'¿Olvidaste el PIN?',on:{click:recuperar}}));
    card.appendChild(pie);
    ov.appendChild(card); document.body.appendChild(ov);
    function onKey(e){ if(/^[0-9]$/.test(e.key)) tecla(e.key); else if(e.key==='Backspace') tecla('⌫'); else if(e.key==='Escape'){ cerrar(); if(alCancelar) alCancelar(); } }
    document.addEventListener('keydown',onKey);
    function cerrar(){ document.removeEventListener('keydown',onKey); ov.remove(); }
    function textos(){
      if(creando){ tit.textContent=primero?'Repite el PIN':'Crea un PIN para adultos'; sub.textContent='4 dígitos. Lo pedirá cada vez que se entre a la zona de adultos.'; }
      else { tit.textContent='Zona de adultos'; sub.textContent='Escribe el PIN de 4 dígitos.'; }
    }
    function pintarPuntos(){ Array.prototype.forEach.call(puntos.children,function(p,i){ p.className=i<valor.length?'on':''; }); }
    function tecla(k){
      if(Date.now()<_bloqueoPinHasta){ msg.textContent='Espera unos segundos e inténtalo de nuevo.'; return; }
      if(k==='⌫'){ valor=valor.slice(0,-1); pintarPuntos(); return; }
      if(valor.length>=4) return;
      valor+=k; pintarPuntos();
      if(valor.length===4) _setTimeout(completo,120);
    }
    function completo(){
      if(creando){
        if(!primero){ primero=valor; valor=''; msg.textContent=''; textos(); pintarPuntos(); return; }
        if(primero!==valor){ primero=null; valor=''; msg.textContent='No coinciden. Empecemos de nuevo.'; textos(); pintarPuntos(); return; }
        fijarPin(valor); cerrar(); aviso('PIN creado'); alAbrir(); return;
      }
      if(verificarPin(valor)){ _fallosPin=0; cerrar(); alAbrir(); return; }
      _fallosPin++; valor=''; pintarPuntos(); animarTap(puntos,'mal',450);
      if(_fallosPin>=3){ _bloqueoPinHasta=Date.now()+30000; _fallosPin=0; msg.textContent='Demasiados intentos. Espera 30 segundos.'; }
      else msg.textContent='PIN incorrecto.';
    }
    /* Recuperación: exige escribir una frase (una niña que no lee no puede hacerlo).
       Solo quita el PIN; no borra ningún dato. */
    function recuperar(){
      card.innerHTML='';
      card.appendChild(el('h2',{texto:'Restablecer PIN'}));
      card.appendChild(el('p',{clase:'puerta-sub',texto:'Escribe exactamente: BORRAR PIN — se quitará el PIN (los datos no se borran) y podrás crear uno nuevo.'}));
      var inp=el('input',{attrs:{type:'text',autocomplete:'off','aria-label':'Frase de confirmación',autocapitalize:'characters'}});
      card.appendChild(el('label',{clase:'campo'},[inp]));
      var m2=el('p',{clase:'pin-msg',attrs:{role:'alert'}}); card.appendChild(m2);
      card.appendChild(el('div',{clase:'overlay-btns'},[
        el('button',{clase:'btn-adulto',texto:'Cancelar',on:{click:function(){ cerrar(); if(alCancelar) alCancelar(); }}}),
        el('button',{clase:'btn-adulto primario',texto:'Restablecer',on:{click:function(){
          if(inp.value.trim().toUpperCase()==='BORRAR PIN'){ ajustes.pin=null; guardarAjustes(); cerrar(); puertaPadres(alAbrir,alCancelar); }
          else m2.textContent='El texto no coincide.'; }}})
      ]));
      inp.focus();
    }
    textos();
    var t1=card.querySelector('.pin-tecla'); if(t1) t1.focus();
  }

  /* ---------- PANEL ---------- */
  var SECCIONES_PADRES=[
    {k:'resumen',t:'Resumen'},{k:'progreso',t:'Progreso'},{k:'ingles',t:'Inglés'},
    {k:'ajustes',t:'Ajustes'},{k:'perfiles',t:'Perfiles'},{k:'datos',t:'Datos'}
  ];
  function reportePapa(seccion){
    guardarSesionActual();
    var hayPerfil=perfilActual!=null;
    pantallaBase(hayPerfil?function(){ inicio(); }:pantallaPerfiles,{mundo:'padres'});
    document.body.classList.add('modo-papas');
    detenerEscuchaPadres();
    var cont=el('div',{clase:'padres'});
    var cab=el('header',{clase:'padres-cab'});
    cab.appendChild(el('h1',{texto:'Para papás'}));
    // selector de perfil
    var perfiles=cargarPerfiles();
    if(perfiles.length){
      var sel=el('div',{clase:'chips',attrs:{role:'group','aria-label':'Perfil'}});
      perfiles.forEach(function(p){
        sel.appendChild(el('button',{clase:'chip'+(String(p.id)===String(perfilActual)?' sel':''),texto:p.avatar+' '+p.nombre,attrs:{'aria-pressed':String(String(p.id)===String(perfilActual))},
          on:{click:function(){ cambiarPerfilAdulto(p.id); reportePapa(seccion); }}}));
      });
      cab.appendChild(sel);
    }
    cont.appendChild(cab);
    if(!almacenamientoDisponible) cont.appendChild(bannerAlmacenamiento());
    var nav=el('nav',{clase:'tabs-adulto',attrs:{'aria-label':'Secciones'}});
    var cuerpo=el('section',{clase:'padres-cuerpo'});
    seccion=seccion||'resumen';
    if(!hayPerfil && ['resumen','progreso','ingles'].indexOf(seccion)>=0) seccion='perfiles';
    SECCIONES_PADRES.forEach(function(s){
      nav.appendChild(el('button',{clase:'tab-a'+(s.k===seccion?' sel':''),texto:s.t,attrs:{'aria-current':s.k===seccion?'page':'false'},on:{click:function(){ reportePapa(s.k); }}}));
    });
    cont.appendChild(nav); cont.appendChild(cuerpo);
    cont.appendChild(el('button',{clase:'btn-adulto primario volver-juego',texto:hayPerfil?'Volver al juego':'Ir a ¿Quién va a jugar?',on:{click:function(){ document.body.classList.remove('modo-papas'); if(hayPerfil) inicio(); else pantallaPerfiles(); }}}));
    app.appendChild(cont);
    ({resumen:secResumen,progreso:secProgreso,ingles:secIngles,ajustes:secAjustes,perfiles:secPerfiles,datos:secDatos}[seccion]||secResumen)(cuerpo);
  }
  function detenerEscuchaPadres(){ if('speechSynthesis' in window){ try{ speechSynthesis.cancel(); }catch(e){} } }
  function cambiarPerfilAdulto(id){ guardarSesionActual(); perfilActual=String(id); cargarTodoPerfil(); sesionInicio=Date.now(); sesionActividades={}; sesionAciertos=0; sesionIntentos=0; }
  function tarjeta(titulo,hijos){ var c=el('div',{clase:'repfila'}); if(titulo) c.appendChild(el('h3',{texto:titulo})); (hijos||[]).forEach(function(h){ if(h) c.appendChild(h); }); return c; }
  function dato(n,lbl){ return el('div',{clase:'dato'},[el('b',{texto:String(n)}),el('span',{texto:lbl})]); }
  function nombrePerfil(){ var p=perfilActivo(); return p?p.nombre:''; }

  function secResumen(c){
    var ses=cargarSesiones(), hoy=fechaLocal();
    var minHoy=ses.filter(function(s){return s.fecha===hoy;}).reduce(function(a,s){return a+s.duracion;},0);
    var dias=[]; for(var i=6;i>=0;i--){ var d=fechaLocal(new Date(Date.now()-i*86400000)); dias.push({f:d,m:ses.filter(function(s){return s.fecha===d;}).reduce(function(a,s){return a+s.duracion;},0)}); }
    var min7=dias.reduce(function(a,d){return a+d.m;},0);
    var datos=el('div',{clase:'datos'},[dato(minHoy+' min','hoy'),dato(min7+' min','últimos 7 días'),dato(hechosVisibles()+'/'+nivelesVisibles().length,'retos'),dato(cargarStickers().length,'stickers'),dato(palabrasInglesVistas().length,'palabras en inglés')]);
    c.appendChild(tarjeta('Tiempo de uso de '+nombrePerfil(),[datos,graficoDias(dias)]));
    var fav=actividadesFavoritas(4);
    c.appendChild(tarjeta('Actividades favoritas',[ fav.length? el('ol',{clase:'lista'},fav.map(function(f){ return el('li',{texto:f.nombre+' ('+f.veces+')'}); })) : el('p',{clase:'repvacio',texto:'Aún no hay suficiente juego registrado.'}) ]));
    var sug=sugerenciasAdulto();
    c.appendChild(tarjeta('Para practicar juntos (sin pantalla)',[ el('ul',{clase:'lista'},sug.map(function(s){return el('li',{texto:s});})) ]));
    var rec=ses.slice().reverse().slice(0,6);
    c.appendChild(tarjeta('Sesiones recientes',[ rec.length? el('ul',{clase:'lista'},rec.map(function(s){ return el('li',{texto:formatoFecha(s.fecha)+' · '+s.duracion+' min · '+((s.actividades||[]).slice(0,5).join(', ')||'—')}); })) : el('p',{clase:'repvacio',texto:'Sin sesiones todavía.'}) ]));
  }
  function graficoDias(dias){
    var max=Math.max(10,Math.max.apply(null,dias.map(function(d){return d.m;})));
    var g=el('div',{clase:'grafico',attrs:{role:'img','aria-label':'Minutos por día, últimos 7 días: '+dias.map(function(d){return formatoFecha(d.f)+' '+d.m;}).join(', ')}});
    var nombres=['D','L','M','M','J','V','S'];
    dias.forEach(function(d){ var p=d.f.split('-'); var dt=new Date(+p[0],+p[1]-1,+p[2]);
      g.appendChild(el('div',{clase:'g-col'},[el('span',{clase:'g-v',texto:d.m?String(d.m):''}),el('i',{estilo:'height:'+Math.round(100*d.m/max)+'%'}),el('small',{texto:nombres[dt.getDay()]})])); });
    return g;
  }
  function sugerenciasAdulto(){
    var out=[], debil=categoriasPorReforzar()[0];
    if(debil) out.push('Jueguen a "'+debil+'" con objetos de la casa: nómbrenlos juntos.');
    var w=palabrasPorReforzar(2);
    if(w.length) out.push('Usen en el día estas palabras en inglés: '+w.map(function(x){return x.en+' ('+x.es+')';}).join(', ')+'.');
    out.push('Contar cosas reales hasta 5 (cucharas, zapatos, escalones).');
    out.push('Nombrar cómo se siente un personaje de un cuento antes de dormir.');
    return out.slice(0,4);
  }
  function categoriasPorReforzar(){
    return Object.keys(stats).filter(function(k){ var s=stats[k]; return s.ok+s.mal>=5 && s.ok/(s.ok+s.mal)<0.6; })
      .sort(function(a,b){ return stats[a].ok/(stats[a].ok+stats[a].mal)-stats[b].ok/(stats[b].ok+stats[b].mal); }).map(function(k){return CATLABEL[k]||k;});
  }

  function secProgreso(c){
    var desc=el('div',{clase:'reporte'});
    categorias.forEach(function(cat){ var n=explorado[cat.id]?Object.keys(explorado[cat.id]).length:0, t=TOTALES[cat.id];
      desc.appendChild(filaBarra(cat.ico+' '+cat.txt, n+' de '+t, n/t)); });
    c.appendChild(tarjeta('Descubrir: temas explorados',[desc]));
    var keys=Object.keys(stats).sort(function(a,b){ return (stats[b].ok+stats[b].mal)-(stats[a].ok+stats[a].mal); });
    var pr=el('div',{clase:'reporte'});
    keys.forEach(function(k){ var s=stats[k], tot=s.ok+s.mal, f=tot?s.ok/tot:0;
      var estado= tot<5?'Empezando a explorarlo' : f>=0.8?'Ya lo reconoce' : f>=0.6?'Lo está aprendiendo' : 'Conviene practicarlo más';
      pr.appendChild(filaBarra(CATLABEL[k]||k, estado+' · '+s.ok+' aciertos, '+s.mal+' intentos de práctica', f)); });
    c.appendChild(tarjeta('Juegos: cómo va',[ keys.length? pr : el('p',{clase:'repvacio',texto:'Todavía no hay datos de práctica.'}) ]));
    c.appendChild(tarjeta('Camino de retos',[ filaBarra('Retos ganados (dificultad '+configPerfil.dificultad+')', hechosVisibles()+' de '+nivelesVisibles().length, hechosVisibles()/nivelesVisibles().length) ]));
    var stk=cargarStickers();
    c.appendChild(tarjeta('Stickers ('+stk.length+' de '+Object.keys(STICKERS).length+')',[ el('p',{clase:'stk-lista',texto:stk.map(function(id){return STICKERS[id].emoji+' '+STICKERS[id].nombre;}).join(' · ')||'—'}) ]));
  }
  function filaBarra(t,detalle,f){ var d=el('div',{clase:'fila-barra'}); d.appendChild(el('div',{clase:'fb-t'},[el('b',{texto:t}),el('span',{texto:detalle})])); d.appendChild(barraProgreso(f,'var(--pasto)',t)); return d; }

  function secIngles(c){
    var vistas=palabrasInglesVistas(), aprendidas=palabrasAprendidas(), reforzar=palabrasPorReforzar(12);
    c.appendChild(tarjeta('English World',[ el('div',{clase:'datos'},[dato(vistas.length,'palabras descubiertas'),dato(aprendidas.length,'reconoce'),dato(reforzar.length,'por reforzar'),dato(ENGLISH_TODAS.length,'en total')]) ]));
    var porCat=el('div',{clase:'reporte'});
    ENGLISH.categorias.forEach(function(cat){ var v=cat.palabras.filter(function(p){return progIngles.palabras[p.id];}).length;
      porCat.appendChild(filaBarra(cat.ico+' '+cat.en+' — '+cat.es, v+' de '+cat.palabras.length, v/cat.palabras.length)); });
    c.appendChild(tarjeta('Por tema',[porCat]));
    function listaPal(arr){ return arr.length? el('p',{clase:'stk-lista',texto:arr.map(function(p){return p.e+' '+p.en+' ('+p.es+')';}).join(' · ')}) : el('p',{clase:'repvacio',texto:'—'}); }
    c.appendChild(tarjeta('Ya las reconoce',[listaPal(aprendidas)]));
    c.appendChild(tarjeta('Para reforzar (aparecerán más seguido)',[listaPal(reforzar)]));
    c.appendChild(tarjeta('Cómo enseñamos',[ el('ul',{clase:'lista'},ENGLISH.metodologia.map(function(m){return el('li',{texto:m});})) ]));
  }

  function secAjustes(c){
    function interruptor(t,desc,val,cb){ var id='sw'+Math.random().toString(36).slice(2,7);
      var inp=el('input',{attrs:{type:'checkbox',id:id,role:'switch'}}); inp.checked=!!val; inp.addEventListener('change',function(){ cb(inp.checked); });
      return el('div',{clase:'ajuste'},[el('label',{attrs:{for:id}},[el('b',{texto:t}),desc?el('span',{texto:desc}):null]),inp]); }
    function opciones(t,desc,ops,actual,cb){ var g=el('div',{clase:'chips',attrs:{role:'radiogroup','aria-label':t}});
      ops.forEach(function(o){ var b=el('button',{clase:'chip'+(o.v===actual?' sel':''),texto:o.t,attrs:{role:'radio','aria-checked':String(o.v===actual)},on:{click:function(){ Array.prototype.forEach.call(g.children,function(x){x.classList.remove('sel');x.setAttribute('aria-checked','false');}); b.classList.add('sel'); b.setAttribute('aria-checked','true'); cb(o.v); }}}); g.appendChild(b); });
      return el('div',{clase:'ajuste col'},[el('div',{},[el('b',{texto:t}),desc?el('span',{texto:desc}):null]),g]); }
    c.appendChild(tarjeta('Sonido y voz',[
      interruptor('Voz y sonido','Apaga todo el audio de la app.',ajustes.sonido,function(v){ ajustes.sonido=sonido=v; guardarAjustes(); actualizarBtnSon(); }),
      interruptor('Efectos de sonido','Pitidos de acierto, burbujas, etc.',ajustes.efectos,function(v){ ajustes.efectos=v; guardarAjustes(); }),
      opciones('Velocidad de la voz',null,[{v:0.75,t:'Lenta'},{v:0.9,t:'Normal'},{v:1.05,t:'Rápida'}],ajustes.velocidadVoz,function(v){ ajustes.velocidadVoz=v; guardarAjustes(); hablar('Así hablo ahora'); }),
      el('p',{clase:'nota',texto:'Las voces son las del propio dispositivo (sin internet). En iPad puedes descargar voces de mejor calidad en Ajustes › Accesibilidad › Contenido leído › Voces (español e inglés).'})
    ]));
    c.appendChild(tarjeta('Idioma',[
      interruptor('Mostrar inglés en Descubrir','Cada tarjeta muestra y dice también la palabra en inglés. (Botón ES/EN arriba a la derecha.)',modoBilingue,function(v){ modoBilingue=v; guardarBilingue(); actualizarBtnIdioma(); })
    ]));
    if(perfilActual!=null){
      c.appendChild(tarjeta('Para '+nombrePerfil(),[
        opciones('Dificultad',"Fácil: 3 opciones. Normal: hasta 4 (recomendado a los 3 años). Reto: todos los niveles y juegos originales.",[{v:'facil',t:'Fácil'},{v:'normal',t:'Normal'},{v:'reto',t:'Reto'}],configPerfil.dificultad,function(v){ configPerfil.dificultad=v; guardarConfigPerfil(); }),
        opciones('Límite de tiempo por sesión','Al llegar, una pantalla amable invita a descansar 45 min (aviso 2 min antes). No se muestra cronómetro.',[{v:0,t:'Sin límite'},{v:10,t:'10 min'},{v:15,t:'15 min'},{v:20,t:'20 min'},{v:30,t:'30 min'}],limiteSesion,function(v){ limiteSesion=v; guardarLimite(); limiteMostrado=false; }),
        enDescanso()? el('button',{clase:'btn-adulto',texto:'Terminar el descanso ahora',on:{click:function(){ levantarDescanso(); aviso('Descanso terminado'); reportePapa('ajustes'); }}}) : null
      ]));
    }
    c.appendChild(tarjeta('Micrófono en "Repeat with me" (opcional)',[
      interruptor('Permitir que Lucía use el micrófono','Apagado por defecto. Nunca se guarda audio. Aviso de privacidad: en Safari y Chrome el reconocimiento de voz puede procesarse en servidores de Apple o Google. La app solo compara el texto reconocido con la palabra y lo descarta.',ajustes.mic,function(v){ ajustes.mic=v; guardarAjustes(); }),
      el('p',{clase:'nota',texto:micDisponible()?'Este navegador permite reconocimiento de voz.':'Este navegador no ofrece reconocimiento de voz: el juego funcionará solo escuchando y repitiendo.'})
    ]));
    c.appendChild(tarjeta('PIN de adultos',[
      el('button',{clase:'btn-adulto',texto:'Cambiar PIN',on:{click:function(){ ajustes.pin=null; guardarAjustes(); puertaPadres(function(){ reportePapa('ajustes'); },function(){ reportePapa('ajustes'); }); }}})
    ]));
    c.appendChild(el('p',{clase:'nota',texto:'Versión '+VERSION_APP+' · Todo se guarda solo en este dispositivo.'}));
  }

  function secPerfiles(c){
    var perfiles=cargarPerfiles(), porId={}; perfiles.forEach(function(p){porId[p.id]=p;});
    var form=el('div',{clase:'repfila form-perfil'}); form.style.display='none';
    RANURAS.forEach(function(id){
      var p=porId[id];
      if(p){
        c.appendChild(tarjeta(null,[ el('div',{clase:'perfil-fila'},[
          el('span',{clase:'pf-av',texto:p.avatar,attrs:{'aria-hidden':'true'}}), el('b',{texto:p.nombre}),
          el('button',{clase:'btn-adulto',texto:'Editar',on:{click:function(){ form.style.display=''; formularioPerfil(form,id,p,function(){ reportePapa('perfiles'); }); form.scrollIntoView({block:'center'}); }}}),
          el('button',{clase:'btn-adulto peligro',texto:'Borrar',on:{click:function(){
            confirmar('¿Borrar el perfil de '+p.nombre+' y TODO su progreso, stickers y dibujos? No se puede deshacer (exporta una copia antes si quieres).','Borrar perfil',function(){
              borrarDatosPerfil(id); guardarPerfiles(cargarPerfiles().filter(function(x){return x.id!==id;}));
              if(String(perfilActual)===id){ perfilActual=null; }
              aviso('Perfil borrado'); reportePapa('perfiles'); }); }}})
        ]) ]));
      }
    });
    var libre=RANURAS.filter(function(id){return !porId[id];})[0];
    if(libre!=null) c.appendChild(el('button',{clase:'btn-adulto primario',texto:'+ Agregar jugador',on:{click:function(){ form.style.display=''; formularioPerfil(form,libre,null,function(){ reportePapa('perfiles'); }); }}}));
    else c.appendChild(el('p',{clase:'nota',texto:'Máximo 3 perfiles.'}));
    c.appendChild(form);
  }

  /* ---------- DATOS: exportar, importar, reiniciar ---------- */
  function clavesApp(){ var r=[]; try{ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(k && k.indexOf('lucia_')===0) r.push(k); } }catch(e){} return r; }
  function exportarDatos(){
    var datos={}; clavesApp().forEach(function(k){ datos[k]=localStorage.getItem(k); });
    var paquete={app:'lucia-aprende-jugando',formato:1,version:VERSION_APP,fecha:new Date().toISOString(),datos:datos};
    var blob=new Blob([JSON.stringify(paquete)],{type:'application/json'});
    var url=URL.createObjectURL(blob), a=el('a',{attrs:{href:url,download:'lucia-respaldo-'+fechaLocal()+'.json'}});
    document.body.appendChild(a); a.click(); a.remove(); _setTimeout(function(){ URL.revokeObjectURL(url); },4000);
    aviso('Respaldo descargado');
  }
  var CLAVE_VALIDA=/^lucia_(perfiles|bilingue|ajustes|completados|stats|galeria|explorado|stickers|p[012]_(niveles|config|completados|stats|explorado|stickers|adapt|limite|sesiones|galeria|ingles|descanso))$/;
  function importarDatos(archivo,cb){
    if(!archivo || archivo.size>15*1024*1024){ cb('El archivo no es válido o es demasiado grande.'); return; }
    var lector=new FileReader();
    lector.onload=function(){
      var p; try{ p=JSON.parse(String(lector.result)); }catch(e){ cb('El archivo no es un respaldo de Lucía.'); return; }
      if(!esObjeto(p) || p.app!=='lucia-aprende-jugando' || !esObjeto(p.datos)){ cb('El archivo no es un respaldo de Lucía.'); return; }
      var claves=Object.keys(p.datos).filter(function(k){ return CLAVE_VALIDA.test(k) && typeof p.datos[k]==='string' && p.datos[k].length<5*1024*1024; });
      if(!claves.length){ cb('El respaldo no contiene datos.'); return; }
      confirmar('Se reemplazará el progreso actual de este dispositivo por el del respaldo ('+claves.length+' datos, del '+String(p.fecha||'').slice(0,10)+'). ¿Continuar?','Importar',function(){
        var previas=clavesApp(), copia={}; previas.forEach(function(k){ copia[k]=localStorage.getItem(k); });
        try{
          previas.forEach(function(k){ if(k!=='lucia_ajustes') localStorage.removeItem(k); });
          claves.forEach(function(k){ if(k==='lucia_ajustes') return; localStorage.setItem(k,p.datos[k]); });
          cb(null);
        }catch(e){ // si falla (cuota), se restaura lo anterior
          try{ clavesApp().forEach(function(k){ localStorage.removeItem(k); }); Object.keys(copia).forEach(function(k){ localStorage.setItem(k,copia[k]); }); }catch(e2){}
          cb('No hay espacio suficiente para importar. No se cambió nada.');
        }
      });
    };
    lector.onerror=function(){ cb('No se pudo leer el archivo.'); };
    lector.readAsText(archivo);
  }
  function secDatos(c){
    c.appendChild(tarjeta('Respaldo',[
      el('p',{clase:'nota',texto:'Descarga un archivo con perfiles, progreso, stickers, palabras en inglés y dibujos. Sirve para pasar el progreso a otro dispositivo o a la versión publicada (GitHub Pages).'}),
      el('button',{clase:'btn-adulto primario',texto:'Exportar progreso',on:{click:exportarDatos}})
    ]));
    var inp=el('input',{attrs:{type:'file',accept:'application/json,.json','aria-label':'Archivo de respaldo'}});
    var msg=el('p',{clase:'pin-msg',attrs:{role:'status'}});
    inp.addEventListener('change',function(){ importarDatos(inp.files&&inp.files[0],function(err){ if(err){ msg.textContent=err; } else { perfilActual=null; aviso('Progreso importado'); pantallaPerfiles(); } inp.value=''; }); });
    c.appendChild(tarjeta('Importar un respaldo',[ el('p',{clase:'nota',texto:'Reemplaza los datos de este dispositivo. Los ajustes y el PIN actuales se conservan.'}), inp, msg ]));
    if(perfilActual!=null){
      c.appendChild(tarjeta('Reiniciar a '+nombrePerfil(),[
        el('p',{clase:'nota',texto:'Borra retos, stickers, estadísticas, temas explorados y palabras en inglés SOLO de este perfil. Los dibujos de la exposición se conservan.'}),
        el('button',{clase:'btn-adulto peligro',texto:'Reiniciar progreso del perfil',on:{click:function(){
          confirmar('¿Reiniciar el progreso de '+nombrePerfil()+'? Los dibujos se conservan.','Reiniciar',function(){
            ['niveles','completados','stats','explorado','stickers','adapt','sesiones','ingles','descanso'].forEach(function(b){ try{ localStorage.removeItem(claves(b)); }catch(e){} });
            cargarTodoPerfil(); aviso('Progreso reiniciado'); reportePapa('datos'); }); }}})
      ]));
    }
    c.appendChild(tarjeta('Borrar todo',[
      el('p',{clase:'nota',texto:'Elimina todos los perfiles, el progreso, los dibujos, los ajustes y el PIN de este dispositivo.'}),
      el('button',{clase:'btn-adulto peligro',texto:'Borrar toda la información',on:{click:function(){
        confirmar('¿Eliminar TODA la información de la app en este dispositivo? No se puede deshacer.','Eliminar todo',function(){
          clavesApp().forEach(function(k){ try{ localStorage.removeItem(k); }catch(e){} });
          ajustes=JSON.parse(JSON.stringify(AJUSTES_DEF)); sonido=true; perfilActual=null; pantallaPerfiles(); }); }}})
    ]));
    c.appendChild(tarjeta('Privacidad',[ el('ul',{clase:'lista'},[
      'Todo se guarda solo en este dispositivo (almacenamiento local del navegador).',
      'Sin publicidad, sin rastreadores, sin cuentas y sin conexión a servidores.',
      'No se graban ni guardan voces. El micrófono es opcional y está apagado por defecto.',
      'Solo se pide el nombre (o apodo) del niño; no se piden otros datos personales.'
    ].map(function(t){return el('li',{texto:t});})) ]));
  }
