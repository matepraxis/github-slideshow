'use strict';
const assert=require('node:assert/strict'),M=require('./dist/model.js');
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,a+' != '+b);
const derivative=(f,x)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
// Numerical derivative of the integrated hyperbolic family recovers its EDO.
const primitive=y=>-y+Math.log(Math.abs((1+y)/(1-y)));
for(const y of [-3,-1.5,-.5,.2,.7,1.5,2,3]){
 const dxdy=derivative(primitive,y);
 near(1/dxdy,(1-y*y)/(1+y*y));
 const mf=-y*y,mh=1/dxdy;
 near((mh-mf)/(1+mh*mf),1);
}
for(const y of [-1,1])near((1-y*y)/(1+y*y),0);
near(primitive(2)-(-2+Math.log(3)),0);
// Verify the actual spiral tangent against the known radial slope.
for(const deg of [15,45,80])for(const theta of [-.7,.3,.9]){
 const k=Math.tan(deg*Math.PI/180),A=1.7;
 const x=t=>A*Math.exp(t/k)*Math.cos(t),y=t=>A*Math.exp(t/k)*Math.sin(t);
 const mf=y(theta)/x(theta),mh=derivative(y,theta)/derivative(x,theta);
 near((mh-mf)/(1+mf*mh),k,1e-5);
}
assert.equal(M.slides.reduce((n,s)=>n+s.duration,0),1255);
const expected=M.slides.map((s,i)=>s.optional?null:i).filter(i=>i!==null);
let state=M.initial(),visited=[0];
while(state.slide<M.slides.length-1){state=M.transition(state,{type:'navigate',delta:1});visited.push(state.slide);}
assert.deepEqual(visited,expected);
for(const index of M.slides.map((s,i)=>s.optional?i:null).filter(i=>i!==null)){
 assert.equal(M.transition(state,{type:'go',slide:index}).slide,index);
}
while(state.slide>0)state=M.transition(state,{type:'navigate',delta:-1});
assert.equal(state.slide,0);
console.log('Ejemplos, ángulos, soluciones constantes, recorrido principal y duración: correctos.');
