'use strict';
const assert=require('node:assert/strict'),M=require('./dist/model.js');
for(let i=15;i<=22;i++){
 assert.ok(M.slides[i].body.length>=4,'Etapa '+i+' incompleta');
 assert.ok(M.slides[i].body.some(b=>b.type==='text'),'Faltan justificaciones '+i);
}
const body=i=>M.slides[i].body.map(b=>b.tex||b.value).join(' ');
for(const [idx,key] of [[15,'y=Cx'],[16,'x-ky'],[17,'z+x'],[18,'1+z^2'],[19,'\\ln|x|'],[20,'x^2+y^2'],[21,'Ae^{\\theta/k}'],[22,'\\tan\\gamma']]){
 assert.ok(body(idx).includes(key),'No se encuentra '+key+' en '+idx);
}
assert.ok(body(19).includes('Integramos a ambos lados'));
assert.ok(body(19).includes('\\int\\frac{1-kz}{k(1+z^2)}'));
assert.ok(M.slides[19].body.filter(b=>b.type==='eq').length===4);
assert.ok(body(21).includes('rama angular continua'));
console.log('Ejemplo matemático: familia, EDO, integración, polares y verificación correctos.');
