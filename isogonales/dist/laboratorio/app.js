/* IsogonalLab: interfaz sin servicios externos ni datos del estudiante. */
(function(){
'use strict';
const M=globalThis.IsogonalMath;
if(!M)throw Error('El modelo geométrico no cargó');
const $=id=>document.getElementById(id);
const canvas=$('plot'),ctx=canvas.getContext('2d'),palette={purple:'#8054d8',green:'#138e68',amber:'#bd781f',ink:'#273f41'};
const params=new URLSearchParams(location.search);
let family=Object.hasOwn(M.families,params.get('familia'))?params.get('familia'):'radial';
let gamma=Number(params.get('angulo'));if(!Number.isFinite(gamma)||gamma<10||gamma>80)gamma=55;
const defaults={parallel:[0,1.3],radial:[2,1],hyper:[2,1.5],parab:[-1.5,1.3]};
let seed=[...defaults[family]],target=60;
const visible={known:true,field:true,tangents:true,curve:true};
let width=600,height=440,scale=40,centerX=300,centerY=220,frame=0;
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const finite=value=>Number.isFinite(value);
const fmt=(value,d=2)=>finite(value)?value.toFixed(d):'vertical';
function toScreen(p){return [centerX+scale*p[0],centerY-scale*p[1]]}
function toWorld(x,y){return [(x-centerX)/scale,(centerY-y)/scale]}
function resize(){
 const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
 width=Math.max(300,rect.width||600);height=Math.max(200,rect.height||440);
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);
 centerX=width/2;centerY=height/2;scale=Math.min(width/11.8,height/10.2);
 draw();
}
function requestDraw(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;draw()})}
function path(points,color,lineWidth=2,alpha=1,dashed=false){
 ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.globalAlpha=alpha;
 ctx.setLineDash(dashed?[4,6]:[]);
 let previous=null;
 for(const p of points){
  if(!p||!p.every(finite)||Math.max(Math.abs(p[0]),Math.abs(p[1]))>30){previous=null;continue}
  const [x,y]=toScreen(p);
  if(previous&&Math.hypot(x-previous[0],y-previous[1])<Math.max(width,height)*.65)ctx.lineTo(x,y);
  else ctx.moveTo(x,y);
  previous=[x,y];
 }
 ctx.stroke();ctx.globalAlpha=1;ctx.setLineDash([]);
}
function segment(a,b,color,weight=2,alpha=1,dash=false){path([a,b],color,weight,alpha,dash)}
function label(text,p,color=palette.ink){
 const [x,y]=toScreen(p);ctx.fillStyle=color;ctx.font='12px system-ui, sans-serif';ctx.fillText(text,x,y);
}
function background(){
 ctx.fillStyle='#fcfefc';ctx.fillRect(0,0,width,height);
 const radius=6.5;
 for(let i=-Math.ceil(radius);i<=Math.ceil(radius);i++){
  segment([i,-radius],[i,radius],'#dfe9e4',.65);
  segment([-radius,i],[radius,i],'#dfe9e4',.65);
 }
 segment([-radius,0],[radius,0],'#8fa6a0',1.35);
 segment([0,-radius],[0,radius],'#8fa6a0',1.35);
 label('x',[width/(2*scale)-.33,-.3]);label('y',[.16,height/(2*scale)-.24]);
 for(const v of [-4,-2,2,4]){label(String(v),[v,-.24],'#9faeaa');label(String(v),[.11,v],'#9faeaa')}
}
function knownCurvePoints(C,branch){
 const points=[];
 if(family==='parallel'){return [[-7,C],[7,C]]}
 if(family==='radial'){
  const a=C;return [[-9*Math.cos(a),-9*Math.sin(a)],[9*Math.cos(a),9*Math.sin(a)]];
 }
 if(family==='hyper'){
  const start=branch<0?-7:.16,end=branch<0?-.16:7;
  for(let i=0;i<=260;i++){const x=start+(end-start)*i/260;points.push([x,C/x])}
  return points;
 }
 for(let i=0;i<=240;i++){const x=-6+12*i/240;points.push([x,x*x+C])}
 return points;
}
function drawKnown(){
 const values=family==='parallel'?[-4,-3,-2,-1,0,1,2,3,4]:family==='radial'?Array.from({length:12},(_,i)=>i*Math.PI/12):family==='hyper'?[-8,-5,-3,-1,1,3,5,8]:[-10,-7,-4,-1,2,5];
 for(const c of values){
  for(const side of family==='hyper'?[-1,1]:[1])path(knownCurvePoints(c,side),palette.purple,1.45,.31,family==='radial');
 }
 let constant=M.pointConstant(family,...seed);
 if(family==='radial')constant=Math.atan2(seed[1],seed[0]);
 if(constant!==null){for(const side of family==='hyper'?[-1,1]:[1])path(knownCurvePoints(constant,side),palette.purple,3.2,.96)}
}
function drawField(){
 for(let x=-5.5;x<=5.5;x+=.65)for(let y=-4.5;y<=4.5;y+=.65){
  const v=M.soughtTangent(family,x,y,gamma);if(!v)continue;
  const r=.17,a=[x-r*v[0],y-r*v[1]],b=[x+r*v[0],y+r*v[1]];
  segment(a,b,'#7cae9b',.95,.58);
 }
}
function tangentMark(){
 const v=M.knownTangent(family,...seed),known=v?M.unit(v):null,target=M.soughtTangent(family,...seed,gamma);
 if(!known||!target)return;
 const length=.89,p=seed;
 segment([p[0]-known[0]*length,p[1]-known[1]*length],[p[0]+known[0]*length,p[1]+known[1]*length],palette.purple,3.2);
 segment([p[0]-target[0]*length,p[1]-target[1]*length],[p[0]+target[0]*length,p[1]+target[1]*length],palette.green,3.2);
 const a=Math.atan2(known[1],known[0]),angle=M.rad(gamma),radius=25/scale;
 const pts=Array.from({length:45},(_,i)=>[p[0]+radius*Math.cos(a+angle*i/44),p[1]+radius*Math.sin(a+angle*i/44)]);
 path(pts,palette.amber,3);
 label('γ',[p[0]+(radius+.23)*Math.cos(a+angle/2),p[1]+(radius+.23)*Math.sin(a+angle/2)],palette.amber);
}
function draw(){
 if(!ctx)return;
 ctx.save();ctx.beginPath();ctx.rect(0,0,width,height);ctx.clip();background();
 if(visible.known)drawKnown();
 if(visible.field)drawField();
 if(visible.curve){
  const points=M.trace(family,seed,gamma,{limit:8,step:.027,maxSteps:1200});
  path(points,palette.green,3.3,.99);
 }
 if(visible.tangents)tangentMark();
 const [px,py]=toScreen(seed);
 ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fillStyle=palette.amber;ctx.fill();
 ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();
 ctx.fillStyle=palette.amber;ctx.font='bold 13px system-ui';ctx.fillText('P',px+9,py-11);
 ctx.restore();
}
function renderMath(tex,id){
 const node=typeof id==='string'?$(id):id;
 if(!node)return;
 try{katex.render(tex,node,{throwOnError:true,displayMode:node.classList.contains('math-display'),strict:'ignore'})}
 catch(error){node.textContent=tex;console.error(error)}
}
function updateEquations(){
 const f=M.families[family],data=M.mathAt(family,gamma,seed);
 $('family-description').textContent=f.description;
 $('plot-subtitle').textContent=f.label;
 $('angle-value').textContent=gamma+'°';
 $('angle').value=String(gamma);
 $('k-value').textContent=fmt(data.k,3);
 $('slope-known').textContent=fmt(M.knownSlope(family,...seed),3);
 $('slope-sought').textContent=fmt(M.searchedSlope(family,...seed,gamma),3);
 $('point-readout').textContent='P = ('+fmt(seed[0])+', '+fmt(seed[1])+')';
 const a=M.knownTangent(family,...seed),b=M.soughtTangent(family,...seed,gamma);
 $('angle-measured').textContent=fmt(M.angleBetweenUnoriented(a,b),1)+'°';
 $('plot-status').textContent='Punto P seleccionado; curva isogonal calculada por Runge–Kutta de orden 4.';
 $('given-title').textContent=f.label;
 $('known-explanation').textContent='Selecciona otro punto del plano para elegir otra curva de esta familia.';
 $('method').textContent=f.method;
 renderMath(f.given,'math-given');
 renderMath('\\dfrac{dy}{dx}='+f.known,'math-derivative');
 renderMath(f.ode,'math-ode');
 renderMath(f.solution,'math-solution');
 document.querySelectorAll('[data-formula]').forEach(node=>renderMath(node.dataset.formula,node));
 document.querySelectorAll('.family-tab').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.family===family)));
}
function update(){
 updateEquations();requestDraw();
 try{history.replaceState(null,'','?familia='+encodeURIComponent(family)+'&angulo='+gamma+'#laboratorio')}catch(_){}
}
document.querySelectorAll('.family-tab').forEach(button=>button.addEventListener('click',()=>{
 family=button.dataset.family;seed=[...defaults[family]];update();
}));
$('angle').addEventListener('input',event=>{gamma=clamp(Number(event.target.value),10,80);update()});
for(const [id,key] of [['show-known','known'],['show-field','field'],['show-tangents','tangents'],['show-curve','curve']]){
 $(id).addEventListener('change',event=>{visible[key]=event.target.checked;requestDraw()});
}
function pointFromClient(clientX,clientY){
 const r=canvas.getBoundingClientRect(),x=clientX-r.left,y=clientY-r.top;
 if(x<0||x>r.width||y<0||y>r.height)return;
 const p=toWorld(x,y);
 if((family==='radial'||family==='hyper')&&Math.hypot(...p)<.15){$('plot-status').textContent='El origen es singular en esta familia. Selecciona un punto diferente.';return}
 seed=[clamp(p[0],-6,6),clamp(p[1],-6,6)];update();
}
canvas.addEventListener('pointerdown',event=>pointFromClient(event.clientX,event.clientY));
canvas.addEventListener('keydown',event=>{
 const delta=.25,p=[...seed];
 if(event.key==='ArrowLeft')p[0]-=delta;
 else if(event.key==='ArrowRight')p[0]+=delta;
 else if(event.key==='ArrowUp')p[1]+=delta;
 else if(event.key==='ArrowDown')p[1]-=delta;
 else return;
 event.preventDefault();
 if((family==='radial'||family==='hyper')&&Math.hypot(...p)<.15)return;
 seed=p;update();
});
$('reset').addEventListener('click',()=>{
 seed=[...defaults[family]];gamma=55;for(const key in visible){visible[key]=true}
 for(const [id,key] of [['show-known','known'],['show-field','field'],['show-tangents','tangents'],['show-curve','curve']])$(id).checked=true;
 update();
});
$('new-challenge').addEventListener('click',()=>{
 const options=[30,40,50,60,70,75].filter(v=>v!==target);
 target=options[Math.floor(Math.random()*options.length)];
 $('target-angle').textContent=target+'°';
 $('challenge-feedback').textContent='Nuevo objetivo: ajusta el deslizador y comprueba.';
});
$('check-challenge').addEventListener('click',()=>{
 const difference=Math.abs(gamma-target);
 $('challenge-feedback').textContent=difference<=2?'Correcto. El ángulo construido está dentro de una tolerancia de 2°.':'Aún faltan '+fmt(difference,0)+'°. Modifica γ y vuelve a comprobar.';
});
window.addEventListener('resize',resize);
if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);
resize();updateEquations();
})();
