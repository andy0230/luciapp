  /* =====================================================================
     PERSONAJES — tres compañeros con identidad propia (SVG en línea + CSS).
       · Lucía  (guía, niña)        → acompaña en todo, saluda al entrar.
       · Ollie  (búho, turquesa)    → vive en English World, habla inglés.
       · Cami   (camaleón, verde)   → vive en Crear, cambia de color.
     Partes animables por clase: .pj-ojos (parpadeo), .pj-brazo-d (saludar/
     señalar), .pj-brazo-i, .pj-boca (hablar). Las poses se aplican con
     animarPersonaje(el,'saluda'|'rebota'|'celebra'|'senala'|'gira'|'piensa').
     Todo respeta prefers-reduced-motion (ver CSS).
     ===================================================================== */
  var TINTA='#2A2238';
  function bocaSVG(mood,cx,cy,w){
    w=w||11;
    if(mood==='contenta'||mood==='animando') return '<path class="pj-boca" d="M'+(cx-w)+' '+cy+' Q'+cx+' '+(cy+w*1.5)+' '+(cx+w)+' '+cy+' Z" fill="#fff" stroke="'+TINTA+'" stroke-width="3" stroke-linejoin="round"/>';
    if(mood==='piensa') return '<path class="pj-boca" d="M'+(cx-w*0.6)+' '+(cy+3)+' Q'+cx+' '+(cy+1)+' '+(cx+w*0.6)+' '+(cy+4)+'" fill="none" stroke="'+TINTA+'" stroke-width="3.5" stroke-linecap="round"/>';
    if(mood==='sorpresa') return '<ellipse class="pj-boca" cx="'+cx+'" cy="'+(cy+3)+'" rx="5" ry="6" fill="#fff" stroke="'+TINTA+'" stroke-width="3"/>';
    return '<path class="pj-boca" d="M'+(cx-w)+' '+cy+' Q'+cx+' '+(cy+w*0.9)+' '+(cx+w)+' '+cy+'" fill="none" stroke="'+TINTA+'" stroke-width="3.5" stroke-linecap="round"/>';
  }
  function brazo(cls,d,piel){ return '<g class="'+cls+'"><path d="'+d+'" fill="none" stroke="'+TINTA+'" stroke-width="10" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="'+piel+'" stroke-width="5.5" stroke-linecap="round"/></g>'; }
  var PERSONAJES={
    lucia:{nombre:'Lucía', dibujar:function(mood){
      var piel='#FFD9BF', arriba=mood==='animando';
      var bi=arriba?'M34 110 Q18 94 16 72':'M34 108 Q22 118 22 132';
      var bd=arriba?'M86 110 Q102 94 104 72':'M86 108 Q98 118 98 132';
      return brazo('pj-brazo-i',bi,piel)+brazo('pj-brazo-d',bd,piel)+
      '<circle cx="24" cy="30" r="15" fill="#5A3A28" stroke="'+TINTA+'" stroke-width="3"/><circle cx="96" cy="30" r="15" fill="#5A3A28" stroke="'+TINTA+'" stroke-width="3"/>'+
      '<path d="M100 18 l10 -6 l-2 12 z M100 18 l12 4 l-10 6 z" fill="#EC6A55" stroke="'+TINTA+'" stroke-width="2" stroke-linejoin="round"/>'+
      '<path d="M26 140 Q28 104 60 100 Q92 104 94 140 Z" fill="#EC6A55" stroke="'+TINTA+'" stroke-width="3"/>'+
      '<path d="M48 103 L60 114 L72 103" fill="#fff" stroke="'+TINTA+'" stroke-width="2.5" stroke-linejoin="round"/>'+
      '<circle cx="60" cy="64" r="34" fill="'+piel+'" stroke="'+TINTA+'" stroke-width="3"/>'+
      '<path d="M27 62 Q30 30 60 30 Q90 30 93 62 Q80 46 62 50 Q50 40 27 62 Z" fill="#5A3A28" stroke="'+TINTA+'" stroke-width="2.5" stroke-linejoin="round"/>'+
      '<g class="pj-ojos"><ellipse cx="47" cy="68" rx="4.5" ry="5.5" fill="'+TINTA+'"/><ellipse cx="73" cy="68" rx="4.5" ry="5.5" fill="'+TINTA+'"/>'+
      '<circle cx="48.5" cy="66" r="1.6" fill="#fff"/><circle cx="74.5" cy="66" r="1.6" fill="#fff"/></g>'+
      (mood==='piensa'?'<path d="M40 58 q7 -4 13 0 M67 58 q7 -4 13 0" fill="none" stroke="'+TINTA+'" stroke-width="2.4" stroke-linecap="round"/>':'')+
      '<circle cx="38" cy="78" r="6" fill="#F59A9A" opacity=".6"/><circle cx="82" cy="78" r="6" fill="#F59A9A" opacity=".6"/>'+
      bocaSVG(mood,60,81);
    }},
    ollie:{nombre:'Ollie', dibujar:function(mood){
      var cuerpo='#2A9D8F', panza='#D5F0EC', arriba=mood==='animando';
      var ala=function(cls,lado){ var x=lado<0?22:98, r=arriba?(lado<0?'-55':'55'):'0';
        return '<g class="'+cls+'"><ellipse cx="'+x+'" cy="92" rx="11" ry="24" transform="rotate('+(lado*14+ +r)+' '+x+' 74)" fill="#1F7F74" stroke="'+TINTA+'" stroke-width="3"/></g>'; };
      return ala('pj-brazo-i',-1)+ala('pj-brazo-d',1)+
      '<path d="M30 40 L24 14 L46 30 Z M90 40 L96 14 L74 30 Z" fill="'+cuerpo+'" stroke="'+TINTA+'" stroke-width="3" stroke-linejoin="round"/>'+
      '<ellipse cx="60" cy="80" rx="40" ry="52" fill="'+cuerpo+'" stroke="'+TINTA+'" stroke-width="3"/>'+
      '<ellipse cx="60" cy="100" rx="25" ry="28" fill="'+panza+'" stroke="'+TINTA+'" stroke-width="2.5"/>'+
      '<path d="M48 92 q4 4 8 0 M64 92 q4 4 8 0 M52 104 q4 4 8 0 M60 104 q4 4 8 0" fill="none" stroke="#9FD3CB" stroke-width="2" stroke-linecap="round"/>'+
      '<circle cx="43" cy="56" r="16" fill="#fff" stroke="'+TINTA+'" stroke-width="3"/><circle cx="77" cy="56" r="16" fill="#fff" stroke="'+TINTA+'" stroke-width="3"/>'+
      '<g class="pj-ojos"><circle cx="45" cy="57" r="7" fill="'+TINTA+'"/><circle cx="75" cy="57" r="7" fill="'+TINTA+'"/><circle cx="47.5" cy="54.5" r="2.2" fill="#fff"/><circle cx="77.5" cy="54.5" r="2.2" fill="#fff"/></g>'+
      '<path d="M54 68 L66 68 L60 80 Z" fill="#F2AE2E" stroke="'+TINTA+'" stroke-width="2.5" stroke-linejoin="round"/>'+
      (mood==='contenta'||mood==='animando'?'<path class="pj-boca" d="M55 80 Q60 86 65 80" fill="none" stroke="'+TINTA+'" stroke-width="2.5" stroke-linecap="round"/>':'<path class="pj-boca" d="M57 81 L63 81" stroke="'+TINTA+'" stroke-width="0" />')+
      '<path d="M44 130 l-4 8 M50 131 l0 8 M70 131 l0 8 M76 130 l4 8" stroke="#F2AE2E" stroke-width="4" stroke-linecap="round"/>'+
      '<path d="M34 120 Q60 132 86 120 L84 128 Q60 140 36 128 Z" fill="#EC6A55" stroke="'+TINTA+'" stroke-width="2.5" stroke-linejoin="round"/>';
    }},
    cami:{nombre:'Cami', dibujar:function(mood){
      var piel='var(--cami,#5DBB63)', arriba=mood==='animando';
      return '<path d="M30 118 C6 118 6 90 24 88 C36 87 38 102 28 104 C22 105 21 98 26 97" fill="none" stroke="'+TINTA+'" stroke-width="11" stroke-linecap="round"/>'+
      '<path d="M30 118 C6 118 6 90 24 88 C36 87 38 102 28 104 C22 105 21 98 26 97" fill="none" stroke="'+piel+'" stroke-width="6" stroke-linecap="round"/>'+
      '<path d="M48 124 l-3 12 M86 124 l3 12" stroke="'+TINTA+'" stroke-width="7" stroke-linecap="round"/>'+
      '<ellipse cx="66" cy="104" rx="38" ry="26" fill="'+piel+'" stroke="'+TINTA+'" stroke-width="3"/>'+
      '<path d="M42 96 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0" fill="none" stroke="'+TINTA+'" stroke-width="2" opacity=".35"/>'+
      brazo('pj-brazo-i',arriba?'M48 104 Q36 88 34 74':'M48 106 Q40 116 40 126',piel)+
      brazo('pj-brazo-d',arriba?'M90 100 Q104 86 106 72':'M88 106 Q96 116 96 126',piel)+
      '<path d="M44 74 C40 44 62 30 82 34 C104 38 108 64 96 76 C84 88 52 90 44 74 Z" fill="'+piel+'" stroke="'+TINTA+'" stroke-width="3"/>'+
      '<path d="M54 36 Q70 16 92 30 Q86 36 72 36 Z" fill="#EC6A55" stroke="'+TINTA+'" stroke-width="2.5" stroke-linejoin="round"/><circle cx="74" cy="22" r="4" fill="#EC6A55" stroke="'+TINTA+'" stroke-width="2"/>'+
      '<circle cx="84" cy="54" r="13" fill="#fff" stroke="'+TINTA+'" stroke-width="3"/>'+
      '<g class="pj-ojos"><circle cx="86" cy="55" r="6" fill="'+TINTA+'"/><circle cx="88" cy="52.5" r="2" fill="#fff"/></g>'+
      '<circle cx="62" cy="60" r="4" fill="'+TINTA+'"/>'+
      bocaSVG(mood==='animando'?'contenta':mood,76,74,10);
    }}
  };
  /* personajeSVG(mood,size) se conserva para compatibilidad (Lucía). */
  function personajeSVG(mood,size,quien){
    quien=PERSONAJES[quien]?quien:'lucia'; size=size||110;
    return '<svg class="personaje pj-'+quien+'" data-pj="'+quien+'" width="'+size+'" height="'+Math.round(size*140/120)+'" viewBox="0 0 120 140" role="img" aria-label="'+PERSONAJES[quien].nombre+'">'+
      '<g class="pj-todo">'+PERSONAJES[quien].dibujar(mood||'feliz')+'</g></svg>';
  }
  /* Nodo de personaje listo para insertar, con su "globo" de diálogo opcional. */
  function personaje(quien,mood,size,globo){
    var w=el('div',{clase:'pj-wrap',html:personajeSVG(mood,size,quien)});
    if(globo){ w.appendChild(el('div',{clase:'globo',texto:globo})); }
    var svg=w.querySelector('svg');
    svg.addEventListener('click',function(){ animarPersonaje(svg,'rebota'); sonidoTap(); });
    return w;
  }
  function animarPersonaje(svg,pose){
    if(!svg) return; var c='pose-'+pose;
    svg.classList.remove('pose-saluda','pose-rebota','pose-celebra','pose-senala','pose-gira','pose-piensa');
    void svg.getBoundingClientRect(); svg.classList.add(c);
    _setTimeout(function(){ svg.classList.remove(c); }, pose==='celebra'?1400:1100);
  }
  /* Cambia el ánimo (cara) de un personaje ya dibujado, p. ej. tras un acierto. */
  function animoPersonaje(svg,mood,pose){
    if(!svg) return; var q=svg.getAttribute('data-pj')||'lucia';
    svg.querySelector('.pj-todo').innerHTML=PERSONAJES[q].dibujar(mood);
    if(pose) animarPersonaje(svg,pose);
  }
  /* La boca se mueve mientras la voz habla (solo el personaje visible más reciente). */
  alHablar=function(on){ var s=document.querySelectorAll('#app .personaje'); var u=s[s.length-1]; if(u) u.classList.toggle('hablando',on); };


  /* ---------- ILUSTRACIONES DE LOS MUNDOS (SVG planos, hechos a mano) ---------- */
  var TT='stroke="#2A2238" stroke-width="3" stroke-linejoin="round"';
  var ILU={
    descubrir:'<svg viewBox="0 0 240 160" aria-hidden="true">'+
      '<path d="M26 44 q6-14 22-8 q12-10 22 4 q12 0 9 12 h-50 q-11-2-3-8z" fill="#fff" '+TT+'/>'+
      '<circle cx="200" cy="36" r="20" fill="#F2AE2E" '+TT+'/>'+
      '<path d="M-4 118 Q60 78 122 110 T244 98 V164 H-4Z" fill="#8FCB9C" '+TT+'/>'+
      '<path d="M-4 140 Q82 110 160 134 T244 128 V164 H-4Z" fill="#4FA96A" '+TT+'/>'+
      '<line x1="62" y1="124" x2="62" y2="100" stroke="#2A2238" stroke-width="3"/><circle cx="62" cy="94" r="9" fill="#E86FA6" '+TT+'/><circle cx="62" cy="94" r="3.5" fill="#F2AE2E"/>'+
      '<line x1="200" y1="124" x2="200" y2="106" stroke="#2A2238" stroke-width="3"/><circle cx="200" cy="101" r="7" fill="#fff" '+TT+'/><circle cx="200" cy="101" r="2.5" fill="#F2AE2E"/>'+
      '<circle cx="128" cy="68" r="34" fill="#FFFFFF" fill-opacity=".6" stroke="#2A2238" stroke-width="8"/>'+
      '<line x1="153" y1="93" x2="180" y2="122" stroke="#2A2238" stroke-width="14" stroke-linecap="round"/><line x1="156" y1="96" x2="178" y2="120" stroke="#C98A12" stroke-width="7" stroke-linecap="round"/>'+
      '<ellipse cx="128" cy="72" rx="13" ry="12" fill="#EC6A55" '+TT+'/><line x1="128" y1="60" x2="128" y2="84" stroke="#2A2238" stroke-width="2.5"/><circle cx="122" cy="70" r="2.5" fill="#2A2238"/><circle cx="134" cy="76" r="2.5" fill="#2A2238"/><circle cx="128" cy="58" r="5" fill="#2A2238"/>'+
      '</svg>',
    jugar:'<svg viewBox="0 0 240 160" aria-hidden="true">'+
      '<path d="M-4 138 H244 V164 H-4Z" fill="#E7C27A" '+TT+'/>'+
      '<polygon points="196,18 203,34 220,35 207,46 211,63 196,54 181,63 185,46 172,35 189,34" fill="#fff" '+TT+'/>'+
      '<rect x="28" y="92" width="46" height="46" rx="6" fill="#3D8BD9" '+TT+'/><rect x="76" y="92" width="46" height="46" rx="6" fill="#EC6A55" '+TT+'/><rect x="52" y="46" width="46" height="46" rx="6" fill="#3FA463" '+TT+'/>'+
      '<text x="51" y="126" text-anchor="middle" font-family="Baloo 2,Nunito,sans-serif" font-weight="800" font-size="30" fill="#fff" stroke="#2A2238" stroke-width="1.5">A</text>'+
      '<text x="99" y="126" text-anchor="middle" font-family="Baloo 2,Nunito,sans-serif" font-weight="800" font-size="30" fill="#fff" stroke="#2A2238" stroke-width="1.5">B</text>'+
      '<text x="75" y="80" text-anchor="middle" font-family="Baloo 2,Nunito,sans-serif" font-weight="800" font-size="30" fill="#fff" stroke="#2A2238" stroke-width="1.5">C</text>'+
      '<circle cx="172" cy="110" r="28" fill="#fff" '+TT+'/><path d="M146 100 Q172 112 198 100" fill="none" stroke="#EC6A55" stroke-width="7"/><path d="M150 124 Q172 132 194 124" fill="none" stroke="#3D8BD9" stroke-width="7"/><circle cx="172" cy="110" r="28" fill="none" '+TT+'/>'+
      '</svg>',
    crear:'<svg viewBox="0 0 240 160" aria-hidden="true">'+
      '<path d="M36 102 C26 62 78 40 130 50 C182 60 202 92 182 116 C166 134 142 118 132 130 C120 144 128 152 98 152 C66 152 44 132 36 102Z" fill="#FFF8EE" '+TT+'/>'+
      '<ellipse cx="150" cy="112" rx="11" ry="9" fill="#FBDDD6" '+TT+'/>'+
      '<circle cx="74" cy="84" r="13" fill="#3D8BD9" '+TT+'/><circle cx="106" cy="70" r="13" fill="#F2AE2E" '+TT+'/><circle cx="142" cy="76" r="13" fill="#3FA463" '+TT+'/><circle cx="70" cy="120" r="13" fill="#E86FA6" '+TT+'/><circle cx="104" cy="124" r="11" fill="#7A5AB5" '+TT+'/>'+
      '<line x1="222" y1="16" x2="174" y2="84" stroke="#2A2238" stroke-width="15" stroke-linecap="round"/><line x1="222" y1="16" x2="176" y2="81" stroke="#C98A12" stroke-width="9" stroke-linecap="round"/>'+
      '<rect x="166" y="78" width="16" height="12" rx="2" transform="rotate(35 174 84)" fill="#B9B3C4" '+TT+'/>'+
      '<path d="M168 92 q-16 10 -20 30 q18 -2 28 -16z" fill="#EC6A55" '+TT+'/>'+
      '<circle cx="30" cy="34" r="8" fill="#F2AE2E" '+TT+'/><circle cx="48" cy="22" r="5" fill="#3D8BD9" '+TT+'/>'+
      '</svg>',
    coleccion:'<svg viewBox="0 0 120 100" aria-hidden="true">'+
      '<path d="M8 18 L58 26 L58 92 L8 84Z" fill="#fff" '+TT+'/><path d="M112 18 L62 26 L62 92 L112 84Z" fill="#fff" '+TT+'/>'+
      '<polygon points="32,32 36,42 47,42 38,49 41,60 32,53 23,60 26,49 17,42 28,42" fill="#F2AE2E" '+TT+'/>'+
      '<circle cx="32" cy="72" r="8" fill="#3D8BD9" '+TT+'/>'+
      '<path d="M86 66 C72 56 70 46 76 40 C80 36 86 38 86 44 C86 38 92 36 96 40 C102 46 100 56 86 66Z" fill="#EC6A55" '+TT+'/>'+
      '<rect x="74" y="72" width="22" height="8" rx="4" fill="none" stroke="#2A2238" stroke-width="2" stroke-dasharray="4 3"/>'+
      '</svg>'
  };
  ILU.ingles='<svg viewBox="0 0 240 160" aria-hidden="true">'+
    '<path d="M-4 128 Q70 100 130 122 T244 112 V164 H-4Z" fill="#9ED9CF" '+TT+'/>'+
    '<path d="M24 22 h96 a14 14 0 0 1 14 14 v30 a14 14 0 0 1 -14 14 h-58 l-18 16 l2 -16 h-22 a14 14 0 0 1 -14 -14 v-30 a14 14 0 0 1 14 -14z" fill="#fff" '+TT+'/>'+
    '<text x="72" y="62" text-anchor="middle" font-family="ui-rounded,Nunito,Arial Rounded MT Bold,sans-serif" font-weight="800" font-size="30" fill="#2A9D8F">Hello!</text>'+
    '<g transform="translate(150 40) scale(.62)">'+PERSONAJES.ollie.dibujar('contenta')+'</g>'+
    '<circle cx="34" cy="128" r="9" fill="#F2AE2E" '+TT+'/><circle cx="58" cy="134" r="7" fill="#EC6A55" '+TT+'/>'+
    '</svg>';
