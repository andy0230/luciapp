  /* =====================================================================
     PERFILES (hasta 3 niños en el mismo iPad)
     Claves en localStorage (compatibles con la versión anterior):
       lucia_perfiles            → [{id:'0'|'1'|'2', nombre, avatar}]
       lucia_p{id}_{dato}        → datos de cada perfil (aislados por prefijo)
     Crear/editar/borrar perfiles se hace SOLO desde el panel de papás (con PIN).
     ===================================================================== */
  var AVATARES=['🌟','🦄','🐵','🐱','🐶','🦁','🐼','🐸','🦋','🐧','🐰','🦕','🐳','🐙','🐢'];
  var RANURAS=['0','1','2'];
  var DATOS_PERFIL=['niveles','config','completados','stats','explorado','stickers','adapt','limite','sesiones','galeria','ingles','descanso'];
  var perfilActual=null;
  function perfilValido(p){ return esObjeto(p) && RANURAS.indexOf(String(p.id))>=0 && typeof p.nombre==='string' && typeof p.avatar==='string'; }
  function limpiarNombre(n){ return String(n||'').replace(/[\u0000-\u001F<>]/g,'').trim().slice(0,14); }
  function cargarPerfiles(){
    var arr=leerJSON('lucia_perfiles',[],Array.isArray), vistos={}, out=[];
    arr.forEach(function(p){
      if(!perfilValido(p)) return; var id=String(p.id); if(vistos[id]) return; vistos[id]=true;
      out.push({id:id, nombre:limpiarNombre(p.nombre)||'Amiguito', avatar:AVATARES.indexOf(p.avatar)>=0?p.avatar:'🌟'});
    });
    return out;
  }
  function guardarPerfiles(arr){ escribir('lucia_perfiles',arr); }
  function claves(base){ return 'lucia_p'+(perfilActual==null?'0':perfilActual)+'_'+base; }
  function clavePerfil(id,base){ return 'lucia_p'+id+'_'+base; }
  /* Borra TODOS los datos de una ranura (evita que un perfil nuevo herede los de otro). */
  function borrarDatosPerfil(id){ DATOS_PERFIL.forEach(function(b){ try{ localStorage.removeItem(clavePerfil(id,b)); }catch(e){} }); }
  function migrarLegado(){
    // Versión muy antigua sin perfiles: se crea "Lucía" y se copia su progreso.
    var perfiles=cargarPerfiles();
    if(perfiles.length>0) return perfiles;
    var habiaAlgo=['lucia_completados','lucia_stats','lucia_galeria','lucia_explorado','lucia_stickers'].some(function(k){return localStorage.getItem(k)!==null;});
    perfiles=[{id:'0',nombre:'Lucía',avatar:'🌟'}];
    guardarPerfiles(perfiles);
    if(habiaAlgo){
      ['completados','stats','galeria','explorado','stickers'].forEach(function(base){
        var v=localStorage.getItem('lucia_'+base); if(v!==null && localStorage.getItem('lucia_p0_'+base)===null) escribir('lucia_p0_'+base,v);
      });
    }
    return perfiles;
  }
  function seleccionarPerfil(id){
    guardarSesionActual();
    perfilActual=String(id); cargarTodoPerfil();
    sesionInicio=Date.now(); sesionActividades={}; sesionAciertos=0; sesionIntentos=0;
    if(enDescanso()){ pantallaDescanso(); return; }
    iniciarVigilanciaLimite();
    inicio(true);
  }
  function cargarTodoPerfil(){ cargarConfigPerfil(); cargarProg(); cargarStats(); cargarExplorado(); cargarAdapt(); cargarLimite(); cargarIngles(); }

  function pantallaPerfiles(){
    guardarSesionActual();
    detenerVigilanciaLimite();
    pantallaBase(null,{mundo:'perfiles'});
    var perfiles=migrarLegado();
    var porId={}; perfiles.forEach(function(p){ porId[p.id]=p; });
    var cont=el('div',{clase:'perfiles'});
    var pj=personaje('lucia','contenta',110);
    cont.appendChild(pj);
    _setTimeout(function(){ animarPersonaje(pj.querySelector('svg'),'saluda'); },300);
    cont.appendChild(el('h1',{clase:'titulo',texto:'¿Quién va a jugar?'}));
    var grid=el('div',{clase:'perfilgrid'});
    var tonos=['var(--cielo-c)','var(--sol-c)','var(--coral-c)'];
    RANURAS.forEach(function(idSlot,i){
      var perfil=porId[idSlot];
      if(perfil){
        var b=el('button',{clase:'perfilcard stagger',attrs:{'aria-label':'Jugar como '+perfil.nombre}});
        b.style.setProperty('--pc',tonos[i]); b.style.animationDelay=(i*70)+'ms';
        b.appendChild(el('span',{clase:'pav',texto:perfil.avatar,attrs:{'aria-hidden':'true'}}));
        b.appendChild(el('span',{clase:'pnombre',texto:perfil.nombre}));
        b.addEventListener('click',function(){ sonidoTap(); hablar('¡Hola, '+perfil.nombre+'!'); seleccionarPerfil(perfil.id); });
        grid.appendChild(b);
      }
    });
    cont.appendChild(grid);
    if(perfiles.length<RANURAS.length){
      var nuevo=el('button',{clase:'link-adulto',html:'<span aria-hidden="true">🔒</span> Agregar jugador (adultos)',
        on:{click:function(){ puertaPadres(function(){ reportePapa('perfiles'); }); }}});
      cont.appendChild(nuevo);
    }
    if(!almacenamientoDisponible) cont.appendChild(bannerAlmacenamiento());
    app.appendChild(cont);
    _setTimeout(function(){ hablar('¿Quién va a jugar? Toca tu carita'); },400);
  }
  function bannerAlmacenamiento(){
    return el('div',{clase:'banner-adulto',attrs:{role:'note'},texto:'Este dispositivo no está guardando el progreso entre sesiones (vista previa o modo privado). Abre la app desde Safari o agrégala a la pantalla de inicio. En el panel de papás puedes exportar una copia.'});
  }

  /* Formulario de perfil (solo dentro del panel de papás). */
  function formularioPerfil(cont,id,existente,alGuardar){
    cont.innerHTML='';
    cont.appendChild(el('h3',{texto:existente?'Editar perfil':'Nuevo perfil'}));
    var avSel=existente?existente.avatar:AVATARES[rnd(AVATARES.length)];
    var ag=el('div',{clase:'avatargrid',attrs:{role:'radiogroup','aria-label':'Avatar'}});
    AVATARES.forEach(function(a){
      var op=el('button',{clase:'avatarop'+(a===avSel?' sel':''),texto:a,attrs:{role:'radio','aria-checked':String(a===avSel),'aria-label':'Avatar '+a}});
      op.addEventListener('click',function(){ avSel=a; Array.prototype.forEach.call(ag.children,function(x){x.classList.remove('sel');x.setAttribute('aria-checked','false');}); op.classList.add('sel'); op.setAttribute('aria-checked','true'); });
      ag.appendChild(op);
    });
    cont.appendChild(ag);
    var lab=el('label',{clase:'campo'},[el('span',{texto:'Nombre'})]);
    var inp=el('input',{attrs:{type:'text',maxlength:'14',autocomplete:'off',spellcheck:'false'}}); inp.value=existente?existente.nombre:'';
    lab.appendChild(inp); cont.appendChild(lab);
    cont.appendChild(el('button',{clase:'btn-adulto primario',texto:'Guardar',on:{click:function(){
      var nombre=limpiarNombre(inp.value)||'Amiguito';
      var arr=cargarPerfiles().filter(function(x){return x.id!==String(id);});
      if(!existente) borrarDatosPerfil(id);      // ranura limpia para el perfil nuevo
      arr.push({id:String(id),nombre:nombre,avatar:avSel}); arr.sort(function(a,b){return a.id<b.id?-1:1;});
      guardarPerfiles(arr); alGuardar();
    }}}));
  }
