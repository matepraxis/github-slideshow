(function(){
'use strict';
var $=function(id){return document.getElementById(id);};
var lessons=[],sounds={},active=null,stepIndex=-1,track=$('voice'),usingFallback=false;
var asTime=function(v){return Math.floor(v/60)+':'+String(Math.floor(v%60)).padStart(2,'0');};
function node(tag,content,cls){var n=document.createElement(tag);n.textContent=content||'';if(cls)n.className=cls;return n;}
function math(target,latex){var elem=typeof target==='string'?$(target):target;elem.hidden=!latex;elem.textContent=latex||'';if(latex&&window.katex){try{window.katex.render(latex,elem,{displayMode:true,throwOnError:false,strict:'ignore'});}catch(e){elem.textContent=latex;}}}
function catalog(){var out=$('catalog');out.textContent='';lessons.forEach(function(l,i){
 var card=node('button','','tile');card.type='button';
 var top=node('div','','tilehead');var label=node('b','CLASE '+String(i+1).padStart(2,'0')+' · '+l.category),badge=node('span',sounds[l.id]?'● Con voz':'Guía interactiva','pill'+(sounds[l.id]?'':' quiet'));top.append(label,badge);
 var h=node('h3',l.title),p=node('p',l.subtitle),bottom=node('div','','tilefoot');bottom.append(node('span','Apuntes: páginas '+l.pages),node('strong','Estudiar →'));
 card.append(top,h,p,bottom);card.addEventListener('click',function(){open(l.id);});out.append(card);
});}
function scopeTime(t){var a=sounds[active.id].marks,n=0;for(var i=1;i<a.length;i++)if(t>=a[i])n=i;return n;}
function setStep(n){if(!active)return;n=Math.max(0,Math.min(active.steps.length-1,n));if(n===stepIndex)return;stepIndex=n;
 var s=active.steps[n];$('stepIndicator').textContent='PASO '+String(n+1).padStart(2,'0')+' / '+active.steps.length;
 $('stepTitle').textContent=s.title;math('formula',s.tex);math('formula2',s.sub);$('stepNote').textContent=s.note;
 $('explain').textContent=s.voice;
 var children=$('stepList').children;for(var i=0;i<children.length;i++)children[i].firstElementChild.classList.toggle('active',i===n);
 var board=$('board');board.classList.remove('changing');void board.offsetWidth;board.classList.add('changing');
 if(!sounds[active.id]){$('seek').value=n;$('clock').textContent=(n+1)+' / '+active.steps.length;}
}
function jump(n){if(!active)return;setStep(n);if(sounds[active.id]){track.currentTime=sounds[active.id].marks[n]||0;timeSync();}}
function timeSync(){if(!active||!sounds[active.id])return;var t=track.currentTime||0;setStep(scopeTime(t));$('seek').value=t;$('clock').textContent=asTime(t)+' / '+asTime(sounds[active.id].duration);}
function open(id){var l=lessons.find(function(a){return a.id===id;});if(!l)return;
 track.pause();track.removeAttribute('src');track.load();usingFallback=false;active=l;stepIndex=-1;
 $('home').hidden=true;$('study').hidden=false;$('category').textContent=l.category;$('lessonTitle').textContent=l.title;$('lessonSubtitle').textContent=l.subtitle;
 $('tags').textContent='';['Apuntes: págs. '+l.pages,(sounds[id]?'Voz clara · Español':'Guía sin audio automático'),l.steps.length+' pasos'].forEach(function(t){$('tags').append(node('span',t));});
 var list=$('stepList');list.textContent='';
 l.steps.forEach(function(s,i){var li=node('li'),b=node('button');b.type='button';b.append(node('span',String(i+1).padStart(2,'0'),'stepnum'),node('span',s.title,'stepname'));if(sounds[id])b.append(node('span',asTime(sounds[id].marks[i]||0),'stepclock'));b.addEventListener('click',function(){jump(i);});li.append(b);list.append(li);});
 var narrated=!!sounds[id];
 $('rewind').hidden=!narrated;$('speed').hidden=!narrated;$('seek').step=narrated?.1:1;$('seek').max=narrated?sounds[id].duration:l.steps.length-1;$('seek').value=0;$('clock').textContent=narrated?'0:00 / '+asTime(sounds[id].duration):'1 / '+l.steps.length;
 $('play').textContent=narrated?'▶':'→';$('play').title=narrated?'Reproducir o pausar':'Siguiente paso';
 $('status').textContent=narrated?'Pulsa reproducir para escuchar la clase con la voz aprobada.':'Esta clase tiene todas las explicaciones por escrito. Avanza con → a tu propio ritmo; no usa ninguna voz robótica.';
 if(narrated){track.src='/audio/'+id;track.load();track.playbackRate=Number($('speed').value);}setStep(0);visual(l.visual);quiz(l);location.hash='clase/'+encodeURIComponent(id);window.scrollTo(0,0);
}
function goHome(){track.pause();$('study').hidden=true;$('home').hidden=false;location.hash='inicio';window.scrollTo(0,0);}
async function play(){if(!active)return;if(!sounds[active.id]){jump(Math.min(active.steps.length-1,stepIndex+1));return;}if(!track.paused){track.pause();return;}try{await track.play();}catch(e){$('status').textContent='No fue posible cargar la narración. Puedes seguir las explicaciones por escrito.';}}
function quiz(l){$('question').textContent=l.quiz.prompt;$('answers').textContent='';$('feedback').hidden=true;l.quiz.choices.forEach(function(c,i){var b=node('button',String(i+1)+'. '+c,'answer');b.type='button';b.addEventListener('click',function(){
 for(var q of $('answers').children)q.classList.remove('chosen');b.classList.add('chosen');
 $('feedback').hidden=false;$('feedback').textContent=(i===l.quiz.correct?'Correcto. ':'Revisa la idea. ')+l.quiz.why;
 });$('answers').append(b);});}
function visual(type){
 var r=$('visual');r.textContent='';
 if(type==='truth'){
 $('visualIntro').textContent='Comprueba cuándo un bicondicional es verdadero y qué sucede al negarlo.';
 var t=node('table','','truth');t.innerHTML='<thead><tr><th>p</th><th>q</th><th>p↔q</th><th>¬(p↔q)</th></tr></thead><tbody></tbody>';
 [[true,true],[true,false],[false,true],[false,false]].forEach(function(z){var same=z[0]===z[1],tr=node('tr');[z[0],z[1],same,!same].forEach(function(v){tr.append(node('td',v?'V':'F',v?'yes':''));});t.tBodies[0].append(tr);});r.append(t);
 }else if(type==='quantifier'){
 $('visualIntro').textContent='Mueve el candidato x: siempre aparece otro real y=x+1 que lo contradice.';
 var row=node('div','','vizline'),label=node('label'),slide=document.createElement('input'),out=node('div','','result');
 slide.type='range';slide.min=-5;slide.max=5;slide.step=1;slide.value=0;function update(){var x=+slide.value;label.textContent='x = '+x;out.textContent='Elegimos y = '+(x+1)+'. Entonces y ≠ x. Esto sucede para cualquier candidato x.';}slide.addEventListener('input',update);row.append(label,slide);update();r.append(row,out);
 }else if(type==='scope'){
 $('visualIntro').textContent='Dos proposiciones completas pueden escribirse con variables ligadas diferentes. La negación externa se aplica a todo el bicondicional.';
 var grid=node('div','','mini-grid'),a=node('div','','minicard'),b=node('div','','minicard');a.append(node('strong','A: cuantificador universal'),node('p','∀u (P(u) ∨ R(u))'));b.append(node('strong','B: cuantificador existencial'),node('p','∃v ¬S(v)'));grid.append(a,b);r.append(grid);r.append(mathNode('\\neg(A\\leftrightarrow B)\\equiv(A\\land\\neg B)\\lor(\\neg A\\land B)'));
 }else if(type==='sets'){
 $('visualIntro').textContent='Marca si un elemento t pertenece a A, B y C: los dos lados de la identidad verdadera siempre coinciden.';
 var row=node('div','','vizline'),data={},out=node('div','','result');
 ['A','B','C'].forEach(function(k){var lab=node('label',' '+k),chk=document.createElement('input');chk.type='checkbox';chk.checked=k==='A';lab.prepend(chk);data[k]=chk;row.append(lab);chk.addEventListener('change',update);});
 function update(){var A=data.A.checked,B=data.B.checked,C=data.C.checked;var left=A&&(B!==C),right=(A&&B)!==(A&&C);out.textContent='t ∈ A∩(B△C): '+(left?'Sí':'No')+'   |   t ∈ (A∩B)△(A∩C): '+(right?'Sí':'No')+'   → Coinciden.';}update();r.append(row,out);
 }else if(type==='bounds'){
 $('visualIntro').textContent='A=[2,4] está contenido en B=[1,5]. Los límites de B se extienden por ambos extremos.';
 var d=node('div','','result');d.innerHTML='<svg class="diagram" viewBox="0 0 570 180" role="img" aria-label="En B se encuentra A: B de 1 a 5 y A de 2 a 4"><line x1="40" y1="145" x2="535" y2="145" stroke="#91a9b0" stroke-width="2"/><line x1="92" y1="74" x2="492" y2="74" stroke="#a3cbcd" stroke-width="14" stroke-linecap="round"/><line x1="192" y1="110" x2="392" y2="110" stroke="#167d84" stroke-width="14" stroke-linecap="round"/><text x="26" y="79" fill="#416b76" font-size="20">B</text><text x="26" y="114" fill="#416b76" font-size="20">A</text><text x="92" y="168" fill="#55727a" text-anchor="middle">1</text><text x="192" y="168" fill="#55727a" text-anchor="middle">2</text><text x="292" y="168" fill="#55727a" text-anchor="middle">3</text><text x="392" y="168" fill="#55727a" text-anchor="middle">4</text><text x="492" y="168" fill="#55727a" text-anchor="middle">5</text><text x="285" y="32" text-anchor="middle" font-size="15" fill="#507582">B contiene A</text></svg>';r.append(d);
 }else if(type==='epsilon'){
 $('visualIntro').textContent='En S=(0,1), inf S=0. Elige un h positivo y construye un elemento x=h/2.';
 var row=node('div','','vizline'),lab=node('label'),slide=document.createElement('input'),out=node('div','','result');
 slide.type='range';slide.min=.1;slide.max=.9;slide.step=.05;slide.value=.4;function update(){var h=+slide.value,x=h/2;lab.textContent='h = '+h.toFixed(2);out.textContent='Tomamos x = '+x.toFixed(3)+'. Así 0 < x < h y x pertenece a (0,1).';}slide.addEventListener('input',update);row.append(lab,slide);update();r.append(row,out);
 }else if(type==='product'){
 $('visualIntro').textContent='Con x=1/2, calcula ambos miembros para diferentes números de factores.';
 var row=node('div','','vizline'),lab=node('label'),slide=document.createElement('input'),out=node('div','','result');
 slide.type='range';slide.min=1;slide.max=7;slide.step=1;slide.value=3;
 function update(){var n=+slide.value,p=1,x=.5;for(var i=1;i<=n;i++)p*=1+Math.pow(x,Math.pow(2,i-1));var rhs=(1-Math.pow(x,Math.pow(2,n)))/(1-x);lab.textContent='n = '+n;out.textContent='Producto = '+p.toFixed(8)+'  |  Cociente = '+rhs.toFixed(8)+'  → Coinciden.';}slide.addEventListener('input',update);row.append(lab,slide);update();r.append(row,out);
 }}
function mathNode(tex){var e=node('div','','result visualmath');math(e,tex);return e;}
$('back').addEventListener('click',goHome);$('play').addEventListener('click',play);$('prev').addEventListener('click',function(){if(active)jump(Math.max(0,stepIndex-1));});$('next').addEventListener('click',function(){if(active)jump(Math.min(active.steps.length-1,stepIndex+1));});$('rewind').addEventListener('click',function(){if(active&&sounds[active.id]){track.currentTime=Math.max(0,track.currentTime-10);timeSync();}});
$('seek').addEventListener('input',function(e){if(!active)return;if(sounds[active.id]){track.currentTime=+e.target.value;timeSync();}else{setStep(+e.target.value);}});
$('speed').addEventListener('change',function(e){track.playbackRate=+e.target.value;});
$('full').addEventListener('click',function(){if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen();}else{$('player').requestFullscreen&&$('player').requestFullscreen();}});
$('restart').addEventListener('click',function(){jump(0);track.pause();});
$('copyLink').addEventListener('click',function(){var u=location.href;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(function(){$('status').textContent='Enlace de la clase copiado.';}).catch(function(){$('status').textContent='Puedes copiar el enlace: '+u;});}else{$('status').textContent='Puedes copiar el enlace: '+u;}});
track.addEventListener('timeupdate',timeSync);track.addEventListener('seeked',timeSync);
track.addEventListener('play',function(){$('play').textContent='Ⅱ';$('status').textContent='Reproduciendo narración. Puedes pausar y repetir los pasos.';});
track.addEventListener('pause',function(){if(active&&sounds[active.id])$('play').textContent='▶';});
track.addEventListener('waiting',function(){$('status').textContent='Cargando voz...';});
track.addEventListener('ended',function(){$('play').textContent='▶';$('status').textContent='Clase completada. Comprueba tu comprensión con la pregunta final.';});
track.addEventListener('error',function(){if(active&&sounds[active.id]&&!usingFallback){usingFallback=true;track.src=sounds[active.id].url;track.load();$('status').textContent='Intentando la conexión alternativa de audio...';}else{$('status').textContent='La narración no está disponible temporalmente; puedes estudiar los pasos con sus explicaciones escritas.';}});
document.addEventListener('keydown',function(e){if($('study').hidden||e.target.closest('button,input,select'))return;if(e.key==='ArrowRight'&&active){e.preventDefault();jump(Math.min(active.steps.length-1,stepIndex+1));}if(e.key==='ArrowLeft'&&active){e.preventDefault();jump(Math.max(0,stepIndex-1));}if(e.code==='Space'&&active&&sounds[active.id]){e.preventDefault();play();}});
Promise.all([
 fetch('/lessons.json').then(function(r){if(!r.ok)throw Error('clases');return r.json();}),
 fetch('/audio.json').then(function(r){if(!r.ok)throw Error('narraciones');return r.json();})
]).then(function(results){lessons=results[0].lessons;sounds=results[1];catalog();var hash=decodeURIComponent(location.hash||'');if(hash.indexOf('#clase/')===0)open(hash.slice(7));})
.catch(function(e){$('catalog').textContent='No fue posible cargar el contenido. Actualiza la página. Detalle: '+e.message;});
})();