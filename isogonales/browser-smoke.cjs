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
  async function go(index){
   await page.locator('#index').click();
   await page.locator('#contents-list button').nth(index).click();
  }
  await go(1);
  const control=page.locator('.show-phase');
  assert.ok(await control.count(),'Falta botón de familias');
  await control.click();
  assert.equal(await page.locator('#geometry-svg [data-family-preview]').getAttribute('aria-hidden'),'false');
  await page.screenshot({path:path.join(screenshots,'01-familias-escritorio.png')});
  await go(18);
  for(let i=1;i<8;i++)await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#slide-content .reveal-block:visible').count(),3);
  assert.ok((await page.locator('#slide-content').innerText()).includes('ln'),'La integral no está visible');
  await page.screenshot({path:path.join(screenshots,'02-integracion-escritorio.png')});
  await go(21);
  assert.equal(await page.locator('#example-phase').inputValue(),'6');
  await page.screenshot({path:path.join(screenshots,'03-polares-escritorio.png')});
  await go(24);
  assert.ok((await page.locator('.paper-link').getAttribute('href')).endsWith('#page=10'));
  await page.screenshot({path:path.join(screenshots,'04-figura10-reconstruida.png')});
  await go(27);
  for(let i=1;i<5;i++)await page.keyboard.press('ArrowRight');
  assert.ok((await page.locator('#slide-content').innerText()).includes('cuatro raíces son reales'));
  await page.screenshot({path:path.join(screenshots,'05-resultado-materiales.png')});
  await page.setViewportSize({width:700,height:1080});
  await go(18);
  for(let i=1;i<8;i++)await page.keyboard.press('ArrowRight');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=2,'Desbordamiento horizontal en tablet: '+overflow);
  await page.screenshot({path:path.join(screenshots,'06-integracion-tablet.png'),fullPage:true});
  assert.deepEqual(errors,[],'Errores de JavaScript de navegador');
  console.log('Navegador: familias, integración, polares, aplicación y tablet correctos. Capturas en '+screenshots);
 }finally{await browser.close();await close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
