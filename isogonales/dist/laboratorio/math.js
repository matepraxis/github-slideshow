/* IsogonalLab: núcleo matemático independiente del DOM y de Render. */
(function(root){
'use strict';
const TAU=2*Math.PI, rad=deg=>deg*Math.PI/180;
const families={
 parallel:{label:'Rectas paralelas',given:'y=C',description:'Pendiente conocida nula; las buscadas son rectas inclinadas.',known:'0',
   ode:'\\dfrac{dy}{dx}=k',solution:'y=kx+A',method:'Integrando ambos miembros respecto de x.'},
 radial:{label:'Rectas radiales',given:'y=Cx',description:'Todas las rectas pasan por el origen; aparecen espirales logarítmicas.',known:'\\dfrac{y}{x}',
   ode:'\\dfrac{dy}{dx}=\\dfrac{y+kx}{x-ky}',solution:'r=Ae^{\\theta/k}',method:'EDO homogénea: z=y/x, separación e integración; conversión a polares.'},
 hyper:{label:'Hipérbolas',given:'xy=C',description:'Las buscadas también son hipérbolas, con sus ejes rotados.',known:'-\\dfrac{y}{x}',
   ode:'\\dfrac{dy}{dx}=\\dfrac{kx-y}{x+ky}',solution:'k(x^2-y^2)-2xy=A',method:'Reordenando la EDO se obtiene una diferencial exacta.'},
 parab:{label:'Parábolas',given:'y=x^2+C',description:'Una EDO cuyo campo de direcciones presenta tangentes verticales.',known:'2x',
   ode:'\\dfrac{dy}{dx}=\\dfrac{2x+k}{1-2kx}',solution:'y=-\\dfrac{x}{k}-\\dfrac{1+k^2}{2k^2}\\ln|1-2kx|+A',method:'Descomponiendo la fracción e integrando en cada intervalo de definición.'}
};
function validateFamily(family){if(!Object.hasOwn(families,family))throw Error('Familia desconocida');return family;}
function validateAngle(deg){if(!Number.isFinite(deg)||deg<5||deg>85)throw Error('Ángulo fuera de 5°–85°');return deg;}
function knownTangent(family,x,y){
 validateFamily(family);
 if(!Number.isFinite(x)||!Number.isFinite(y))return null;
 switch(family){
  case 'parallel':return [1,0];
  case 'radial':return Math.hypot(x,y)<1e-7?null:[x,y];
  case 'hyper':return Math.hypot(x,y)<1e-7?null:[x,-y];
  case 'parab':return [1,2*x];
 }
}
function unit(vec){if(!vec)return null;const n=Math.hypot(...vec);return n<1e-10?null:[vec[0]/n,vec[1]/n];}
function soughtTangent(family,x,y,angle){
 validateAngle(angle);
 const v=unit(knownTangent(family,x,y));if(!v)return null;
 const c=Math.cos(rad(angle)),s=Math.sin(rad(angle));
 return [c*v[0]-s*v[1],s*v[0]+c*v[1]];
}
function knownSlope(family,x,y){
 validateFamily(family);
 if(family==='parallel')return 0;
 if(family==='parab')return 2*x;
 return Math.abs(x)>1e-10?(family==='radial'?y/x:-y/x):null;
}
function searchedSlope(family,x,y,angle){
 validateAngle(angle);
 const v=soughtTangent(family,x,y,angle);
 if(!v||Math.abs(v[0])<1e-8)return null;
 return v[1]/v[0];
}
function pointConstant(family,x,y){
 validateFamily(family);
 if(!Number.isFinite(x)||!Number.isFinite(y))throw Error('Punto inválido');
 switch(family){
  case 'parallel':return y;
  case 'radial':return Math.abs(x)>1e-8?y/x:null;
  case 'hyper':return x*y;
  case 'parab':return y-x*x;
 }
}
function invariant(family,x,y,angle){
 const k=Math.tan(rad(validateAngle(angle)));
 switch(validateFamily(family)){
  case 'parallel':return y-k*x;
  case 'hyper':return k*(x*x-y*y)-2*x*y;
  case 'parab':return -x/k-(1+k*k)/(2*k*k)*Math.log(Math.abs(1-2*k*x))-y;
  case 'radial':return Math.hypot(x,y)*Math.exp(-Math.atan2(y,x)/k); // rama angular local
 }
}
function rk4(family,x,y,angle,h){
 const vector=(xx,yy)=>soughtTangent(family,xx,yy,angle);
 const k1=vector(x,y);if(!k1)return null;
 const k2=vector(x+h*k1[0]/2,y+h*k1[1]/2);if(!k2)return null;
 const k3=vector(x+h*k2[0]/2,y+h*k2[1]/2);if(!k3)return null;
 const k4=vector(x+h*k3[0],y+h*k3[1]);if(!k4)return null;
 const xx=x+h*(k1[0]+2*k2[0]+2*k3[0]+k4[0])/6,yy=y+h*(k1[1]+2*k2[1]+2*k3[1]+k4[1])/6;
 return Number.isFinite(xx)&&Number.isFinite(yy)?[xx,yy]:null;
}
function trace(family,seed,angle,options={}){
 validateFamily(family);validateAngle(angle);
 const limit=options.limit||8,step=options.step||0.035,maxSteps=options.maxSteps||1400;
 if(!Array.isArray(seed)||seed.length!==2||!seed.every(Number.isFinite))throw Error('Semilla inválida');
 const walk=sign=>{
  let pos=[...seed],arr=[];
  for(let i=0;i<maxSteps;i++){
   const next=rk4(family,pos[0],pos[1],angle,step*sign);
   if(!next||Math.max(Math.abs(next[0]),Math.abs(next[1]))>limit||Math.hypot(next[0]-pos[0],next[1]-pos[1])<1e-9)break;
   if((family==='radial'||family==='hyper')&&Math.hypot(...next)<.025)break;
   arr.push(next);pos=next;
  }
  return arr;
 };
 return [...walk(-1).reverse(),[...seed],...walk(1)];
}
function angleBetweenUnoriented(a,b){
 const aa=unit(a),bb=unit(b);if(!aa||!bb)return null;
 return Math.acos(Math.min(1,Math.abs(aa[0]*bb[0]+aa[1]*bb[1])))*180/Math.PI;
}
function mathAt(family,angle,seed){
 const k=Math.tan(rad(validateAngle(angle))),f=families[validateFamily(family)];
 return {k,known:f.given,knownDerivative:f.known,ode:f.ode,solution:f.solution,method:f.method,givenConstant:seed?pointConstant(family,...seed):null};
}
const api={TAU,rad,families,validateFamily,validateAngle,knownTangent,soughtTangent,knownSlope,searchedSlope,pointConstant,invariant,rk4,trace,angleBetweenUnoriented,mathAt};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.IsogonalMath=api;
})(typeof globalThis!=='undefined'?globalThis:this);
