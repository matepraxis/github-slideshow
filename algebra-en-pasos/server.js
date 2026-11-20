// Álgebra en Pasos: servidor independiente para Render.
const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = __dirname;
const audioURL = 'https://resource2.heygen.ai/text_to_speech/062b409d73ad44c39ac9f2448b9c97d7/40ded5e9651a43a58b77f72699b95688/id=dde056b935264e819521f22e0f7f2cfa.wav';
const PORT = process.env.PORT || 10000;
function proxyAudio(req,res,url,redirects=0){
  if(redirects>3){res.writeHead(502);return res.end('Demasiadas redirecciones');}
  const headers={}; if(req.headers.range) headers.range=req.headers.range;
  const up=https.request(url,{headers,method:req.method==='HEAD'?'HEAD':'GET',timeout:20000},remote=>{
    if(remote.statusCode>=300 && remote.statusCode<400 && remote.headers.location) return proxyAudio(req,res,new URL(remote.headers.location,url).toString(),redirects+1);
    const passthrough={};
    for(const h of ['content-type','content-length','content-range','accept-ranges','last-modified','etag']) if(remote.headers[h])passthrough[h]=remote.headers[h];
    passthrough['cache-control']='public,max-age=3600';
    res.writeHead(remote.statusCode||502,passthrough);remote.pipe(res);
  });
  up.on('timeout',()=>up.destroy(new Error('Tiempo agotado')));
  up.on('error',()=>{if(!res.headersSent)res.writeHead(502);res.end('Audio no disponible');});
  req.on('close',()=>up.destroy());up.end();
}
http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/api/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify({ok:true,service:'algebra-en-pasos'}));}
  if(pathname==='/audio'){return proxyAudio(req,res,audioURL);}
  if(pathname!=='/' && pathname!=='/index.html'){res.writeHead(404);return res.end('No encontrado');}
  const filename=path.join(ROOT,'index.html');
  fs.stat(filename,(err,stat)=>{if(err){res.writeHead(500);return res.end('Página no disponible');}
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Content-Length':stat.size,'Cache-Control':'no-store'});
  fs.createReadStream(filename).pipe(res);});
}).listen(PORT,'0.0.0.0',()=>console.log('Álgebra en Pasos, puerto '+PORT));