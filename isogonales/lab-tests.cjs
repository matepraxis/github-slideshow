'use strict';
const assert=require('node:assert/strict');
const M=require('./dist/laboratorio/math.js');
const cases=[['parallel',[0,1.3]],['radial',[2,1]],['hyper',[2,1.5]],['parab',[-1.5,1.3]]];
assert.equal(Object.keys(M.families).length,4);
for(const [family,seed] of cases){
 for(const gamma of [20,40,60,75]){
  const k=Math.tan(M.rad(gamma)),f=M.knownSlope(family,...seed),h=M.searchedSlope(family,...seed,gamma);
  assert.ok(Number.isFinite(f),'Known slope must be finite at seed for '+family);
  assert.ok(Number.isFinite(h),'Target slope must be finite at seed for '+family);
  assert.ok(Math.abs(h-(f+k)/(1-f*k))<1e-8,'Slope formula '+family);
  const known=M.knownTangent(family,...seed),wanted=M.soughtTangent(family,...seed,gamma);
  assert.ok(Math.abs(M.angleBetweenUnoriented(known,wanted)-gamma)<1e-8,'Wrong angle '+family);
  const curve=M.trace(family,seed,gamma,{step:.015,maxSteps:500,limit:6});
  assert.ok(curve.length>120,'Trace too short '+family);
  const i=curve.findIndex(p=>Math.abs(p[0]-seed[0])<1e-8&&Math.abs(p[1]-seed[1])<1e-8);
  assert.ok(i>=20&&i<curve.length-20,'Seed not in trace');
  const c=M.invariant(family,...seed,gamma);
  for(let j=-12;j<=12;j+=4){
   const p=curve[i+j];
   const val=M.invariant(family,...p,gamma);
   assert.ok(Number.isFinite(val),'Undefined invariant '+family);
   assert.ok(Math.abs(val-c)<.03,'Not preserving analytic solution '+family+' γ='+gamma);
  }
 }
}
assert.equal(M.families.parallel.solution,'y=kx+A');
assert.ok(M.families.radial.solution.includes('e^{'));
assert.ok(M.families.hyper.solution.includes('x^2-y^2'));
assert.ok(M.families.parab.solution.includes('ln'));
assert.equal(M.knownTangent('radial',0,0),null);
assert.throws(()=>M.trace('unknown',[1,2],30),/desconocida/);
console.log('IsogonalLab: 4 familias × 4 ángulos, pendientes, RK4, invariantes y singularidades correctos.');
