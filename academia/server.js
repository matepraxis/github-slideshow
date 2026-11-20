'use strict';
const http=require('node:http');
const https=require('node:https');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const PORT=process.env.PORT||10000;
const mime={'.html':'text/html; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const audioData=JSON.parse(fs.readFileSync(path.join(root,'audio.json'),'utf8'));
function streamAudio(req,res,url,redirects=0){
 if(redirects>4){res.writeHead(502);return res.end('Redirecciones excesivas');}
 const permitted=new URL(url);
 if(permitted.protocol!=='https:' || !/(^|\.)(heygen\.ai|amazonaws\.com|cloudfront\.net)$/.test(permitted.hostname)){res.writeHead(502);return res.end('Origen no permitido');}
 const headers={};if(req.headers.range)headers.range=req.headers.range;
 const remote=https.request(url,{method:req.method==='HEAD'?'HEAD':'GET',headers,timeout:25000},up=>{
  if(up.statusCode>=300&&up.statusCode<400&&up.headers.location)return streamAudio(req,res,new URL(up.headers.location,url).toString(),redirects+1);
  const pass={};for(const k of ['content-type','content-length','content-range','accept-ranges','etag','last-modified'])if(up.headers[k])pass[k]=up.headers[k];
  pass['Cache-Control']='public, max-age=1800';res.writeHead(up.statusCode||502,pass);up.pipe(res);
 });
 remote.on('timeout',()=>remote.destroy(new Error('Tiempo agotado')));
 remote.on('error',()=>{if(!res.headersSent)res.writeHead(502);res.end('Audio no disponible');});
 res.on('close',()=>remote.destroy());remote.end();
}
http.createServer((req,res)=>{
 let url;try{url=new URL(req.url,'http://localhost');}catch(e){res.writeHead(400);return res.end();}
 const pathname=url.pathname;
 if(pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({ok:true,name:'Laboratorio de Demostraciones',narrated:Object.keys(audioData).length}));}
 if(pathname.startsWith('/audio/')){
  const id=pathname.slice(7).replace(/[^a-z-]/g,'');
  if(!Object.prototype.hasOwnProperty.call(audioData,id)){res.writeHead(404);return res.end('No existe narración');}
  return streamAudio(req,res,audioData[id].url);
 }
 const allowed={'/':'index.html','/index.html':'index.html','/lessons.json':'lessons.json','/audio.json':'audio.json','/app.js':'app.js','/app.css':'app.css'};
 if(!allowed[pathname]){res.writeHead(404);return res.end('No existe la página');}
 const filepath=path.join(root,allowed[pathname]);const ext=path.extname(filepath);
 fs.stat(filepath,(err,st)=>{
  if(err||!st.isFile()){res.writeHead(404);return res.end('No encontrado');}
  res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':ext==='.html'?'no-cache':'public,max-age=600','Content-Length':st.size});
  if(req.method==='HEAD')return res.end();fs.createReadStream(filepath).pipe(res);
 });
}).listen(PORT,'0.0.0.0',()=>console.log('Laboratorio de Demostraciones listo en '+PORT));
