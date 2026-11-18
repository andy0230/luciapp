  /* ---------- DATOS ---------- */
  var COLS=['var(--coral)','var(--sol)','var(--pasto)','var(--cielo)','var(--uva)','var(--chicle)'];
  var vocales=[
    {l:'A',ej:[{e:'🐝',w:'abeja'},{e:'🌳',w:'árbol'},{e:'✈️',w:'avión'},{e:'🕷️',w:'araña'}]},
    {l:'E',ej:[{e:'🐘',w:'elefante'},{e:'⭐',w:'estrella'},{e:'🧹',w:'escoba'},{e:'🦔',w:'erizo'}]},
    {l:'I',ej:[{e:'🦎',w:'iguana'},{e:'🛖',w:'iglú'},{e:'🧲',w:'imán'},{e:'🏝️',w:'isla'}]},
    {l:'O',ej:[{e:'🐻',w:'oso'},{e:'👁️',w:'ojo'},{e:'🐑',w:'oveja'},{e:'👂',w:'oreja'}]},
    {l:'U',ej:[{e:'🍇',w:'uvas'},{e:'🦄',w:'unicornio'},{e:'💅',w:'uña'},{e:'1️⃣',w:'uno'}]}
  ];
  vocales.forEach(function(v){ v.say='La '+v.l+'. de '+v.ej.map(function(x){return x.w;}).join(', '); });
  var palabras=['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte'];
  var palabrasEN=['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
  var numeros=[]; for(var i=1;i<=20;i++) numeros.push({n:i,say:palabras[i],en:palabrasEN[i]});
  var numJuego=numeros.slice(0,10);
  var colores=[
    {name:'rojo',hex:'#FF4D4D',en:'red'},{name:'azul',hex:'#4D8BFF',en:'blue'},{name:'amarillo',hex:'#FFD23F',en:'yellow'},
    {name:'verde',hex:'#4CC26B',en:'green'},{name:'naranja',hex:'#FF9F45',en:'orange'},{name:'morado',hex:'#A66CFF',en:'purple'},
    {name:'rosado',hex:'#FF7EC8',en:'pink'},{name:'café',hex:'#A9744F',en:'brown'},{name:'gris',hex:'#9AA0A6',en:'gray'},
    {name:'turquesa',hex:'#2EC4B6',en:'turquoise'},{name:'celeste',hex:'#8AD4FF',en:'sky blue'},{name:'dorado',hex:'#E6B422',en:'gold'},
    {name:'blanco',hex:'#FFFFFF',en:'white'},{name:'negro',hex:'#333333',en:'black'},
    {name:'violeta',hex:'#8B5CF6',en:'violet'},{name:'beige',hex:'#E8DCC8',en:'beige'},{name:'vinotinto',hex:'#7B1E3A',en:'maroon'}
  ];
  var formas=[
    {name:'círculo',cls:'sh-circulo',color:'var(--cielo)',en:'circle'},{name:'cuadrado',cls:'sh-cuadrado',color:'var(--pasto)',en:'square'},
    {name:'rectángulo',cls:'sh-rectangulo',color:'var(--sol)',en:'rectangle'},{name:'triángulo',cls:'sh-triangulo',color:'var(--coral)',en:'triangle'},
    {name:'rombo',cls:'sh-rombo',color:'var(--uva)',en:'diamond'},{name:'óvalo',cls:'sh-ovalo',color:'var(--chicle)',en:'oval'},
    {name:'estrella',emoji:'⭐',en:'star'},{name:'corazón',emoji:'❤️',en:'heart'},{name:'media luna',emoji:'🌙',en:'crescent moon'},
    {name:'octágono',emoji:'🛑',en:'octagon'},{name:'cruz',emoji:'➕',en:'cross'}
  ];
  var frutas=[
    {e:'🍎',name:'manzana',en:'apple'},{e:'🍌',name:'banano',en:'banana'},{e:'🍓',name:'fresa',en:'strawberry'},{e:'🍇',name:'uvas',en:'grapes'},
    {e:'🍊',name:'naranja',en:'orange'},{e:'🍉',name:'sandía',en:'watermelon'},{e:'🍍',name:'piña',en:'pineapple'},{e:'🥭',name:'mango',en:'mango'},
    {e:'🥝',name:'kiwi',en:'kiwi'},{e:'🍐',name:'pera',en:'pear'},{e:'🍒',name:'cerezas',en:'cherries'},{e:'🍑',name:'durazno',en:'peach'},
    {e:'🍋',name:'limón',en:'lemon'},{e:'🥥',name:'coco',en:'coconut'},{e:'🍈',name:'melón',en:'melon'},{e:'🥑',name:'aguacate',en:'avocado'},
    {e:'🫐',name:'arándanos',en:'blueberries'},{e:'🍏',name:'manzana verde',en:'green apple'},
    {e:'🍅',name:'tomate',en:'tomato'}
  ];
  var animales=[
    {e:'🐶',name:'perro',say:'el perro hace guau guau',en:'dog'},{e:'🐱',name:'gato',say:'el gato hace miau',en:'cat'},
    {e:'🐮',name:'vaca',say:'la vaca hace muu',en:'cow'},{e:'🐷',name:'cerdo',say:'el cerdo hace oink',en:'pig'},
    {e:'🐴',name:'caballo',say:'el caballo',en:'horse'},{e:'🐔',name:'gallina',say:'la gallina hace co co',en:'hen'},
    {e:'🐑',name:'oveja',say:'la oveja hace beee',en:'sheep'},{e:'🐸',name:'rana',say:'la rana hace croac',en:'frog'},
    {e:'🦆',name:'pato',say:'el pato hace cuac',en:'duck'},{e:'🐘',name:'elefante',say:'el elefante',en:'elephant'},
    {e:'🦁',name:'león',say:'el león hace grrr',en:'lion'},{e:'🐵',name:'mono',say:'el mono',en:'monkey'},
    {e:'🐰',name:'conejo',say:'el conejo',en:'rabbit'},{e:'🐻',name:'oso',say:'el oso',en:'bear'},
    {e:'🐯',name:'tigre',say:'el tigre hace grrr',en:'tiger'},{e:'🐟',name:'pez',say:'el pez',en:'fish'},
    {e:'🐢',name:'tortuga',say:'la tortuga',en:'turtle'},{e:'🦋',name:'mariposa',say:'la mariposa',en:'butterfly'},
    {e:'🐝',name:'abeja',say:'la abeja hace bzzz',en:'bee'},{e:'🐦',name:'pájaro',say:'el pájaro hace pío pío',en:'bird'}
  ];
  var cuerpo=[{e:'👁️',name:'ojo',en:'eye'},{e:'👂',name:'oreja',en:'ear'},{e:'👃',name:'nariz',en:'nose'},{e:'👄',name:'boca',en:'mouth'},{e:'🦷',name:'diente',en:'tooth'},{e:'✋',name:'mano',en:'hand'},{e:'🦶',name:'pie',en:'foot'},{e:'💪',name:'brazo',en:'arm'}];
  var transporte=[{e:'🚗',name:'carro',en:'car'},{e:'🚌',name:'bus',en:'bus'},{e:'🚲',name:'bicicleta',en:'bike'},{e:'🛵',name:'moto',en:'motorcycle'},{e:'✈️',name:'avión',en:'airplane'},{e:'🚂',name:'tren',en:'train'},{e:'🚢',name:'barco',en:'boat'},{e:'🚀',name:'cohete',en:'rocket'},{e:'🚁',name:'helicóptero',en:'helicopter'}];
  var comida=[{e:'🍞',name:'pan',en:'bread'},{e:'🧀',name:'queso',en:'cheese'},{e:'🥚',name:'huevo',en:'egg'},{e:'🍚',name:'arroz',en:'rice'},{e:'🍗',name:'pollo',en:'chicken'},{e:'🥛',name:'leche',en:'milk'},{e:'🍪',name:'galleta',en:'cookie'},{e:'🍫',name:'chocolate',en:'chocolate'},{e:'🍕',name:'pizza',en:'pizza'},{e:'🍦',name:'helado',en:'ice cream'}];
  var emociones=[{e:'😀',name:'feliz',en:'happy'},{e:'😢',name:'triste',en:'sad'},{e:'😡',name:'enojado',en:'angry'},{e:'😴',name:'con sueño',en:'sleepy'},{e:'😮',name:'sorprendido',en:'surprised'},{e:'😆',name:'riendo',en:'laughing'},{e:'😨',name:'asustado',en:'scared'},{e:'🥰',name:'con amor',en:'loving'}];


  /* ---------- STICKERS / LOGROS (no competitivos: explorar, persistir, crear, volver) ----------
     Los identificadores se conservan (compatibilidad); los nombres celebran el esfuerzo. */
  var TOTALES={vocales:vocales.length,numeros:numeros.length,colores:colores.length,formas:formas.length,frutas:frutas.length,animales:animales.length,cuerpo:cuerpo.length,transporte:transporte.length,comida:comida.length,emociones:emociones.length};
  var STICKERS={
    cat_vocales:{emoji:'🔤',nombre:'Conociste las vocales'}, cat_numeros:{emoji:'🔢',nombre:'Conociste los números'},
    cat_colores:{emoji:'🎨',nombre:'Conociste los colores'}, cat_formas:{emoji:'🔺',nombre:'Conociste las formas'},
    cat_frutas:{emoji:'🍓',nombre:'Conociste las frutas'}, cat_animales:{emoji:'🐘',nombre:'Conociste los animales'},
    cat_cuerpo:{emoji:'🧒',nombre:'Conociste tu cuerpo'}, cat_transporte:{emoji:'🚗',nombre:'Conociste los transportes'},
    cat_comida:{emoji:'🍞',nombre:'Conociste la comida'}, cat_emociones:{emoji:'😀',nombre:'Conociste las emociones'},
    niv_3:{emoji:'🌱',nombre:'Tres retos jugados'}, niv_6:{emoji:'🌿',nombre:'Seis retos jugados'},
    niv_9:{emoji:'🌳',nombre:'Nueve retos jugados'}, niv_12:{emoji:'🌻',nombre:'Doce retos jugados'},
    niv_15:{emoji:'🌈',nombre:'Recorriste el camino'}, niv_18:{emoji:'🪁',nombre:'Dieciocho retos'},
    niv_21:{emoji:'🌟',nombre:'Veintiún retos'}, niv_24:{emoji:'🏵️',nombre:'Veinticuatro retos'},
    niv_27:{emoji:'👂',nombre:'Oídos atentos'}, niv_30:{emoji:'🎖️',nombre:'Todos los retos'},
    memoria_win:{emoji:'🃏',nombre:'Encontraste parejas'}, sonidos_10:{emoji:'🐾',nombre:'Escuchaste a los animales'},
    artista_5:{emoji:'🖼️',nombre:'Cinco dibujos colgados'},
    patrones_win:{emoji:'🔮',nombre:'Descubriste un patrón'}, historia_win:{emoji:'📖',nombre:'Ordenaste una historia'},
    clasifica_win:{emoji:'🧺',nombre:'Ordenaste las canastas'}, igualdif_win:{emoji:'🔍',nombre:'Miraste con atención'},
    instrucciones_win:{emoji:'👂',nombre:'Escuchaste muy bien'}, emociones_sit:{emoji:'😊',nombre:'Entiendes cómo se sienten'},
    crea_win:{emoji:'🖌️',nombre:'Dibujaste una carita'}, rompecabezas_try:{emoji:'🧩',nombre:'Armaste un rompecabezas'},
    racha_3dias:{emoji:'☀️',nombre:'Volviste a jugar otro día'},
    contar_win:{emoji:'🧮',nombre:'Contaste cinco veces'}, encaja_win:{emoji:'🔷',nombre:'Encajaste las formas'},
    burbujas_win:{emoji:'🫧',nombre:'Reventaste burbujas'},
    /* nuevos */
    intentos_20:{emoji:'💪',nombre:'¡No te rendiste!'}, musica_win:{emoji:'🎵',nombre:'Hiciste música'},
    en_primeras:{emoji:'👋',nombre:'Hello! Primeras palabras'}, en_10:{emoji:'🦉',nombre:'Diez palabras en inglés'},
    en_categoria:{emoji:'📚',nombre:'Un tema en inglés'}, en_historia:{emoji:'📗',nombre:'Escuchaste un cuento en inglés'},
    en_repetir:{emoji:'🗣️',nombre:'Repetiste en inglés'}, en_escucha:{emoji:'🎧',nombre:'Listen and find'}
  };
  var explorado={};
  function cargarExplorado(){ explorado=leerJSON(claves('explorado'),{},esObjeto); Object.keys(explorado).forEach(function(k){ if(!esObjeto(explorado[k])) delete explorado[k]; }); }
  function guardarExplorado(){ escribir(claves('explorado'),explorado); }
  function cargarStickers(){ return leerJSON(claves('stickers'),[],Array.isArray).filter(function(id){ return typeof id==='string' && STICKERS[id]; }); }
  function guardarStickers(arr){ escribir(claves('stickers'),arr); }
  function desbloquear(id){ if(!STICKERS[id]||perfilActual==null)return; var d=cargarStickers(); if(d.indexOf(id)<0){ d.push(id); guardarStickers(d); mostrarLogro(id); } }
  function tocarAprender(catId,key,total){
    if(!explorado[catId]) explorado[catId]={};
    if(!explorado[catId][key]){ explorado[catId][key]=true; guardarExplorado();
      if(Object.keys(explorado[catId]).length>=total) desbloquear('cat_'+catId);
    }
  }
  var _colaLogros=[], _logroVisible=false;
  function mostrarLogro(id){ _colaLogros.push(id); if(!_logroVisible) siguienteLogro(); }
  function siguienteLogro(){
    var id=_colaLogros.shift(); if(!id){ _logroVisible=false; return; } _logroVisible=true;
    var s=STICKERS[id]; sonidoGane(); hablar('¡Nuevo sticker! '+s.nombre,'es',{encolar:true});
    var t=el('div',{clase:'logro-toast',attrs:{role:'status'}});
    t.innerHTML=personajeSVG('animando',52)+'<span class="logro-emoji" aria-hidden="true">'+s.emoji+'</span><span>¡Nuevo sticker!<br><b></b></span>';
    t.querySelector('b').textContent=s.nombre;
    document.body.appendChild(t);
    _setTimeout(function(){ animarPersonaje(t.querySelector('svg'),'celebra'); },80);
    if(!reduce()) chispas(window.innerWidth/2, window.innerHeight-90);
    _setTimeout(function(){ t.classList.add('fuera'); _setTimeout(function(){t.remove(); siguienteLogro();},400); }, 2800);
  }
  var categorias=[
    {id:'vocales',ico:'🔤',txt:'Vocales'},{id:'numeros',ico:'🔢',txt:'Números'},
    {id:'colores',ico:'🎨',txt:'Colores'},{id:'formas',ico:'🔺',txt:'Formas'},
    {id:'frutas',ico:'🍓',txt:'Frutas'},{id:'animales',ico:'🐘',txt:'Animales'},
    {id:'cuerpo',ico:'🧒',txt:'Mi cuerpo'},{id:'transporte',ico:'🚗',txt:'Transporte'},
    {id:'comida',ico:'🍞',txt:'Comida'},{id:'emociones',ico:'😀',txt:'Emociones'}
  ];
  var NIVELES=[
    {t:'Colores',ico:'🎨',sub:'¿De qué color es?',tipo:'color',ops:3,rondas:3,mixto:false,vidas:3},
    {t:'Frutas',ico:'🍓',sub:'Encuentra la fruta',tipo:'fruta',ops:4,rondas:3,mixto:false,vidas:3},
    {t:'Animales',ico:'🐘',sub:'¿Cuál animal es?',tipo:'animal',ops:4,rondas:3,mixto:false,vidas:3},
    {t:'Números',ico:'🔢',sub:'Busca el número',tipo:'numero',ops:4,rondas:3,mixto:false,vidas:3},
    {t:'Formas',ico:'⭐',sub:'Busca la forma',tipo:'forma',ops:4,rondas:3,mixto:false,vidas:3},
    {t:'Letras',ico:'🔤',sub:'Busca la vocal',tipo:'vocal',ops:4,rondas:4,mixto:false,vidas:3},
    {t:'Mezcla',ico:'🎲',sub:'De todo un poco',tipo:'mezcla',ops:4,rondas:4,mixto:true,vidas:3},
    {t:'Colores +',ico:'🌈',sub:'Color entre muchas cosas',tipo:'color',ops:5,rondas:4,mixto:true,vidas:3},
    {t:'Números +',ico:'🔟',sub:'Número entre muchas cosas',tipo:'numero',ops:5,rondas:5,mixto:true,vidas:3},
    {t:'Animales +',ico:'🦁',sub:'Animal entre muchas cosas',tipo:'animal',ops:5,rondas:5,mixto:true,vidas:2},
    {t:'Mezcla divertida',ico:'🎯',sub:'¡Nuevo reto!',tipo:'mezcla',ops:6,rondas:5,mixto:true,vidas:2},
    {t:'Transporte',ico:'🚗',sub:'Encuentra el transporte',tipo:'transporte',ops:5,rondas:4,mixto:true,vidas:2},
    {t:'Mi Cuerpo',ico:'🧒',sub:'Señala la parte del cuerpo',tipo:'cuerpo',ops:5,rondas:4,mixto:true,vidas:2},
    {t:'Emociones',ico:'😀',sub:'¿Cómo se siente?',tipo:'emocion',ops:5,rondas:4,mixto:true,vidas:2},
    {t:'Números Grandes',ico:'🔟',sub:'Números hasta el 20',tipo:'numero20',ops:6,rondas:5,mixto:true,vidas:2},
    {t:'Paseo largo',ico:'🏆',sub:'¡Nuevo reto!',tipo:'mezcla',ops:7,rondas:6,mixto:true,vidas:2},
    {t:'Muchas cosas',ico:'🔥',sub:'Para expertas curiosas',tipo:'mezcla',ops:7,rondas:7,mixto:true,vidas:1},
    {t:'Gran paseo',ico:'👑',sub:'Un paseo por todo',tipo:'mezcla',ops:8,rondas:8,mixto:true,vidas:1},
    {t:'Comida',ico:'🍞',sub:'Encuentra la comida',tipo:'comida',ops:5,rondas:4,mixto:true,vidas:2},
    {t:'Comida +',ico:'🍕',sub:'Comida entre muchas cosas',tipo:'comida',ops:6,rondas:5,mixto:true,vidas:1},
    {t:'Mezcla grande',ico:'🎯',sub:'Para expertas curiosas',tipo:'mezcla',ops:8,rondas:7,mixto:true,vidas:1},
    {t:'Súper Comida',ico:'🍦',sub:'Comida y mucho más',tipo:'comida',ops:7,rondas:6,mixto:true,vidas:1},
    {t:'Gran mezcla',ico:'🌟',sub:'Para expertas curiosas',tipo:'mezcla',ops:9,rondas:8,mixto:true,vidas:1},
    {t:'Todo lo que sé',ico:'🏅',sub:'Para expertas curiosas',tipo:'mezcla',ops:9,rondas:9,mixto:true,vidas:1},
    /* Niveles 25–30: "solo escuchando" — la instrucción ya no aparece escrita, hay que entenderla por la voz */
    {t:'Oído atento',ico:'👂',sub:'Solo escucha: busca el animal',tipo:'animal',ops:5,rondas:5,mixto:false,soloVoz:true},
    {t:'Colores parecidos',ico:'🎨',sub:'Solo escucha: muchos colores',tipo:'color',ops:8,rondas:5,mixto:false,soloVoz:true},
    {t:'Números escondidos',ico:'🔢',sub:'Solo escucha: números hasta el 20',tipo:'numero20',ops:8,rondas:6,mixto:false,soloVoz:true},
    {t:'Mi cuerpo +',ico:'✋',sub:'Solo escucha: partes del cuerpo',tipo:'cuerpo',ops:7,rondas:6,mixto:true,soloVoz:true},
    {t:'Emociones +',ico:'🥰',sub:'Solo escucha: ¿quién está así?',tipo:'emocion',ops:7,rondas:6,mixto:true,soloVoz:true},
    {t:'Gran final',ico:'👑',sub:'Todo, solo escuchando',tipo:'mezcla',ops:9,rondas:10,mixto:true,soloVoz:true}
  ];

  /* Orden y visibilidad por dificultad (los índices de NIVELES NO cambian: así el progreso
     guardado por la versión anterior sigue siendo válido).
     · normal: 15 niveles apropiados para 3 años (con "Oído atento" temprano).
     · reto:   los 30 niveles originales, en su orden.
     El tope de opciones/rondas lo pone MAX_OPS según la dificultad del perfil. */
  var ORDEN_NIVELES={ facil:[0,1,2,3,4,24,11,12,13,18], normal:[0,1,2,3,4,24,11,12,13,6,7,8,9,18,10],
    reto:NIVELES.map(function(_,i){return i;}) };
  var MAX_OPS={facil:3, normal:4, reto:6}, MAX_RONDAS={facil:4, normal:5, reto:6};
  function nivelesVisibles(){ return ORDEN_NIVELES[configPerfil.dificultad]||ORDEN_NIVELES.normal; }
  function confNivel(idx){ var c=NIVELES[idx], d=configPerfil.dificultad;
    var o={}; Object.keys(c).forEach(function(k){o[k]=c[k];});
    o.ops=Math.min(c.ops,MAX_OPS[d]||4); o.rondas=Math.min(c.rondas,MAX_RONDAS[d]||5);
    if(d!=='reto' && c.tipo==='numero20') o.tipo='numero';
    return o; }

  /* ---------- PROGRESO DE NIVELES ----------
     'completados' (número) se conserva por compatibilidad; 'niveles' guarda el conjunto
     exacto de niveles ganados. Si no existe, se reconstruye desde 'completados'. */
  var completados=0, nivelesHechos={};
  function cargarProg(){
    var n=parseInt(localStorage.getItem(claves('completados')),10); if(isNaN(n)) n=0; n=Math.min(NIVELES.length,Math.max(0,n));
    var arr=leerJSON(claves('niveles'),null,Array.isArray);
    nivelesHechos={};
    if(arr){ arr.forEach(function(i){ i=+i; if(i>=0&&i<NIVELES.length) nivelesHechos[i]=true; }); }
    else { for(var i=0;i<n;i++) nivelesHechos[i]=true; }
    completados=Object.keys(nivelesHechos).length;
  }
  function guardarProg(){ completados=Object.keys(nivelesHechos).length; escribir(claves('completados'),String(completados)); escribir(claves('niveles'),Object.keys(nivelesHechos).map(Number)); }
  function nivelActual(){ var v=nivelesVisibles(); for(var i=0;i<v.length;i++){ if(!nivelesHechos[v[i]]) return v[i]; } return -1; }
  function hechosVisibles(){ return nivelesVisibles().filter(function(i){return nivelesHechos[i];}).length; }

  /* Configuración por perfil (la cambia un adulto). */
  var configPerfil={dificultad:'normal'};
  function cargarConfigPerfil(){ var c=leerJSON(claves('config'),{},esObjeto); configPerfil={dificultad:(MAX_OPS[c.dificultad]?c.dificultad:'normal')}; }
  function guardarConfigPerfil(){ escribir(claves('config'),configPerfil); }
