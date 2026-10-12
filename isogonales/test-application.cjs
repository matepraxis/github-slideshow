'use strict';
const assert=require('node:assert/strict'),M=require('./dist/model.js');
assert.equal(M.slides.length,37);
assert.equal(M.slides.filter(s=>!s.optional).length,32);
assert.equal(M.slides.filter(s=>s.optional).length,5);
assert.equal(M.slides.reduce((t,s)=>t+s.duration,0),1200);
const app=M.slides.filter(s=>s.graph?.startsWith('materials'));
assert.equal(app.length,6);
assert.deepEqual(app.map(s=>s.graph),['materials-intro','materials-k1','materials-k2','materials-k3','materials-results','materials-2019']);
for(const k of [1,2,3])assert.ok(app.find(s=>s.graph==='materials-k'+k).body.some(b=>(b.tex||'').includes('k='+k)));
assert.ok(app.every(s=>s.referenceUrl.startsWith('https://')));
assert.ok(app.filter(s=>s.graph!=='materials-2019').every(s=>s.source.includes('2017')));
assert.ok(app.find(s=>s.graph==='materials-2019').source.includes('2019'));
for(const slide of M.slides)for(const block of slide.body){
 const value=block.tex||block.value||'';
 assert.ok(!/Thurairajah|urinal|orina|salpicaduras|splash.free/i.test(value));
 assert.ok(!/Escobar/i.test(value));
}
assert.ok(M.slides[24].referenceUrl.endsWith('#page=10'));
assert.ok(M.slides[25].referenceUrl.endsWith('#page=10'));
assert.ok(M.slides[26].referenceUrl.endsWith('#page=10'));
assert.ok(M.slides[27].referenceUrl.endsWith('#page=16'));
assert.ok(M.slides[27].body.some(b=>(b.tex||'').includes('\\omega_1=\\omega_2')));
assert.ok(M.slides[27].body.some(b=>(b.value||'').includes('par complejo conjugado')));
assert.ok(M.slides[27].body.some(b=>(b.value||'').includes('cuatro raíces son reales')));
assert.ok(M.slides[18].body.some(b=>(b.tex||'').includes('\\int')));
console.log('Aplicación: materiales 2017/2019, 3 patrones, DOI, fuentes y 20 minutos.');
