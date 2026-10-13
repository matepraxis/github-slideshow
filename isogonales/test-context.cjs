'use strict';
const assert=require('node:assert/strict'),M=require('./dist/model.js');
const material=M.slides.filter(s=>s.graph?.startsWith('materials'));
assert.equal(material.length,6);
const writing=s=>s.body.map(b=>b.value||b.tex||'').join(' ');
const intro=writing(material[0]);
assert.ok(intro.includes('recorridos')&&intro.includes('Galanin')&&intro.includes('deformaciones'));
assert.ok(!intro.includes('\\tan\\gamma'),'El ángulo del ejemplo no debe atribuirse al estudio');
for(let k=1;k<=3;k++){
 const slide=material[k];assert.ok(slide.graph==='materials-k'+k);
 assert.ok(writing(slide).includes('k='+k));
 assert.ok(slide.referenceUrl.includes('page=10'));
}
assert.ok(writing(material[1]).includes('no debemos identificarlo automáticamente'));
assert.ok(writing(material[4]).includes('cobre')&&writing(material[4]).includes('wolframio'));
assert.ok(writing(material[4]).includes('cuatro raíces reales'));
assert.ok(writing(material[5]).includes('problemas de contorno'));
console.log('Aplicación: problema físico → diseño isogonal → raíces del sistema → alcance de 2019.');
