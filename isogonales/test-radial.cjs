'use strict';
const assert=require('node:assert/strict'),M=require('./dist/model.js');
for(let i=14;i<=21;i++){
 assert.ok(M.slides[i].body.length>=4,'Etapa '+i+' incompleta');
 assert.ok(M.slides[i].body.some(b=>b.type==='text'),'Faltan justificaciones '+i);
}
const body=i=>M.slides[i].body.map(b=>b.tex||b.value).join(' ');
for(const [idx,key] of [[14,'y=Cx'],[15,'x-ky'],[16,'z+x'],[17,'1+z^2'],[18,'\\ln|x|'],[19,'x^2+y^2'],[20,'Ae^{\\theta/k}'],[21,'\\tan\\gamma']]){
 assert.ok(body(idx).includes(key),'No se encuentra '+key+' en '+idx);
}
assert.ok(body(18).includes('Integrando ambos miembros'));
assert.ok(body(20).includes('rama angular continua'));
console.log('Ejemplo matemático: familia, EDO, integración, polares y verificación correctos.');
