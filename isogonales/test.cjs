'use strict';
const assert=require('node:assert/strict');
const M=require('./dist/model.js');
assert.ok(M.slides.length>=23);

for(let phase=0;phase<=4;phase++){
 let state=M.initial({slide:1,phase});
 for(let i=0;i<22;i++){state=M.transition(state,{type:'navigate',delta:1});assert.equal(state.phase,phase);}
 for(let i=0;i<22;i++){state=M.transition(state,{type:'navigate',delta:-1});assert.equal(state.phase,phase);}
 state=M.transition(state,{type:'go',slide:15});assert.equal(state.phase,phase);
 assert.deepEqual(M.initial(JSON.parse(JSON.stringify(state))),state);
}
assert.deepEqual(M.initial({slide:999,phase:-8}),{slide:M.slides.length-1,phase:0});
const g=M.geometry,near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≠ ${b}`);
near(g.alpha,g.beta+g.gamma);
near((g.mh-g.mf)/(1+g.mf*g.mh),Math.tan(g.gamma));
near((g.mf+Math.tan(g.gamma))/(1-g.mf*Math.tan(g.gamma)),g.mh);
near((g.mh-Math.tan(g.gamma))/(1+g.mh*Math.tan(g.gamma)),g.mf);
near(3+g.mf*(g.B[0]-3),0);near(3+g.mh*(g.A[0]-3),0);
near(Math.sqrt(18-3*3),3);
const t=Math.PI/4,b=g.b,r=Math.sqrt(18),dx=r*(b*Math.cos(t)-Math.sin(t)),dy=r*(b*Math.sin(t)+Math.cos(t));near(dy/dx,g.mf);
near((-4-5/3)/(1-4*5/3),1);
for(const mf of [-4,-1,.1,2,10])for(const deg of [15,30,45,80]){const k=Math.tan(deg*Math.PI/180),mh=(mf+k)/(1-mf*k);near((mh-k)/(1+mh*k),mf);}
function ast(n){assert.ok(['r','seq','frac','sub','sup','sqrt'].includes(n.t));if(n.t==='seq')n.nodes.forEach(ast);if(n.t==='frac'){ast(n.num);ast(n.den);}if(['sub','sup'].includes(n.t)){ast(n.base);ast(n.sub||n.pow);}if(n.t==='sqrt')ast(n.body);}
for(const s of M.slides){assert.ok(s.notes);for(const block of s.body)if(block.type==='eq'){assert.ok(block.alt);if(block.ast)ast(block.ast);else assert.ok(block.tex);}}
console.log(M.slides.length+' diapositivas. Persistencia, triángulo, pendientes y expresiones: correctos.');
