(function(){
'use strict';
const M=globalThis.PresentationModel,$=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let saved;try{saved=JSON.parse(localStorage.getItem('uq-isogonales-v1')||'null');}catch(_){}
let state=M.initial(saved);
const phaseNames=['Familias','Curva conocida y punto P','Segunda curva por P','Rectas tangentes','Triángulo y ángulos'];
const phaseActions=['Mostrar las familias','Mostrar la curva conocida','Añadir la curva buscada','Trazar las tangentes','Mostrar los ángulos'];
const colors={green:'#138e68',purple:'#774fc4',orange:'#bb650c',blue:'#1b65a4',gray:'#a2ada6',ink:'#343a38'};
function mathNode(n){
 if(n.t==='seq')return '<mrow>'+n.nodes.map(mathNode).join('')+'</mrow>';
 if(n.t==='r'){
  if(n.plain)return '<mi mathvariant="normal">'+escape(n.text)+'</mi>';
  return '<mrow>'+(n.text.match(/\s+|arctan|tan|cot|cos|sin|ln|\d+(?:\.\d+)?|./gu)||[]).map(x=>{
   if(/^\s+$/.test(x))return '<mspace width="'+(x.length>2?'.6em':'.15em')+'"/>';
   const tag=/^\d/.test(x)?'mn':/^[\p{L}𝓕𝓗]$/u.test(x)||/^(arctan|tan|cot|cos|sin|ln)$/.test(x)?'mi':'mo';
   return '<'+tag+'>'+escape(x)+'</'+tag+'>';
  }).join('')+'</mrow>';
 }
 if(n.t==='frac')return '<mfrac>'+mathNode(n.num)+mathNode(n.den)+'</mfrac>';
 if(n.t==='sub')return '<msub>'+mathNode(n.base)+mathNode(n.sub)+'</msub>';
 if(n.t==='sup')return '<msup>'+mathNode(n.base)+mathNode(n.pow)+'</msup>';
 if(n.t==='sqrt')return '<msqrt>'+mathNode(n.body)+'</msqrt>';
 throw new Error('Nodo matemático desconocido');
}
function bodyHTML(slide){return slide.body.map(b=>b.type==='eq'?'<div class="equation '+escape(b.color||'')+(b.emphasis?' emphasis':'')+'"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="'+escape(b.alt)+'"><mrow>'+mathNode(b.ast)+'</mrow></math></div>':'<p>'+escape(b.value)+'</p>').join('');}
function svgEl(tag,attrs={},text){const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;return e;}
const X=x=>35+58*x,Y=y=>360-58*y;
function dpath(points,fx=X,fy=Y){return points.map((p,i)=>(i?'L':'M')+fx(p[0]).toFixed(2)+','+fy(p[1]).toFixed(2)).join(' ');}
function geoLabel(parent,txt,x,y,color=colors.ink,attrs={}){if(attrs['font-size'])attrs.style='font-size:'+attrs['font-size']+'px';parent.append(svgEl('text',{x:X(x),y:Y(y),fill:color,...attrs},txt));}
function buildGeometry(){
 const svg=$('geometry-svg');
 const defs=svgEl('defs');const clip=svgEl('clipPath',{id:'geo-clip'});clip.append(svgEl('rect',{x:22,y:5,width:476,height:383}));defs.append(clip);svg.append(defs);
 function group(stage){const g=svgEl('g',{'data-stage':stage,class:'construction'});svg.append(g);return g;}
 const axes=group(1);
 axes.append(svgEl('path',{d:'M22,360H495 M35,390V8',fill:'none',stroke:colors.gray,'stroke-width':1.4}));
 axes.append(svgEl('path',{d:'M488,356L495,360L488,364 M31,15L35,8L39,15',fill:'none',stroke:colors.gray,'stroke-width':1.4}));
 geoLabel(axes,'x',7.75,-.36,colors.gray);geoLabel(axes,'y',.16,5.91,colors.gray);geoLabel(axes,'O',-.23,-.35,colors.gray,{'font-size':17});
 const known=group(1);known.append(svgEl('path',{d:dpath(M.knownPoints),fill:'none',stroke:colors.green,'stroke-width':3.5,'clip-path':'url(#geo-clip)'}));geoLabel(known,'f',1.15,4.36,colors.green);geoLabel(known,'C₀',1.31,4.2,colors.green,{'font-size':14});
 const sought=group(2);sought.append(svgEl('path',{d:dpath(M.soughtPoints),fill:'none',stroke:colors.purple,'stroke-width':3.5,'clip-path':'url(#geo-clip)'}));geoLabel(sought,'h',4.7,4.95,colors.purple);geoLabel(sought,'K₀',4.9,4.8,colors.purple,{'font-size':14});
 const tangents=group(3);tangents.setAttribute('clip-path','url(#geo-clip)');
 tangents.append(svgEl('path',{d:dpath([[.15,5.85],[6.65,-.65]]),fill:'none',stroke:colors.green,'stroke-width':2,'stroke-dasharray':'8 5'}));
 tangents.append(svgEl('path',{d:dpath([[.45,3+M.geometry.mh*(.45-3)],[5.1,3+M.geometry.mh*(5.1-3)]]),fill:'none',stroke:colors.purple,'stroke-width':2,'stroke-dasharray':'8 5'}));
 geoLabel(tangents,'t',5.45,1.15,colors.green);geoLabel(tangents,'f',5.59,1.0,colors.green,{'font-size':14});geoLabel(tangents,'t',3.23,4.07,colors.purple);geoLabel(tangents,'h',3.4,3.92,colors.purple,{'font-size':14});
 const angles=group(4),{A,B,P}=M.geometry;
 angles.append(svgEl('path',{d:dpath([B,P,A,B]),fill:'#e2ece660',stroke:'#aab8af','stroke-width':1}));
 angles.append(svgEl('path',{d:dpath([B,A]),fill:'none',stroke:'#6e7c73','stroke-width':2.2}));
 const arc=(center,r,start,end,color)=>{const pts=Array.from({length:55},(_,i)=>{const a=(start+(end-start)*i/54)*Math.PI/180;return [center[0]+r*Math.cos(a),center[1]+r*Math.sin(a)];});angles.append(svgEl('path',{d:dpath(pts),fill:'none',stroke:color,'stroke-width':2.5}));};
 arc(A,.4,0,135,colors.green);arc(B,.43,0,55,colors.blue);arc(P,.48,235,315,colors.orange);
 geoLabel(angles,'α',6.35,.49,colors.green);geoLabel(angles,'β',B[0]+.51,.24,colors.blue);geoLabel(angles,'γ',3,2.30,colors.orange,{'text-anchor':'middle'});
 for(const [name,point] of [['A',A],['B',B]]){angles.append(svgEl('circle',{cx:X(point[0]),cy:Y(point[1]),r:3.4,fill:colors.ink}));geoLabel(angles,name,point[0],-.37,colors.ink,{'text-anchor':'middle',class:'point-name'});}
 const point=group(1);point.append(svgEl('circle',{cx:X(3),cy:Y(3),r:4.5,fill:colors.ink,stroke:'white','stroke-width':2}));geoLabel(point,'P',3.21,3.12,colors.ink,{class:'point-name'});
}
function updateGeometry(){
 $('phase').value=state.phase;$('phase-value').textContent=state.phase+' de 4';$('phase-caption').textContent=phaseNames[state.phase];
 document.querySelectorAll('#geometry-svg [data-stage]').forEach(e=>{const hide=Number(e.dataset.stage)>state.phase;e.classList.toggle('is-hidden',hide);e.setAttribute('aria-hidden',hide);});
 $('geometry-desc').textContent='Etapa '+state.phase+' de cuatro. '+phaseNames[state.phase]+'. La curva conocida es verde y la curva buscada es morada. En la etapa final, α es el ángulo exterior de un triángulo y equivale a β más γ.';
}
function exampleSVG(kind){
 const svg=svgEl('svg',{viewBox:'0 0 440 440',class:'example-svg',role:'img','aria-label':kind==='biology'?'Espiral logarítmica con radios de10,20y40milímetros':kind.startsWith('hyperbola')?'Curva de la familia hiperbólica y trayectoria que se cortan en el punto0,2': 'Rectas radiales y espiral logarítmica con ángulo80grados'});
 let range=kind==='biology'?45:kind.startsWith('hyperbola')?3.25:6;
 const scale=185/range,fx=x=>220+x*scale,fy=y=>220-y*scale;
 const defs=svgEl('defs'),clip=svgEl('clipPath',{id:'example-clip'});clip.append(svgEl('rect',{x:25,y:25,width:390,height:390}));defs.append(clip);svg.append(defs);
 svg.append(svgEl('path',{d:'M25,220H415 M220,415V25',fill:'none',stroke:'#bac5bd','stroke-width':1.2}));
 const lbl=(s,p,c,dx=6,dy=-6)=>svg.append(svgEl('text',{x:fx(p[0])+dx,y:fy(p[1])+dy,fill:c},s));
 const curve=(pts,c,width=2.5,dash='')=>svg.append(svgEl('path',{d:dpath(pts,fx,fy),fill:'none',stroke:c,'stroke-width':width,'stroke-dasharray':dash,'clip-path':'url(#example-clip)'}));
 const point=(p,c=colors.ink)=>svg.append(svgEl('circle',{cx:fx(p[0]),cy:fy(p[1]),r:4,fill:c,stroke:'white','stroke-width':1.2}));
 lbl('x',[range,0],colors.gray,-3,23);lbl('y',[0,range],colors.gray,10,3);
 if(kind.startsWith('hyperbola')){
  const C=.5,K=2-2*Math.atan(2);curve(Array.from({length:160},(_,i)=>{const y=.28+2.95*i/159;return [1/y-C,y];}),colors.green);
  curve(Array.from({length:180},(_,i)=>{const y=-3.22+6.44*i/179;return [y-2*Math.atan(y)-K,y];}),colors.purple);
  point([0,2]);lbl('P = (0, 2)',[0,2],colors.ink,9,-9);lbl('f',[1.5,.5],colors.green,7,0);lbl('h',[-1.35,-1.35],colors.purple);
  if(kind==='hyperbola-check'){curve([[-.3,3.2],[1.3,-3.2]],colors.green,1.8,'7 5');curve([[-3,2-5],[.72,3.2]],colors.purple,1.8,'7 5');}
 }else if(kind==='biology'){
  const b=Math.log(2)/(2*Math.PI);curve(Array.from({length:420},(_,i)=>{const t=4*Math.PI*i/419,r=10*Math.exp(b*t);return [r*Math.cos(t),r*Math.sin(t)];}),colors.purple,3);
  for(const [r,dy] of [[10,22],[20,-12],[40,22]]){point([r,0],colors.purple);lbl(r+' mm',[r,0],colors.purple,-16,dy);}
  for(const q of [-30,-15,15,30]){lbl(String(q),[q,0],'#a2ada6',-9,20);lbl(String(q),[0,q],'#a2ada6',-29,5);}
 }else{
  for(let i=0;i<8;i++){const t=i*Math.PI/4;curve([[0,0],[6*Math.cos(t),6*Math.sin(t)]],colors.green,1.4);}
  const b=1/Math.tan(80*Math.PI/180);curve(Array.from({length:370},(_,i)=>{const t=-2*Math.PI+4*Math.PI*i/369,r=1.7*Math.exp(b*t);return [r*Math.cos(t),r*Math.sin(t)];}),colors.purple,3);
  if(kind==='spiral'){const t=.5,r=1.7*Math.exp(b*t),p=[r*Math.cos(t),r*Math.sin(t)],v=[b*Math.cos(t)-Math.sin(t),b*Math.sin(t)+Math.cos(t)];point(p);curve([[p[0]-v[0],p[1]-v[1]],[p[0]+v[0],p[1]+v[1]]],colors.purple,2,'7 5');lbl('γ = 80°',p,colors.orange,12,15);}
 }
 return svg;
}
function renderSlide(){
 const s=M.slides[state.slide],content=$('slide-content'),stage=$('stage');
 content.querySelectorAll('video').forEach(v=>v.pause());
 stage.className=s.kind+(s.graph?' example':s.kind==='example'||s.kind==='recap'||s.kind==='references'?' wide':'');
 $('slide-title').textContent=s.title;$('geometry').hidden=s.kind!=='theory';$('source-line').textContent=s.source||'';
 content.innerHTML='';
 if(s.kind==='cover'){
  content.innerHTML='<p class="cover-title">TRAYECTORIAS ISOGONALES</p><p class="cover-author">Diego Alejandro Marulanda<br>Maestría en Biomatemáticas</p><p class="cover-course">Ecuaciones Diferenciales<br>Docente: Carlos Andrés Trujillo Salazar</p>';
 }else if(s.kind==='closing')content.innerHTML='<p class="closing-title">Gracias</p><p>Preguntas y discusión</p>';
 else if(s.kind==='video'){
  const video=document.createElement('video');video.className='film';video.controls=true;video.playsInline=true;video.preload='metadata';video.src='assets/isogonales.mp4';video.setAttribute('aria-label','Animación de las trayectorias isogonales,95 segundos');content.append(video);const p=document.createElement('p');p.textContent=s.body[0].value;content.append(p);
 }else if(s.kind==='references'){
  content.innerHTML='<div class="references"><p><a href="https://es.scribd.com/document/728964611/N-Piskunov-Calculo-Diferencial-e-Integral-Tomo-II-Editorial-Mir-1977-Esp" target="_blank" rel="noopener">Piskunov, N. (1977). <i>Cálculo diferencial e integral</i>, tomo II.</a><span class="ref-detail">Mir. § 15, pp. 48–53. Fuente principal del desarrollo.</span></p><p><a href="https://es.scribd.com/document/233056262/Ecuaciones-Diferenciales-Jaime-Escobar" target="_blank" rel="noopener">Escobar A., J. (s. f.). <i>Ecuaciones diferenciales con aplicaciones en Maple.</i></a><span class="ref-detail">Universidad de Antioquia. § 3.1.1, pp. 49–51.</span></p><p>Trujillo Salazar, C. A. (2026). <i>ED 1.8.</i><span class="ref-detail">Apuntes del curso. Universidad del Quindío.</span></p><p><a href="https://doi.org/10.2307/1301992" target="_blank" rel="noopener">Raup, D. M. (1966). Geometric analysis of shell coiling: General problems.</a><span class="ref-detail"><i>Journal of Paleontology, 40</i>(5), 1178–1190.</span></p></div>';
 }else if(s.graph){
  const graph=document.createElement('div');graph.className='example-graph';graph.append(exampleSVG(s.graph));
  const cap=document.createElement('p');cap.className='graph-caption';cap.textContent=s.graph==='biology'?'Expansión radial ilustrativa. W = 2, r₀ = 10 mm.':s.graph.startsWith('hyperbola')?'Verde: curva conocida. Morado: trayectoria con γ = 45°.':'Verde: rectas radiales. Morado: espiral con γ = 80°.';graph.append(cap);
  const copy=document.createElement('div');copy.className='example-copy';copy.innerHTML=bodyHTML(s);content.append(graph,copy);
 }else content.innerHTML=bodyHTML(s);
 if(s.action!==undefined){const btn=document.createElement('button');btn.className='show-phase';btn.textContent=phaseActions[s.action];btn.addEventListener('click',()=>dispatch({type:'phase',phase:s.action}));content.append(btn);}
 $('previous').disabled=state.slide===0;$('next').disabled=state.slide===M.slides.length-1;$('slide-number').textContent=(state.slide+1)+' / '+M.slides.length;
 document.title=s.title+' · Trayectorias isogonales UQ';
 updateNotes();document.querySelectorAll('#contents-list button').forEach((e,i)=>e.setAttribute('aria-current',i===state.slide?'true':'false'));
 $('announcement').textContent='Diapositiva '+(state.slide+1)+' de '+M.slides.length+': '+s.title;
}
function updateNotes(){const s=M.slides[state.slide],elapsed=M.slides.slice(0,state.slide).reduce((a,b)=>a+b.duration,0),time=n=>Math.floor(n/60)+':'+String(n%60).padStart(2,'0');$('notes-title').textContent=s.title;$('notes-time').textContent='Tiempo sugerido: '+time(elapsed)+'–'+time(elapsed+s.duration);$('notes-body').textContent=s.notes;$('notes-source').textContent=s.source?'Fuente: '+s.source:'';}
function dispatch(action){const previous=state;state=M.transition(state,action);if(state.slide!==previous.slide)renderSlide();if(state.phase!==previous.phase)updateGeometry();try{localStorage.setItem('uq-isogonales-v1',JSON.stringify(state));}catch(_){} }
function toggleDialog(id){const d=$(id);if(d.open)d.close();else d.showModal();}
function fullscreen(){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>{});}
buildGeometry();updateGeometry();
M.slides.forEach((s,i)=>{const li=document.createElement('li'),b=document.createElement('button');b.textContent=s.title;b.addEventListener('click',()=>{dispatch({type:'go',slide:i});$('contents').close();});li.append(b);$('contents-list').append(li);});
$('phase').addEventListener('input',e=>dispatch({type:'phase',phase:e.target.value}));$('previous').addEventListener('click',()=>dispatch({type:'navigate',delta:-1}));$('next').addEventListener('click',()=>dispatch({type:'navigate',delta:1}));$('index').addEventListener('click',()=>toggleDialog('contents'));$('notes-button').addEventListener('click',()=>toggleDialog('notes'));$('fullscreen').addEventListener('click',fullscreen);
document.addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.altKey||['INPUT','TEXTAREA','SELECT','VIDEO'].includes(document.activeElement?.tagName))return;
 if($('contents').open||$('notes').open){if(e.key.toLowerCase()==='n'&&$('notes').open)$('notes').close();return;}
 if(['ArrowRight','PageDown','ArrowLeft','PageUp',' '].includes(e.key)){e.preventDefault();const delta=['ArrowLeft','PageUp'].includes(e.key)?-1:1;dispatch(e.shiftKey?{type:'phase',phase:state.phase+delta}:{type:'navigate',delta});}
 if(e.key==='Home'){e.preventDefault();dispatch({type:'go',slide:0});}if(e.key==='End'){e.preventDefault();dispatch({type:'go',slide:M.slides.length-1});}
 if(e.key.toLowerCase()==='n')toggleDialog('notes');if(e.key.toLowerCase()==='i')toggleDialog('contents');if(e.key.toLowerCase()==='f')fullscreen();
});
renderSlide();
})();
