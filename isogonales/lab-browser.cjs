'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.join(__dirname,'dist'),out=path.join(__dirname,'lab-screenshots');
fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer((request,response)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname)}catch{response.writeHead(400);return response.end()}
 const full=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
 if(!full.startsWith(root+path.sep)){response.writeHead(403);return response.end()}
 const stream=fs.createReadStream(full);
 stream.on('error',()=>{if(!response.headersSent)response.writeHead(404);response.end()});
 stream.on('open',()=>{response.writeHead(200,{'Content-Type':types[path.extname(full)]||'application/octet-stream'});stream.pipe(response)});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true}),errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:940},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:'+server.address().port+'/laboratorio/',{waitUntil:'networkidle'});
  assert.ok((await page.title()).includes('IsogonalLab'));
  assert.equal(await page.locator('.family-tab').count(),4);
  assert.ok(await page.locator('canvas#plot').isVisible());
  assert.ok((await page.locator('.katex').count())>=8,'No se mostraron las ecuaciones');
  assert.equal(await page.locator('#math-ode .katex').count(),1,'La EDO no usa KaTeX');
  assert.equal(await page.locator('#slope-known').innerText(),'0.500');
  await page.screenshot({path:path.join(out,'01-radiales-escritorio.png')});
  await page.locator('[data-family=hyper]').click();
  assert.equal(await page.locator('#plot-subtitle').innerText(),'Hipérbolas');
  assert.ok((await page.locator('#math-solution').innerText()).includes('2'));
  await page.locator('#angle').fill('65');
  assert.equal(await page.locator('#angle-value').innerText(),'65°');
  const c=await page.locator('#plot').boundingBox();
  await page.mouse.click(c.x+c.width*.63,c.y+c.height*.37);
  assert.ok((await page.locator('#point-readout').innerText()).includes('P = ('));
  await page.screenshot({path:path.join(out,'02-hiperbolas-escritorio.png')});
  await page.locator('[data-family=parallel]').click();
  assert.equal(await page.locator('#slope-known').innerText(),'0.000');
  await page.locator('#show-field').uncheck();
  assert.equal(await page.locator('#show-field').isChecked(),false);
  await page.locator('[data-family=parab]').click();
  await page.screenshot({path:path.join(out,'03-parabolas-escritorio.png')});
  await page.locator('#reset').click();
  assert.equal(await page.locator('#angle-value').innerText(),'55°');
  await page.locator('#angle').fill('60');
  await page.locator('#check-challenge').click();
  assert.ok((await page.locator('#challenge-feedback').innerText()).includes('Correcto.'));
  await page.locator('#materiales').scrollIntoViewIfNeeded();
  await page.locator('.paper-figure img').first().evaluate(img=>img.decode());
  assert.equal(await page.locator('.paper-figure img').count(),3);
  assert.ok((await page.locator('.paper-figure img').first().evaluate(img=>img.naturalWidth))>150);
  await page.screenshot({path:path.join(out,'04-materiales.png')});
  await page.setViewportSize({width:700,height:1080});
  await page.locator('#laboratorio').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(out,'05-laboratorio-tablet.png'),fullPage:true});
  const overscroll=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overscroll<=3,'Desbordamiento horizontal tablet: '+overscroll);
  await page.setViewportSize({width:390,height:844});
  await page.locator('#laboratorio').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(out,'06-laboratorio-movil.png'),fullPage:true});
  const mobile=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(mobile<=3,'Desbordamiento horizontal móvil: '+mobile);
  assert.deepEqual(errors,[],'Errores JavaScript de navegador');
  console.log('IsogonalLab en Chromium: 4 familias, interacción, ecuaciones, materiales, tablet y móvil correctos.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
