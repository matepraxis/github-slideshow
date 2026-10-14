'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.join(__dirname,'dist'),screens=path.join(__dirname,'screenshots');
fs.mkdirSync(screens,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return res.writeHead(400).end();}
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 const stream=fs.createReadStream(file);
 stream.once('error',()=>{if(!res.headersSent)res.writeHead(404);res.end();});
 stream.once('open',()=>{res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});stream.pipe(res);});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1366,height:768},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'load'});
  const go=async i=>{await page.locator('#index').click();await page.locator('#contents-list button').nth(i).click();};
  await go(1);assert.equal(await page.locator('#slide-title').innerText(),'Contenido de la exposición');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#slide-title').innerText(),'Breve historia de las trayectorias isogonales');
  assert.equal(await page.locator('#slide-number').innerText().then(x=>x.includes('3 / 40')),true);
  assert.equal(await page.locator('.history-event:visible').count(),1);
  assert.equal(await page.locator('.history-illustration:visible').count(),1);
  await page.screenshot({path:path.join(screens,'historia-01-inicial.png')});
  for(let step=2;step<=5;step++){
   await page.keyboard.press('ArrowRight');
   assert.equal(await page.locator('#slide-content [data-reveal-index]:visible').count(),step===5?7:step+(step>=4?2:1));
  }
  assert.equal(await page.locator('.history-event:visible').count(),4);
  assert.equal(await page.locator('.history-illustration:visible').count(),2);
  assert.equal(await page.locator('.history-takeaway:visible').count(),1);
  const images=await page.locator('.history-illustration img').evaluateAll(items=>items.map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})));
  assert.ok(images.every(x=>x.loaded),'No cargaron las ilustraciones históricas');
  const bounds=await page.evaluate(()=>{
   const board=document.querySelector('.history-board').getBoundingClientRect(),source=document.querySelector('#source-line').getBoundingClientRect();
   return {boardBottom:board.bottom,sourceTop:source.top,boardLeft:board.left,boardRight:board.right,innerWidth};
  });
  assert.ok(bounds.boardBottom < bounds.sourceTop+5,'Contenido histórico invade las fuentes del pie');
  assert.ok(bounds.boardLeft>=-2 && bounds.boardRight<=bounds.innerWidth+2,'Desbordamiento horizontal histórico en escritorio');
  await page.screenshot({path:path.join(screens,'historia-05-final.png')});
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#slide-title').innerText(),'Un reto antes de las ecuaciones');
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('#slide-title').innerText(),'Breve historia de las trayectorias isogonales');
  await page.setViewportSize({width:700,height:1050});
  // Navegar fuera y volver reinicia correctamente el revelado para la toma tablet.
  await go(3);
  await go(2);
  for(let i=0;i<4;i++await page.keyboard.press('ArrowRight');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=2,'Desbordamiento horizontal en tablet: '+overflow);
  await page.screenshot({path:path.join(screens,'historia-05-tablet.png'),fullPage:true});
  await page.emulateMedia({reducedMotion:'reduce'});
  const duration=await page.locator('.history-event').first().evaluate(e=>getComputedStyle(e).animationDuration);
  assert.equal(duration,'0s','No se respeta prefers-reduced-motion');
  assert.deepEqual(errors,[],'Errores del navegador');
  console.log('Historia en Chromium: 5 pasos, 2 imágenes, navegación, márgenes, tablet y movimiento reducido.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
