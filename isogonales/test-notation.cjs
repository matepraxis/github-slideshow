'use strict';
const assert=require('node:assert/strict'),M=require('./dist/model.js');
const tex=i=>M.slides[i].body.filter(b=>b.type==='eq').map(b=>b.tex||'').join(' | ');
assert.ok(tex(11).includes('G\\left(x,y,\\dfrac{dy}{dx}\\right)=0'));
assert.ok(tex(12).includes('G\\left(x,y,\\dfrac{y\'-k}{1+ky\'}\\right)=0'));
assert.ok(!/G\\left\(x,y,p\)|p=f\^|p=\\dfrac/.test(tex(11)+' '+tex(12)));
for(const i of [15,17,18,19,20]){
 const formulas=tex(i);
 assert.ok(formulas.includes('\\dfrac'), 'Faltan fracciones verticales en '+i);
}
assert.ok(tex(16).includes('y\'='));
assert.ok(tex(17).includes('\\dfrac{dy}{dx}'));
assert.ok(tex(17).includes('\\dfrac{dz}{dx}'));
for(const s of M.slides)for(const b of s.body)if(b.type==='eq'&&b.tex)assert.ok(b.alt,'Falta alt');
console.log('Notación: sin p, y-prima en sustitución, derivadas de Leibniz verticales durante resolución.');
