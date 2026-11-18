  /* =====================================================================
     PROGRESO: estadísticas (para papás), dificultad adaptativa, sesiones,
     tiempo de pantalla, descanso y galería de dibujos.
     ===================================================================== */
  var CATLABEL={color:'Colores',fruta:'Frutas',animal:'Animales',trans:'Transporte',comida:'Comida',cuerpo:'Cuerpo',vocal:'Vocales',numero:'Números',num20:'Números grandes',forma:'Formas',emo:'Emociones',contar:'Contar',memoria:'Memoria',sonidos:'Busca el animal',patrones:'¿Qué sigue? (patrones)',historia:'Ordena la historia',clasifica:'Clasificar',igualdif:'Igual o diferente',instrucciones:'Sigue la instrucción',emosit:'Emociones en situaciones',trazado:'Trazado',rompecabezas:'Rompecabezas',encaja:'Encaja la forma',burbujas:'Burbujas',musica:'Música',ingles:'English World'};
  var stats={};
  function cargarStats(){ stats=leerJSON(claves('stats'),{},esObjeto);
    Object.keys(stats).forEach(function(k){ var s=stats[k]; if(!esObjeto(s)||typeof s.ok!=='number'||typeof s.mal!=='number'){ delete stats[k]; } }); }
  function guardarStats(){ escribir(claves('stats'),stats); }
  function prefijoDe(id){ return String(id).replace(/_?\d+$/,''); }
  var intentosTotales=0;
  function registrarStat(cat,bien){ if(!cat||perfilActual==null)return; if(!stats[cat]) stats[cat]={ok:0,mal:0}; stats[cat][bien?'ok':'mal']++; guardarStats();
    sesionIntentos++; if(bien) sesionAciertos++;
    intentosTotales++; if(intentosTotales===20) desbloquear('intentos_20');
    if(!bien) reaccionPersonaje(false);
  }

  /* ---------- DIFICULTAD ADAPTATIVA ----------
     Tres seguidos bien sube el nivel interno; dos seguidos mal lo baja. Nunca se muestra. */
  var adapt={};
  function cargarAdapt(){ adapt=leerJSON(claves('adapt'),{},esObjeto); Object.keys(adapt).forEach(function(k){ if(!esObjeto(adapt[k])||typeof adapt[k].n!=='number') delete adapt[k]; }); }
  function guardarAdapt(){ escribir(claves('adapt'),adapt); }
  function registrarAdaptativo(cat,bien,min,max,tiempoMs){
    if(!adapt[cat]) adapt[cat]={n:min,racha:0,intentos:0,aciertos:0,tiempos:[]};
    var a=adapt[cat]; a.intentos=(a.intentos||0)+1; if(bien) a.aciertos=(a.aciertos||0)+1;
    if(!Array.isArray(a.tiempos)) a.tiempos=[];
    if(typeof tiempoMs==='number'){ a.tiempos.push(tiempoMs); if(a.tiempos.length>5) a.tiempos.shift(); }
    var promedio = a.tiempos.length? a.tiempos.reduce(function(s,v){return s+v;},0)/a.tiempos.length : 0;
    var lento = a.tiempos.length>=2 && promedio>9000;
    if(bien && !lento){ a.racha=(a.racha>=0?a.racha+1:1); if(a.racha>=3 && a.n<max){a.n++; a.racha=0;} }
    else if(bien && lento){ a.racha=0; }
    else { a.racha=(a.racha<=0?a.racha-1:-1); if(a.racha<=-2 && a.n>min){a.n--; a.racha=0;} }
    // En dificultad "facil" el motor nunca pasa del primer escalón.
    if(configPerfil.dificultad==='facil') a.n=Math.min(a.n,min);
    guardarAdapt();
  }
  function nivelAdapt(cat,tope){ var a=adapt[cat]; var n=a?a.n:0; if(configPerfil.dificultad==='facil') n=0; return Math.min(n,tope); }

  /* ---------- SESIÓN ACTUAL ---------- */
  var sesionInicio=Date.now();
  var sesionActividades={}, sesionAciertos=0, sesionIntentos=0;
  function minutosSesion(){ return Math.max(0,Math.round((Date.now()-sesionInicio)/60000)); }
  function marcarActividad(nombre){ sesionActividades[nombre]=(sesionActividades[nombre]||0)+1; }

  /* ---------- LÍMITE DE TIEMPO (lo configura un adulto) ----------
     Corrección: antes el límite se saltaba tocando "Salir" y volviendo a entrar. Ahora al
     cumplirse se guarda un "descanso" de 45 min para ese perfil; solo un adulto (con PIN)
     puede levantarlo antes. Aviso amable 2 min antes del final. */
  var limiteSesion=0, limiteMostrado=false, avisoPrevio=false, intervaloLimite=null;
  var DESCANSO_MIN=45;
  function cargarLimite(){ var v=parseInt(localStorage.getItem(claves('limite')),10); limiteSesion=(isNaN(v)||v<0||v>180)?0:v; }
  function guardarLimite(){ escribir(claves('limite'),String(limiteSesion)); }
  function enDescanso(){ var t=parseInt(localStorage.getItem(claves('descanso')),10); return !isNaN(t) && Date.now()-t < DESCANSO_MIN*60000 && Date.now()>=t; }
  function levantarDescanso(){ try{ localStorage.removeItem(claves('descanso')); }catch(e){} }
  function detenerVigilanciaLimite(){ if(intervaloLimite){ window.clearInterval(intervaloLimite); intervaloLimite=null; } }
  function iniciarVigilanciaLimite(){
    limiteMostrado=false; avisoPrevio=false; detenerVigilanciaLimite();
    intervaloLimite=window.setInterval(function(){
      guardarSesionActual();
      if(limiteSesion>0 && !limiteMostrado){
        var m=(Date.now()-sesionInicio)/60000;
        if(!avisoPrevio && m>=limiteSesion-2 && limiteSesion>2){ avisoPrevio=true; hablar('Pronto vamos a descansar. Termina tu juego.','es',{encolar:true}); }
        if(m>=limiteSesion){ limiteMostrado=true; escribir(claves('descanso'),String(Date.now())); pantallaDescanso(); }
      }
    },15000);
  }
  function pantallaDescanso(){
    guardarSesionActual(); detenerVigilanciaLimite();
    pantallaBase(null,{mundo:'descanso'});
    var f=el('div',{clase:'fiesta descanso'});
    f.appendChild(el('div',{clase:'luna',attrs:{'aria-hidden':'true'},texto:'🌙'}));
    var pj=personaje('lucia','feliz',130); f.appendChild(pj);
    f.appendChild(el('h2',{texto:'¡Qué lindo jugamos hoy!'}));
    f.appendChild(el('p',{clase:'fiesta-sub',texto:'Ahora descansamos los ojitos. Podemos estirarnos, tomar agua o jugar afuera.'}));
    var btns=el('div',{clase:'btns'});
    btns.appendChild(el('button',{clase:'btng primario',html:'<span aria-hidden="true">👋</span> Hasta luego',on:{click:function(){ pantallaPerfiles(); }}}));
    f.appendChild(btns);
    f.appendChild(el('button',{clase:'link-adulto',html:'<span aria-hidden="true">🔒</span> Adultos',on:{click:function(){ puertaPadres(function(){ reportePapa(); }); }}}));
    app.appendChild(f);
    hablar('¡Qué lindo jugamos hoy! Ahora es hora de descansar los ojitos.');
    _setTimeout(function(){ animarPersonaje(pj.querySelector('svg'),'saluda'); },500);
  }

  /* ---------- HISTORIAL DE SESIONES (últimas 60 por perfil) ---------- */
  function cargarSesiones(){ return leerJSON(claves('sesiones'),[],Array.isArray).filter(function(r){ return esObjeto(r) && typeof r.fecha==='string' && typeof r.duracion==='number'; }); }
  function guardarSesiones(arr){ escribir(claves('sesiones'),arr); }
  function guardarSesionActual(){
    if(perfilActual==null) return;
    if(minutosSesion()<1 && Object.keys(sesionActividades).length===0) return;
    var arr=cargarSesiones();
    var registro={fecha:fechaLocal(), inicioMs:sesionInicio,
      duracion:minutosSesion(), actividades:Object.keys(sesionActividades), conteo:sesionActividades, aciertos:sesionAciertos, intentos:sesionIntentos};
    if(arr.length && arr[arr.length-1].inicioMs===sesionInicio){ arr[arr.length-1]=registro; }
    else { arr.push(registro); if(arr.length>60) arr=arr.slice(arr.length-60); }
    guardarSesiones(arr);
    var dias={}; arr.forEach(function(r){ dias[r.fecha]=true; });
    if(Object.keys(dias).length>=3) desbloquear('racha_3dias');
  }
  function formatoFecha(f){
    var hoy=fechaLocal(), ayerD=fechaLocal(new Date(Date.now()-86400000));
    if(f===hoy) return 'Hoy'; if(f===ayerD) return 'Ayer';
    var p=String(f).split('-'); return p.length===3? (p[2]+'/'+p[1]+'/'+p[0]) : f;
  }
  /* Actividades favoritas (las más repetidas en el historial). */
  function actividadesFavoritas(n){
    var c={}; cargarSesiones().forEach(function(s){ (s.actividades||[]).forEach(function(a){ var v=(s.conteo&&s.conteo[a])||1; c[a]=(c[a]||0)+v; }); });
    return Object.keys(c).sort(function(a,b){return c[b]-c[a];}).slice(0,n||3).map(function(k){return {nombre:k,veces:c[k]};});
  }

  /* ---------- GALERÍA DE DIBUJOS ----------
     Miniaturas JPEG de 320 px (≈15–25 KB). Solo se aceptan data:image/(png|jpeg). Si el
     almacenamiento se llena NO se borran dibujos en silencio: se avisa al adulto. */
  var MAX_GALERIA=30;
  function urlImagenValida(u){ return typeof u==='string' && /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(u) && u.length<400000; }
  function cargarGaleria(){ return leerJSON(claves('galeria'),[],Array.isArray).filter(function(g){ return esObjeto(g) && urlImagenValida(g.url); }); }
  function guardarGaleria(arr){ return escribir(claves('galeria'),arr); }
  function agregarAGaleria(dataURL,cb){
    try{ var img=new Image();
      img.onload=function(){
        var S=320, c=document.createElement('canvas'); c.width=S;c.height=S; var cx=c.getContext('2d');
        cx.fillStyle='#fff'; cx.fillRect(0,0,S,S);
        var e=Math.min(S/img.width,S/img.height), w=img.width*e, h=img.height*e;
        cx.drawImage(img,(S-w)/2,(S-h)/2,w,h);
        var gal=cargarGaleria(); gal.push({id:Date.now(),url:c.toDataURL('image/jpeg',0.82),fecha:fechaLocal()});
        var lleno=gal.length>MAX_GALERIA;
        if(lleno){ if(cb) cb(false,'lleno'); return; }
        if(!guardarGaleria(gal)){ if(cb) cb(false,'cuota'); return; }
        if(gal.length>=5) desbloquear('artista_5'); if(cb)cb(true);
      };
      img.onerror=function(){ if(cb)cb(false); };
      img.src=dataURL;
    }catch(e){ if(cb)cb(false); }
  }
