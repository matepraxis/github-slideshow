'use strict';
const assert=require('node:assert/strict'),M=require('./dist/model.js');
for(let i=16;i<=23;i++){
 assert.ok(M.slides[i].body.length>=4,'Etapa '+i+' incompleta');
 assert.ok(M.slides[i].body.some(b=>b.type==='text'),'Faltan justificaciones '+i);
}
const body=i=>M.slides[i].body.map(b=>b.tex||b.value).join(' ');
for(const [idx,key] of [[16,'y=Cx'],[17,'x-ky'],[18,'z+x'],[19,'1+z^2'],[20,'\\ln|x|'],[21,'x^2+y^2'],[22,'Ae^{\\theta/k}'],[23,'\\tan\\gamma']]){
 assert.ok(body(idx).includes(key),'No se encuentra '+key+' en '+idx);
}
assert.ok(body(20).includes('Integramos a ambos lados'));
assert.ok(body(20).includes('\\int\\dfrac{1-kz}{k(1+z^2)}'));
assert.ok(M.slides[20].body.filter(b=>b.type==='eq').length===4);
assert.ok(body(22).includes('rama angular continua'));
console.log('Ejemplo matemático: familia, EDO, integración, polares y verificación correctos.');
