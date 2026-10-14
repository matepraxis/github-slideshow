'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'dist/app.js'),'utf8');
const body=app.split("}else if(s.kind==='references'){")[1]?.split("}else if(s.graph")[0];
assert.ok(body,'No se encontró la diapositiva de bibliografía');
for(const title of [
 'Reinforcement of Planar Constructions along Isogonal Trajectories.',
 'Determination of Fiber-Structure for the Effective Reinforcement of Planar Composite-Material Constructions.',
 'Outline of a History of Differential Geometry: I.',
 'Transformation Theory of Isogonal Trajectories of Isothermal Families.',
 'Geometric analysis of shell coiling: General problems.'
]){
 assert.ok(body.includes(title),'Falta título de artículo: '+title);
 assert.ok(!body.includes('<i>'+title+'</i>'),'El título del artículo está en cursiva: '+title);
}
for(const publication of [
 'Keldysh Institute Preprints',
 'Materials Science Forum',
 'Isis',
 'Proceedings of the National Academy of Sciences',
 'Journal of Paleontology'
])assert.ok(body.includes('<i>'+publication+'</i>'),'El nombre de la publicación no está en cursiva: '+publication);
for(const book of ['Cálculo diferencial e integral','Elementos'])
 assert.ok(body.includes('<i>'+book+'</i>'),'El título del libro no está en cursiva: '+book);
assert.ok(app.includes("origin.innerHTML=citationHTML(citation)"),'Sin cursivas en citas de la línea histórica');
assert.ok(app.includes("$('source-line').innerHTML=citationHTML(s.source||'')"),'Sin cursivas en fuentes de las diapositivas');
assert.ok(app.includes("$('notes-source').innerHTML=s.source?'Fuente: '+citationHTML(s.source):''"),'Sin cursivas en fuentes de notas');
assert.ok(app.includes('const citationHTML='),'Sin escapar las fuentes antes de marcar cursivas');
console.log('Estilo bibliográfico: libros y publicaciones en cursiva; títulos de artículos en redonda.');
