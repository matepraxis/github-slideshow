'use strict';
const assert=require('node:assert/strict'),M=require('./dist/model.js');
for(let i=17;i<=24;i++){
 assert.ok(M.slides[i].body.length>=4,'Etapa '+i+' incompleta');
 assert.ok(M.slides[i].body.some(b=>b.type==='text'),'Faltan justificaciones '+i);
}
const body=i=>M.slides[i].body.map(b=>b.tex||b.value).join(' ');
for(const [idx,key] of [[18,'y=Cx'],[18,'x-ky'],[19,'z+x'],[20,'1+z^2'],[21,'\\ln|x|'],[22,'x^2+y^2'],[23,'Ae^{\\theta/k}'],[24,'\\tan\\gamma']]){
 assert.ok(body(idx).includes(key),'No se encuentra '+key+' en '+idx);
}
assert.ok(body(21).includes('Integramos a ambos lados'));
assert.ok(body(21).includes('\\int\\dfrac{1-kz}{k(1+z^2)}'));
assert.ok(M.slides[21].body.filter(b=>b.type==='eq').length===4);
assert.ok(body(23).includes('rama angular continua'));
console.log('Ejemplo matemático: familia, EDO, integración, polares y verificación correctos.');
