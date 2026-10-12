'use strict';
const assert=require('node:assert/strict'),M=require('./dist/model.js');
const tex=i=>M.slides[i].body.filter(b=>b.type==='eq').map(b=>b.tex||'').join(' | ');
assert.ok(tex(10).includes('G\\left(x,y,\\dfrac{dy}{dx}\\right)=0'));
assert.ok(tex(11).includes('G\\left(x,y,\\dfrac{y\'-k}{1+ky\'}\\right)=0'));
assert.ok(!/G\\left\(x,y,p\)|p=f\^|p=\\dfrac/.test(tex(10)+' '+tex(11)));
for(const i of [14,16,17,18,19]){
 const formulas=tex(i);
 assert.ok(formulas.includes('\\dfrac'), 'Faltan fracciones verticales en '+i);
}
assert.ok(tex(15).includes('y\'='));
assert.ok(tex(16).includes('\\dfrac{dy}{dx}'));
assert.ok(tex(16).includes('\\dfrac{dz}{dx}'));
for(const s of M.slides)for(const b of s.body)if(b.type==='eq'&&b.tex)assert.ok(b.alt,'Falta alt');
console.log('Notación: sin p, y-prima en sustitución, derivadas de Leibniz verticales durante resolución.');
