(function(){
'use strict';
const M=globalThis.PresentationModel,$=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let saved;try{saved=JSON.parse(localStorage.getItem('uq-isogonales-v1')||'null');}catch(_){}
// Migrar marcadores guardados de la versión anterior a la nueva diapositiva de contenido.
if(saved&&saved.schema!==2&&Number.isInteger(saved.slide)&&saved.slide>=1)saved.slide+=1;
let state=M.initial(saved);
const blockCount=slide=>slide?.body?.length||0;
const countFor=slide=>Math.max(1,blockCount(slide));
let reveal=Math.max(1,Math.min(countFor(M.slides[state.slide]),Number.isFinite(+saved?.reveal)?Math.round(+saved.reveal):1));
const radialStart=M.slides.findIndex(s=>s.title==='Ejemplo: familia de rectas');
const radialSlide=index=>index>=radialStart&&index<=radialStart+7;
const exampleScenes=['Familia de rectas','Recta particular por P','Pendiente f de la recta','Tangente de la buscada','Sustitución z=y/x','Separación e integración','Retícula polar','Espiral logarítmica','Comprobación angular'];
const defaultExamplePhase=(slide,step)=>{
 const relative=slide-radialStart;
 return relative===0?(step<=2?0:step<=4?1:2):relative===1?3:relative===2||relative===3?4:relative===4||relative===5?5:relative===6?6:relative===7?(step>=3?8:7):0;
};
let examplePhase=Number.isFinite(+saved?.examplePhase)?Math.max(0,Math.min(8,Math.round(+saved.examplePhase))):defaultExamplePhase(state.slide,reveal);
let manualExampleStage=false;
let familiesVisible=Boolean(saved?.familiesVisible);
const phaseNames=['Familias','Curva conocida y punto P','Segunda curva por P','Rectas tangentes','Triángulo y ángulos'];
const phaseActions=['Mostrar las familias','Mostrar la curva conocida','Añadir la curva buscada','Trazar las tangentes','Mostrar los ángulos'];
const colors={green:'#138e68',purple:'#774fc4',orange:'#bb650c',blue:'#1b65a4',gray:'#a2ada6',ink:'#343a38'};
function renderMath(tex,display=true){return katex.renderToString(tex,{displayMode:display,throwOnError:true,strict:'error',trust:false,output:'htmlAndMathml'});}
function prose(value){return escape(value).replace(/\\\((.*?)\\\)/g,(_,tex)=>renderMath(tex.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"'),false));}
function bodyHTML(slide){return slide.body.map((b,i)=>'<div class="reveal-block" data-reveal-index="'+i+'"'+(i>=reveal?' hidden':'')+'>'+(b.type==='eq'?'<div class="equation '+escape(b.color||'')+(b.emphasis?' emphasis':'')+'">'+renderMath(b.tex||PresentationLatex.fromAST(b.ast))+'</div>':'<p>'+prose(b.value)+'</p>')+'</div>').join('');}
function svgEl(tag,attrs={},text){const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;return e;}
const X=x=>35+58*x,Y=y=>360-58*y;
function dpath(points,fx=X,fy=Y){return points.map((p,i)=>(i?'L':'M')+fx(p[0]).toFixed(2)+','+fy(p[1]).toFixed(2)).join(' ');}
function geoLabel(parent,txt,x,y,color=colors.ink,attrs={}){if(attrs['font-size'])attrs.style='font-size:'+attrs['font-size']+'px';parent.append(svgEl('text',{x:X(x),y:Y(y),fill:color,...attrs},txt));}
function buildGeometry(){
 const svg=$('geometry-svg');
 const defs=svgEl('defs');const clip=svgEl('clipPath',{id:'geo-clip'});clip.append(svgEl('rect',{x:22,y:5,width:476,height:383}));defs.append(clip);svg.append(defs);
 function group(stage){const g=svgEl('g',{'data-stage':stage,class:'construction'});svg.append(g);return g;}
 const preview=svgEl('g',{'data-family-preview':'true',class:'construction'});
 svg.append(preview);
 const previewLine=(pts,color)=>preview.append(svgEl('path',{d:dpath(pts),fill:'none',stroke:color,'stroke-width':2,opacity:.55,'clip-path':'url(#geo-clip)'}));
 for(const factor of [.78,1.16,1.34])previewLine(M.knownPoints.map(([x,y])=>[x*factor,y*factor]),colors.purple);
 for(const radius of [2.9,3.7,5.4]){
  const arc=Array.from({length:140},(_,i)=>{const a=.05+(Math.PI/2-.1)*i/139;return [radius*Math.cos(a),radius*Math.sin(a)];});
  previewLine(arc,colors.green);
 }
 const axes=group(1);
 axes.append(svgEl('path',{d:'M22,360H495 M35,390V8',fill:'none',stroke:colors.gray,'stroke-width':1.4}));
 axes.append(svgEl('path',{d:'M488,356L495,360L488,364 M31,15L35,8L39,15',fill:'none',stroke:colors.gray,'stroke-width':1.4}));
 geoLabel(axes,'x',7.75,-.36,colors.gray);geoLabel(axes,'y',.16,5.91,colors.gray);geoLabel(axes,'O',-.23,-.35,colors.gray,{'font-size':17});
 const known=group(1);known.append(svgEl('path',{d:dpath(M.knownPoints),fill:'none',stroke:colors.purple,'stroke-width':3.5,'clip-path':'url(#geo-clip)'}));geoLabel(known,'f',4.7,4.95,colors.purple);
 const sought=group(2);sought.append(svgEl('path',{d:dpath(M.soughtPoints),fill:'none',stroke:colors.green,'stroke-width':3.5,'clip-path':'url(#geo-clip)'}));geoLabel(sought,'h',1.15,4.36,colors.green);
 const tangents=group(3);tangents.setAttribute('clip-path','url(#geo-clip)');
 tangents.append(svgEl('path',{d:dpath([[.15,5.85],[6.65,-.65]]),fill:'none',stroke:colors.green,'stroke-width':2,'stroke-dasharray':'8 5'}));
 tangents.append(svgEl('path',{d:dpath([[.45,3+M.geometry.mf*(.45-3)],[5.1,3+M.geometry.mf*(5.1-3)]]),fill:'none',stroke:colors.purple,'stroke-width':2,'stroke-dasharray':'8 5'}));
 geoLabel(tangents,'t',5.45,1.15,colors.green);geoLabel(tangents,'h',5.59,1.0,colors.green,{'font-size':14});geoLabel(tangents,'t',3.23,4.07,colors.purple);geoLabel(tangents,'f',3.4,3.92,colors.purple,{'font-size':14});
 const angles=group(4),{A,B,P}=M.geometry;
 angles.append(svgEl('path',{d:dpath([B,P,A,B]),fill:'#e2ece660',stroke:'#aab8af','stroke-width':1}));
 angles.append(svgEl('path',{d:dpath([B,A]),fill:'none',stroke:'#6e7c73','stroke-width':2.2}));
 const arc=(center,r,start,end,color)=>{const pts=Array.from({length:55},(_,i)=>{const a=(start+(end-start)*i/54)*Math.PI/180;return [center[0]+r*Math.cos(a),center[1]+r*Math.sin(a)];});angles.append(svgEl('path',{d:dpath(pts),fill:'none',stroke:color,'stroke-width':2.5}));};
 arc(A,.4,0,135,colors.green);arc(B,.43,0,55,colors.purple);arc(P,.48,235,315,colors.orange);
 geoLabel(angles,'α',6.35,.49,colors.green);geoLabel(angles,'β',B[0]+.51,.24,colors.purple);geoLabel(angles,'γ',3,2.30,colors.orange,{'text-anchor':'middle'});
 for(const [name,point] of [['A',A],['B',B]]){angles.append(svgEl('circle',{cx:X(point[0]),cy:Y(point[1]),r:3.4,fill:colors.ink}));geoLabel(angles,name,point[0],-.37,colors.ink,{'text-anchor':'middle',class:'point-name'});}
 const point=group(1);point.append(svgEl('circle',{cx:X(3),cy:Y(3),r:4.5,fill:colors.ink,stroke:'white','stroke-width':2}));geoLabel(point,'P',3.21,3.12,colors.ink,{class:'point-name'});
}
function updateGeometry(){
 $('phase').value=state.phase;$('phase-value').textContent=state.phase+' de 4';$('phase-caption').textContent=phaseNames[state.phase];
 document.querySelectorAll('#geometry-svg [data-stage]').forEach(e=>{const hide=Number(e.dataset.stage)>state.phase;e.classList.toggle('is-hidden',hide);e.setAttribute('aria-hidden',hide);});
 document.querySelectorAll('#geometry-svg [data-family-preview]').forEach(e=>{const hide=!familiesVisible||state.phase!==0;e.classList.toggle('is-hidden',hide);e.setAttribute('aria-hidden',hide);});
 $('geometry-desc').textContent='Etapa '+state.phase+' de cuatro. '+phaseNames[state.phase]+'. La curva conocida es morada y la curva buscada es verde. En la etapa final, α es el ángulo exterior de un triángulo y equivale a β más γ.';
}

function buildRadialExample(){
 const svg=$('example-svg'),sx=x=>260+43*x,sy=y=>214-43*y;
 const plot=pts=>pts.map((p,i)=>(i?'L':'M')+sx(p[0]).toFixed(2)+','+sy(p[1]).toFixed(2)).join(' ');
 const group=(from,until)=>{const g=svgEl('g',{'data-e-from':from,'data-e-until':until,class:'example-layer'});svg.append(g);return g;};
 const path=(g,pts,color,width=2,dash='')=>g.append(svgEl('path',{d:plot(pts),stroke:color,fill:'none','stroke-width':width,'stroke-dasharray':dash,'clip-path':'url(#example-plot-clip)'}));
 const label=(g,txt,x,y,color=colors.ink)=>g.append(svgEl('text',{x:sx(x),y:sy(y),fill:color,class:'example-label'},txt));
 const defs=svgEl('defs'),clip=svgEl('clipPath',{id:'example-plot-clip'});clip.append(svgEl('rect',{x:22,y:14,width:478,height:403}));defs.append(clip);svg.append(defs);
 const cart=group(0,5);
 for(let i=-5;i<=5;i++){path(cart,[[-5.45,i],[5.45,i]],'#e2eae5',.75);path(cart,[[i,-4.5],[i,4.5]],'#e2eae5',.75);}
 path(cart,[[-5.45,0],[5.45,0]],'#8b9d93',1.7);path(cart,[[0,-4.5],[0,4.5]],'#8b9d93',1.7);label(cart,'x',5.25,-.35);label(cart,'y',.25,4.45);
 const polar=group(6,8);
 for(let i=1;i<=5;i++)polar.append(svgEl('circle',{cx:sx(0),cy:sy(0),r:43*i,stroke:'#e2eae5',fill:'none','stroke-width':1}));
 for(let i=0;i<12;i++){const a=i*Math.PI/6;path(polar,[[0,0],[5.6*Math.cos(a),5.6*Math.sin(a)]],'#e2eae5',1);}
 label(polar,'r',4.5,-.4);label(polar,'θ',1.6,.75,colors.orange);
 const rays=group(0,5);
 for(let i=0;i<12;i++){const a=i*Math.PI/12;path(rays,[[-5.8*Math.cos(a),-5.8*Math.sin(a)],[5.8*Math.cos(a),5.8*Math.sin(a)]],colors.purple,1.45,'5 5');}
 const sparseRays=group(6,8);
 for(let i=0;i<6;i++){const a=i*Math.PI/6;path(sparseRays,[[-5.8*Math.cos(a),-5.8*Math.sin(a)],[5.8*Math.cos(a),5.8*Math.sin(a)]],colors.purple,1.1,'5 7');}
 const chosen=group(1,8);path(chosen,[[-5,-5],[5,5]],colors.purple,3.6);label(chosen,'f',3.4,3.75,colors.purple);
 const marker=group(1,8);marker.append(svgEl('circle',{cx:sx(2),cy:sy(2),r:5,fill:colors.ink,stroke:'#fff','stroke-width':2}));label(marker,'P',2.22,2.33);
 const knownTangent=group(2,8);path(knownTangent,[[.65,.65],[3.5,3.5]],colors.purple,3);
 const k=Math.tan(80*Math.PI/180),t0=Math.PI/4,r0=Math.sqrt(8),b=1/k;
 const spiral=t=>{const r=r0*Math.exp(b*(t-t0));return [r*Math.cos(t),r*Math.sin(t)];};
 const tang=group(3,8),m=(1+k)/(1-k);
 path(tang,[[2-.72,2-.72*m],[2+.72,2+.72*m]],colors.green,3.3,'7 4');
 const partial=group(5,6);path(partial,Array.from({length:90},(_,i)=>spiral(t0-.62+i*1.24/89)),colors.green,3.5);
 const full=group(7,8);
 // La espiral logarítmica nunca pasa por el origen: r -> 0 cuando theta -> -infinito.
 // El trazado comienza con radio prácticamente nulo para evitar el corte abrupto.
 const thetaMin=t0-33,thetaMax=t0+4;
 path(full,Array.from({length:1100},(_,i)=>spiral(thetaMin+i*(thetaMax-thetaMin)/1099)),colors.green,3.7);
 const arc=group(8,8);
 path(arc,Array.from({length:50},(_,i)=>{const a=(45+80*i/49)*Math.PI/180;return [2+.54*Math.cos(a),2+.54*Math.sin(a)];}),colors.orange,3.5);
 label(arc,'γ=80°',.62,3.02,colors.orange);
 label(group(0,8),'O',.13,-.34);
}
function updateRadialExample(){
 if(!radialSlide(state.slide))return;
 $('example-phase').value=examplePhase;
 $('example-phase-value').textContent=examplePhase+' de 8';
 $('example-phase-caption').textContent=exampleScenes[examplePhase];
 $('example-description').textContent='Paso '+examplePhase+' de 8: '+exampleScenes[examplePhase]+'. Morado: rectas conocidas; verde: trayectoria isogonal.';
 document.querySelectorAll('#example-svg [data-e-from]').forEach(g=>{
  const hide=examplePhase<Number(g.getAttribute('data-e-from'))||examplePhase>Number(g.getAttribute('data-e-until'));
  g.classList.toggle('is-hidden',hide);g.setAttribute('aria-hidden',hide);
 });
}

function exampleSVG(kind){
 const svg=svgEl('svg',{viewBox:'0 0 440 440',class:'example-svg',role:'img','aria-label':kind==='biology'?'Espiral logarítmica con radios de10,20y40milímetros':kind.startsWith('hyperbola')?'Curva de la familia hiperbólica y trayectoria que se cortan en el punto0,2': 'Rectas radiales y espiral logarítmica con ángulo80grados'});
 let range=kind==='biology'?45:kind.startsWith('hyperbola')?3.25:6;
 const scale=185/range,fx=x=>220+x*scale,fy=y=>220-y*scale;
 const defs=svgEl('defs'),clip=svgEl('clipPath',{id:'example-clip'});clip.append(svgEl('rect',{x:25,y:25,width:390,height:390}));defs.append(clip);svg.append(defs);
 if(kind!=='application-result')svg.append(svgEl('path',{d:'M25,220H415 M220,415V25',fill:'none',stroke:'#bac5bd','stroke-width':1.2}));
 const lbl=(s,p,c,dx=6,dy=-6)=>svg.append(svgEl('text',{x:fx(p[0])+dx,y:fy(p[1])+dy,fill:c},s));
 const curve=(pts,c,width=2.5,dash='')=>svg.append(svgEl('path',{d:dpath(pts,fx,fy),fill:'none',stroke:c,'stroke-width':width,'stroke-dasharray':dash,'clip-path':'url(#example-clip)'}));
 const point=(p,c=colors.ink)=>svg.append(svgEl('circle',{cx:fx(p[0]),cy:fy(p[1]),r:4,fill:c,stroke:'white','stroke-width':1.2}));
 if(kind!=='application-result'){lbl('x',[range,0],colors.gray,-3,23);lbl('y',[0,range],colors.gray,10,3);}

 if(kind.startsWith('materials')){
  const structure=kind==='materials-intro'||kind==='materials-2019';
  const comparison=kind==='materials-results';
  const kMatch=kind.match(/^materials-k([123])$/),k=kMatch?Number(kMatch[1]):2;
  const paths=comparison?[1,2,3]:[k];
  for(let j=0;j<12;j++){
   const a=j*Math.PI/12;
   curve([[-6*Math.cos(a),-6*Math.sin(a)],[6*Math.cos(a),6*Math.sin(a)]],colors.purple,1.25,'6 6');
  }
  const palette={1:colors.green,2:'#1b65a4',3:colors.orange};
  for(const value of paths){
   const pts=Array.from({length:650},(_,i)=>{
    const th=-5.2*value+(5.2*value+2.25)*i/649;
    const rad=2*Math.exp(th/value);
    return [rad*Math.cos(th),rad*Math.sin(th)];
   });
   curve(pts,palette[value],comparison?2.8:3.7);
  }
  if(comparison){
   lbl('k=1',[.5,4.9],colors.green);lbl('k=2',[-4.8,4.1],'#1b65a4');lbl('k=3',[-4.8,3.2],colors.orange);
  }else if(structure){
   lbl('fibras radiales',[.7,4.85],colors.purple);
   lbl('trayectoria isogonal',[-4.8,-4.5],colors.green);
  }else{
   lbl('k='+k,[-4.7,4.7],colors.orange);
   lbl('r = A e^(θ/'+k+')',[-4.7,-4.6],palette[k]);
  }
 }else if(kind.startsWith('hyperbola')){
  const C=.5,K=-2+Math.log(3);curve(Array.from({length:160},(_,i)=>{const y=.28+2.95*i/159;return [1/y-C,y];}),colors.purple);
  curve(Array.from({length:180},(_,i)=>{const y=1.03+2.2*i/179;return [-y+Math.log(Math.abs((1+y)/(1-y)))-K,y];}),colors.green);
  point([0,2]);lbl('P = (0, 2)',[0,2],colors.ink,9,-9);lbl('f',[1.5,.5],colors.purple,7,0);lbl('h',[-1.4,2.8],colors.green);
  if(kind==='hyperbola-check'){curve([[-.3,3.2],[1.3,-3.2]],colors.purple,1.8,'7 5');curve([[-2,3.2],[3.2,.08]],colors.green,1.8,'7 5');}
 }else if(kind==='biology'){
  const b=Math.log(2)/(2*Math.PI);curve(Array.from({length:420},(_,i)=>{const t=4*Math.PI*i/419,r=10*Math.exp(b*t);return [r*Math.cos(t),r*Math.sin(t)];}),colors.green,3);
  for(const [r,dy] of [[10,22],[20,-12],[40,22]]){point([r,0],colors.green);lbl(r+' mm',[r,0],colors.green,-16,dy);}
  for(const q of [-30,-15,15,30]){lbl(String(q),[q,0],'#a2ada6',-9,20);lbl(String(q),[0,q],'#a2ada6',-29,5);}
 }else{
  for(let i=0;i<8;i++){const t=i*Math.PI/4;curve([[0,0],[6*Math.cos(t),6*Math.sin(t)]],colors.purple,1.4);}
  const b=1/Math.tan(80*Math.PI/180);curve(Array.from({length:370},(_,i)=>{const t=-2*Math.PI+4*Math.PI*i/369,r=1.7*Math.exp(b*t);return [r*Math.cos(t),r*Math.sin(t)];}),colors.green,3);
  if(kind==='spiral'){const t=.5,r=1.7*Math.exp(b*t),p=[r*Math.cos(t),r*Math.sin(t)],v=[b*Math.cos(t)-Math.sin(t),b*Math.sin(t)+Math.cos(t)];point(p);curve([[p[0]-v[0],p[1]-v[1]],[p[0]+v[0],p[1]+v[1]]],colors.green,2,'7 5');lbl('γ = 80°',p,colors.orange,12,15);}
 }
 return svg;
}
let slideAnimation;
function syncReveal(){
 if(radialSlide(state.slide)&&!manualExampleStage){examplePhase=defaultExamplePhase(state.slide,reveal);updateRadialExample();}
 const s=M.slides[state.slide],total=blockCount(s);
 document.querySelectorAll('#slide-content [data-reveal-index]').forEach(e=>{
  const index=Number(e.getAttribute('data-reveal-index'));
  e.hidden=index>=reveal||(state.slide===radialStart+4&&index<Math.max(0,reveal-3));
  e.classList.toggle('just-revealed',index===reveal-1&&index<reveal);
 });
 $('previous').disabled=state.slide===0&&reveal<=1;
 $('next').disabled=state.slide===M.slides.length-1&&reveal>=countFor(s);
 $('slide-number').textContent=(state.slide+1)+' / '+M.slides.length+(total>1?' · paso '+reveal+'/'+total:'');
 $('next').setAttribute('aria-label',reveal<countFor(s)?'Mostrar el siguiente paso':'Siguiente diapositiva');
 $('announcement').textContent='Diapositiva '+(state.slide+1)+', paso '+Math.min(reveal,total)+' de '+total+': '+s.title;
}
function renderSlide(){
 const s=M.slides[state.slide],content=$('slide-content'),stage=$('stage');
 content.querySelectorAll('video').forEach(v=>v.pause());
 stage.className=radialSlide(state.slide)?'example-workspace'+(state.slide===radialStart+4?' integral-focus':''):s.kind+(s.graph?' example':s.kind==='example'||s.kind==='recap'||s.kind==='references'?' wide':'');
 $('slide-title').textContent=s.title;
 $('section-current').textContent=s.section&&s.kind!=='cover'&&s.kind!=='agenda'?s.section:'';
 $('geometry').hidden=s.kind!=='theory';$('example-geometry').hidden=!radialSlide(state.slide);$('source-line').textContent=s.source||'';
 content.innerHTML='';
 if(s.kind==='cover'){
  content.innerHTML='<p class="cover-title">TRAYECTORIAS ISOGONALES</p><p class="cover-author">Diego Alejandro Marulanda<br>Maestría en Biomatemáticas</p><p class="cover-course">Ecuaciones Diferenciales<br>Docente: Carlos Andrés Trujillo Salazar</p>';
 }else if(s.kind==='agenda'){
  const list=document.createElement('ol');list.className='agenda-list';
  M.sections.forEach((section,index)=>{
   const li=document.createElement('li'),button=document.createElement('button');
   button.type='button';button.className='agenda-link';
   const count=document.createElement('span');count.className='agenda-counter';count.textContent=String(index+1).padStart(2,'0');
   const title=document.createElement('span');title.textContent=section.title;
   button.append(count,title);
   button.addEventListener('click',()=>dispatch({type:'go',slide:section.slide}));
   li.append(button);list.append(li);
  });
  content.append(list);
 }else if(s.kind==='closing')content.innerHTML='<p class="closing-title">Gracias</p><p>Preguntas y discusión</p>';
 else if(s.kind==='video'){
  const video=document.createElement('video');video.className='film';video.controls=true;video.playsInline=true;video.preload='metadata';video.src='assets/isogonales.mp4';video.setAttribute('aria-label','Animación de las trayectorias isogonales,95 segundos');content.append(video);const p=document.createElement('p');p.innerHTML=prose(s.body[0].value);content.append(p);
 }else if(s.kind==='references'){
  content.innerHTML='<div class="references">'
  +'<p><a href="https://es.scribd.com/document/728964611/N-Piskunov-Calculo-Diferencial-e-Integral-Tomo-II-Editorial-Mir-1977-Esp" target="_blank" rel="noopener">Piskunov, N. (1977). <i>Cálculo diferencial e integral</i>, tomo II.</a><span class="ref-detail">Editorial Mir, § 15. Base conceptual de la demostración y las trayectorias.</span></p>'
  +'<p>Trujillo Salazar, C. A. (2026). <i>ED 1.7: EDO homogéneas.</i><span class="ref-detail">Apuntes de clase, Universidad del Quindío. Procedimiento de sustitución homogénea.</span></p>'
  +'<p>Trujillo Salazar, C. A. (2026). <i>ED 1.8: trayectorias ortogonales e isogonales.</i><span class="ref-detail">Apuntes de clase, Universidad del Quindío. Relación angular, derivación y eliminación del parámetro.</span></p>'
  +'<p><a href="https://doi.org/10.20948/prepr-2017-33" target="_blank" rel="noopener">Galanin, M. P., y Feodorova, N. A. (2017). <i>Reinforcement of Planar Constructions along Isogonal Trajectories.</i></a><span class="ref-detail">Keldysh Institute Preprint 33. DOI: 10.20948/prepr-2017-33.</span></p>'
  +'<p><a href="https://doi.org/10.4028/www.scientific.net/MSF.945.338" target="_blank" rel="noopener">Feodorova, N. (2019). <i>Determination of Fiber-Structure for the Effective Reinforcement of Planar Composite-Material Constructions.</i></a><span class="ref-detail">Materials Science Forum, 945, 338–343.</span></p>'
  +'<p><a href="https://doi.org/10.2307/1301992" target="_blank" rel="noopener">Raup, D. M. (1966). <i>Geometric analysis of shell coiling: General problems.</i></a><span class="ref-detail">Journal of Paleontology, 40(5), 1178–1190. Complemento opcional.</span></p></div>';
 }else if(s.graph&&!radialSlide(state.slide)){
  const graph=document.createElement('div');graph.className='example-graph';
  const originalFigure=s.graph.match(/^materials-k([123])$/);
  if(originalFigure){
   const n=Number(originalFigure[1])+9;
   const img=document.createElement('img');
   img.className='paper-original-figure';img.src='assets/galanin-fig'+n+'.webp';
   img.alt='Figura '+n+' original de Galanin y Feodorova (2017): geometría de refuerzo isogonal con k='+originalFigure[1];
   graph.append(img);
  }else graph.append(exampleSVG(s.graph));
  const cap=document.createElement('p');cap.className='graph-caption';cap.textContent=s.graph==='biology'?'Expansión radial ilustrativa. W = 2, r₀ = 10 mm.':originalFigure?'Figura '+(Number(originalFigure[1])+9)+' original: Galanin y Feodorova (2017), p. 10 del PDF oficial.':s.graph?.startsWith('materials')?'Reconstrucción matemática para explicar el modelo.':s.graph.startsWith('hyperbola')?'Morado: familia conocida. Verde: trayectoria con ángulo de 45°.':'Morado: rectas radiales. Verde: espiral con ángulo de 80°.';graph.append(cap);
  const copy=document.createElement('div');copy.className='example-copy';copy.innerHTML=bodyHTML(s);
  if(s.referenceUrl){
   const link=document.createElement('a');link.className='paper-link';link.href=s.referenceUrl;link.target='_blank';link.rel='noopener';
   link.textContent=s.graph?.startsWith('materials-k')?'Abrir figuras 10–12 originales (artículo PDF)':s.graph==='materials-2019'?'Consultar artículo de Feodorova (2019)':'Consultar publicación original';
   copy.append(link);
  }
  content.append(graph,copy);
 }else content.innerHTML=bodyHTML(s);
 if(s.action!==undefined){const btn=document.createElement('button');btn.className='show-phase';btn.textContent=phaseActions[s.action];btn.addEventListener('click',()=>{
 if(s.action===0){dispatch({type:'toggle-families'});btn.textContent=familiesVisible?'Ocultar las familias':'Mostrar las familias';}
 else dispatch({type:'phase',phase:s.action});
});content.append(btn);}
 syncReveal();
 document.title=s.title+' · Trayectorias isogonales UQ';
 slideAnimation?.cancel();
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&content.animate)slideAnimation=content.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'ease-out'});
 updateNotes();document.querySelectorAll('#contents-list button').forEach((e,i)=>e.setAttribute('aria-current',i===state.slide?'true':'false'));
 // El estado y el contador de pasos se actualizan en syncReveal().
}
function updateNotes(){const s=M.slides[state.slide],elapsed=M.slides.slice(0,state.slide).reduce((a,b)=>a+b.duration,0),time=n=>Math.floor(n/60)+':'+String(n%60).padStart(2,'0');$('notes-title').textContent=s.title;$('notes-time').textContent=s.optional?'Complemento opcional; fuera de los 20 minutos.':'Tiempo sugerido: '+time(elapsed)+'–'+time(elapsed+s.duration);$('notes-body').textContent=s.notes;$('notes-source').textContent=s.source?'Fuente: '+s.source:'';}
function dispatch(action){
 const previous=state;
 if(action.type==='step'){
  const direction=Math.sign(action.delta);
  const total=countFor(M.slides[state.slide]);
  if(direction>0&&reveal<total){reveal++;manualExampleStage=false;syncReveal();}
  else if(direction<0&&reveal>1){reveal--;manualExampleStage=false;syncReveal();}
  else {
   state=M.transition(state,{type:'navigate',delta:direction});
   if(state.slide!==previous.slide){reveal=direction<0?countFor(M.slides[state.slide]):1;manualExampleStage=false;renderSlide();}
  }
 }else{
  state=M.transition(state,action);
  if(state.slide!==previous.slide){reveal=action.type==='navigate'&&action.delta<0?countFor(M.slides[state.slide]):1;manualExampleStage=false;renderSlide();}
  if(state.phase!==previous.phase)updateGeometry();
  if(action.type==='toggle-families'){state.phase=0;familiesVisible=!familiesVisible;updateGeometry();}
  if(action.type==='example-phase'){examplePhase=Math.max(0,Math.min(8,Number(action.phase)||0));manualExampleStage=true;updateRadialExample();}
 }
 try{localStorage.setItem('uq-isogonales-v1',JSON.stringify({...state,reveal,examplePhase,familiesVisible,schema:2}));}catch(_){}
}
function toggleDialog(id){const d=$(id);if(d.open)d.close();else d.showModal();}
function fullscreen(){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>{});}
document.querySelector('.family-legend').innerHTML='<span class="purple">'+renderMath('F(x,y,C)=0',false)+'</span><span class="green">'+renderMath('H(x,y,\\lambda)=0',false)+'</span>';
buildGeometry();updateGeometry();buildRadialExample();updateRadialExample();
$('example-phase').addEventListener('input',e=>dispatch({type:'example-phase',phase:e.target.value}));
M.slides.forEach((s,i)=>{const li=document.createElement('li'),b=document.createElement('button');b.textContent=s.title+(s.optional?' · opcional':'');b.addEventListener('click',()=>{dispatch({type:'go',slide:i});$('contents').close();});li.append(b);$('contents-list').append(li);});
$('phase').addEventListener('input',e=>dispatch({type:'phase',phase:e.target.value}));$('previous').addEventListener('click',()=>dispatch({type:'step',delta:-1}));$('next').addEventListener('click',()=>dispatch({type:'step',delta:1}));$('index').addEventListener('click',()=>toggleDialog('contents'));$('notes-button').addEventListener('click',()=>toggleDialog('notes'));$('fullscreen').addEventListener('click',fullscreen);
document.addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.altKey||['INPUT','TEXTAREA','SELECT','VIDEO'].includes(document.activeElement?.tagName))return;
 if($('contents').open||$('notes').open){if(e.key.toLowerCase()==='n'&&$('notes').open)$('notes').close();return;}
 if(['ArrowRight','PageDown','ArrowLeft','PageUp',' '].includes(e.key)){e.preventDefault();const delta=['ArrowLeft','PageUp'].includes(e.key)?-1:1;dispatch(e.shiftKey&&e.key.startsWith('Arrow')?{type:'phase',phase:state.phase+delta}:{type:e.key.startsWith('Page')?'navigate':'step',delta});}
 if(e.key==='Home'){e.preventDefault();dispatch({type:'go',slide:0});}if(e.key==='End'){e.preventDefault();dispatch({type:'go',slide:M.slides.length-1});}
 if(e.key.toLowerCase()==='n')toggleDialog('notes');if(e.key.toLowerCase()==='i')toggleDialog('contents');if(e.key.toLowerCase()==='f')fullscreen();
});
renderSlide();
})();
