(function(root){
 'use strict';
 const symbols={'𝓕':'\\mathcal{F}','𝓗':'\\mathcal{H}','∈':'\\in ','α':'\\alpha ','β':'\\beta ','γ':'\\gamma ','θ':'\\theta ','π':'\\pi ','−':'-','′':"'",'₀':'_0','²':'^2','°':'^{\\circ}'};
 function literal(value){
  return String(value).replace(/[{}]/g,'\\$&').replace(/arctan|tan|cot|cos|sin|ln|[𝓕𝓗∈αβγθπ−′₀²°]/gu,token=>symbols[token]||'\\'+token+' ');
 }
 function fromAST(n){
  if(n.t==='r')return literal(n.text);
  if(n.t==='seq')return n.nodes.map(fromAST).join(' ');
  if(n.t==='frac')return '\\frac{'+fromAST(n.num)+'}{'+fromAST(n.den)+'}';
  if(n.t==='sub')return '{'+fromAST(n.base)+'}_{'+fromAST(n.sub)+'}';
  if(n.t==='sup')return '{'+fromAST(n.base)+'}^{'+fromAST(n.pow)+'}';
  if(n.t==='sqrt')return '\\sqrt{'+fromAST(n.body)+'}';
  throw new Error('Expresión matemática desconocida');
 }
 const api={fromAST};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PresentationLatex=api;
})(globalThis);
