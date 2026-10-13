'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.join(__dirname,'dist');
const screenshots=path.join(__dirname,'screenshots');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2','.jpg':'image/jpeg','.mp4':'video/mp4','.svg':'image/svg+xml'};
fs.mkdirSync(screenshots,{recursive:true});
const server=http.createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 const stream=fs.createReadStream(file);
 stream.once('error',()=>{if(!res.headersSent)res.writeHead(404);res.end();});
 stream.once('open',()=>{res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});stream.pipe(res);});
});
const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const close=()=>new Promise(resolve=>server.close(resolve));
(async()=>{
 await listen();
 const browser=await chromium.launch({headless:true});
 const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1366,height:768},deviceScaleFactor:1});
  page.on('pageerror',error=>errors.push(String(error)));
  await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'load'});
  async function capture(name,fullPage=false){
   await page.waitForTimeout(450);
   await page.screenshot({path:path.join(screenshots,name),fullPage});
  }
  async function go(index){
   await page.locator('#index').click();
   await page.locator('#contents-list button').nth(index).click();
  }
  await go(1);
  assert.equal(await page.locator('#slide-title').innerText(),'Contenido de la exposición');
  assert.equal(await page.locator('.agenda-link').count(),5);
  await capture('00-contenido-escritorio.png');
  await page.locator('.agenda-link').nth(2).click();
  assert.equal(await page.locator('#slide-title').innerText(),'Ejemplo: familia de rectas');
  assert.equal(await page.locator('#section-current').innerText(),'Ejemplo desarrollado');
  await go(2);
  assert.equal(await page.locator('#slide-title').innerText(),'Un reto antes de las ecuaciones');
  assert.equal(await page.locator('#slide-content .example-svg').count(),1);
  assert.ok((await page.locator('#slide-content .graph-caption').innerText()).includes('Comparación conceptual'));
  await capture('00a-reto-aeronautico.png');
  await go(3);
  const control=page.locator('.show-phase');
  assert.ok(await control.count(),'Falta botón de familias');
  await control.click();
  assert.equal(await page.locator('#geometry-svg [data-family-preview]').getAttribute('aria-hidden'),'false');
  await capture('01-familias-escritorio.png');
  await go(20);
  for(let i=1;i<8;i++)await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#slide-content .reveal-block:visible').count(),3);
  assert.ok((await page.locator('#slide-content').innerText()).includes('ln'),'La integral no está visible');
  await capture('02-integracion-escritorio.png');
  await go(22);
  assert.equal(await page.locator('#example-phase').inputValue(),'6');
  await capture('03-polares-escritorio.png');
  for(const [idx,n] of [[26,10],[27,11],[28,12]]){
   await go(idx);
   assert.ok((await page.locator('.paper-link').getAttribute('href')).endsWith('#page=10'));
   await page.waitForFunction(()=>{
    const img=document.querySelector('.paper-original-figure');
    return img && img.complete && img.naturalWidth>400;
   },null,{timeout:8000});
   const image=await page.locator('.paper-original-figure').evaluate(img=>({
    loaded:img.complete&&img.naturalWidth>0,width:img.naturalWidth,
    src:img.getAttribute('src')
   }));
   assert.ok(image.loaded&&image.width>400,'Figura '+n+' no carga en alta resolución');
   assert.ok(image.src.endsWith('galanin-fig'+n+'.webp'),'La figura '+n+' está intercambiada');
   const bounds=await page.evaluate(()=>{
    const fig=document.querySelector('.paper-original-figure').getBoundingClientRect();
    const caption=document.querySelector('.example-graph .graph-caption').getBoundingClientRect();
    const source=document.querySelector('#source-line').getBoundingClientRect();
    return {figureBottom:fig.bottom,captionTop:caption.top,captionBottom:caption.bottom,sourceTop:source.top};
   });
   assert.ok(bounds.figureBottom <= bounds.captionTop+3,'Figura '+n+' invade su pie explicativo');
   assert.ok(bounds.captionBottom+8 < bounds.sourceTop,'Figura '+n+' invade el pie bibliográfico');
   await capture('0'+(n-6)+'-figura'+n+'-original.png');
  }
  await go(29);
  for(let i=1;i<5;i++)await page.keyboard.press('ArrowRight');
  assert.ok((await page.locator('#slide-content').innerText()).includes('cuatro raíces reales'));
  await capture('05-resultado-materiales.png');
  await go(36);
  assert.equal(await page.locator('#slide-title').innerText(),'Del ángulo al problema real');
  await page.keyboard.press('ArrowRight');
  assert.ok((await page.locator('#slide-content').innerText()).includes('EDO')||(await page.locator('#slide-content .katex').count())>0);
  await capture('07-conclusion-aplicada.png');
  await page.setViewportSize({width:700,height:1080});
  await go(1);
  await capture('08-contenido-tablet.png',true);
  await go(20);
  for(let i=1;i<8;i++)await page.keyboard.press('ArrowRight');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=2,'Desbordamiento horizontal en tablet: '+overflow);
  await capture('06-integracion-tablet.png',true);
  assert.deepEqual(errors,[],'Errores de JavaScript de navegador');
  console.log('Navegador: familias, integración, polares, aplicación y tablet correctos. Capturas en '+screenshots);
 }finally{await browser.close();await close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
