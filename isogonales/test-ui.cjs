const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const M=require('./dist/model.js');
class Element {
 constructor(tag,id){this.tagName=tag.toUpperCase();this.id=id;this.children=[];this.attrs={};this.listeners={};this.dataset={};this._html='';this.classList={toggle:(name,on)=>{this.attrs[name]=on}};}
 append(...nodes){this.children.push(...nodes);}
 setAttribute(k,v){this.attrs[k]=String(v);if(k==='data-stage')this.dataset.stage=String(v);}
 addEventListener(k,fn){this.listeners[k]=fn;}
 set innerHTML(x){this._html=x;this.children=[];}
 get innerHTML(){return this._html;}
 querySelectorAll(tag){return this.children.filter(x=>x.tagName===tag.toUpperCase());}
 querySelector(){return new Element('button');}
 showModal(){this.open=true;}close(){this.open=false;}pause(){this.paused=true;}
 click(){this.listeners.click?.({target:this});}
}
const ids=['phase','phase-value','phase-caption','geometry-desc','geometry-svg','slide-content','stage','slide-title','geometry','source-line','previous','next','slide-number','notes-title','notes-time','notes-body','notes-source','announcement','contents-list','notes','contents','index','notes-button','fullscreen'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Element('div',id)]));
const groups=()=>nodes['geometry-svg'].children.filter(e=>e.dataset.stage);
const buttons=()=>nodes['contents-list'].children.map(e=>e.children[0]);
const storage={value:JSON.stringify({slide:6,phase:4}),getItem(){return this.value},setItem(k,v){this.value=v}};
const context={PresentationModel:M,PresentationLatex:require('./dist/latex.js'),katex:require('./dist/vendor/katex/katex.min.js'),window:{matchMedia:()=>({matches:true})},document:{getElementById:id=>nodes[id],createElement:tag=>new Element(tag),createElementNS:(ns,tag)=>new Element(tag),querySelector:()=>new Element('div'),querySelectorAll:s=>s.includes('data-stage')?groups():s.includes('contents-list')?buttons():[],addEventListener(){},activeElement:null,documentElement:{}},localStorage:storage};
context.globalThis=context;vm.runInNewContext(fs.readFileSync(__dirname+'/dist/app.js','utf8'),context);
const svg=nodes['geometry-svg'],sameGroups=groups();
assert.equal(sameGroups.length,6);
nodes.next.click();assert.equal(JSON.parse(storage.value).slide,6);assert.equal(JSON.parse(storage.value).reveal,2);assert.equal(nodes['geometry-svg'],svg);assert.equal(nodes.phase.value,4);assert.deepEqual(groups(),sameGroups);
buttons()[14].click();assert.equal(nodes.geometry.hidden,true);assert.equal(nodes.phase.value,4);
buttons()[9].click();assert.equal(nodes.geometry.hidden,false);assert.equal(nodes.phase.value,4);assert.deepEqual(groups(),sameGroups);
nodes.phase.listeners.input({target:{value:'2'}});assert.equal(JSON.parse(storage.value).phase,2);
nodes.previous.click();assert.equal(nodes.phase.value,2);assert.equal(JSON.parse(storage.value).reveal,1);
for(let i=0;i<M.slides.length;i++){
 buttons()[i].click();assert.equal(nodes.phase.value,2);assert.deepEqual(groups(),sameGroups);
 const allHTML=e=>e.innerHTML+e.children.map(allHTML).join('');
 assert.ok(!allHTML(nodes['slide-content']).includes('NaN'));
}
console.log('Interacciones: el SVG conserva sus nodos y etapa en '+M.slides.length+' diapositivas.');
