'use strict';
const assert=require('node:assert/strict');
const katex=require('./dist/vendor/katex/katex.min.js');
const {fromAST}=require('./dist/latex.js');
const M=require('./dist/model.js');
let count=0;
for(const slide of M.slides)for(const b of slide.body){
 const formulas=b.type==='eq'?[b.tex||fromAST(b.ast)]:[...b.value.matchAll(/\\\((.*?)\\\)/g)].map(m=>m[1]);
 for(const tex of formulas){const html=katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false});assert.ok(html.includes('katex'));count++;}
}
console.log(`${count} expresiones LaTeX compiladas sin errores.`);
