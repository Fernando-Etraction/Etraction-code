// Bancada: serve ultramel.com.br via localhost e injeta os códigos da Black (só para teste local)
const http=require('http'), https=require('https'), fs=require('fs'), path=require('path');
const CODES=path.resolve(process.argv[2]); const PORT=+process.argv[3]||8768; const HOST='www.ultramel.com.br';
http.createServer((req,res)=>{
  if(req.url.startsWith('/_umbf/all.js')){
    const files=fs.readdirSync(CODES).filter(f=>/^\d-.*\.js$/.test(f)).sort();
    res.writeHead(200,{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'});
    return res.end(files.map(f=>'/* '+f+' */\n'+fs.readFileSync(path.join(CODES,f),'utf8')).join('\n;\n'));
  }
  const headers=Object.assign({},req.headers,{host:HOST,'accept-encoding':'identity'});
  delete headers.origin; if(headers.referer) headers.referer=headers.referer.replace(/http:\/\/localhost:\d+/,'https://'+HOST);
  const up=https.request({host:HOST,path:req.url,method:req.method,headers},r=>{
    const h=Object.assign({},r.headers); delete h['content-security-policy']; delete h['content-length']; delete h['strict-transport-security'];
    if(h.location) h.location=h.location.replace(/https?:\/\/(www\.)?ultramel.com.br/,'');
    if(h['set-cookie']) h['set-cookie']=h['set-cookie'].map(c=>c.replace(/;\s*domain=[^;]*/i,'').replace(/;\s*secure/i,'').replace(/samesite=none/i,'SameSite=Lax'));
    const html=/text\/html/.test(h['content-type']||'');
    if(!html){ res.writeHead(r.statusCode,h); return r.pipe(res); }
    const chunks=[]; r.on('data',c=>chunks.push(c)); r.on('end',()=>{
      let s=Buffer.concat(chunks).toString('utf8').replace(/https?:\/\/(www\.)?ultramel.com.br/g,'');
      s=s.replace(/<\/body>/i,'<script src="/_umbf/all.js"></script></body>');
      res.writeHead(r.statusCode,h); res.end(s);
    });
  });
  up.on('error',e=>{res.writeHead(502);res.end(String(e));});
  req.pipe(up);
}).listen(PORT,()=>console.log('bancada em http://localhost:'+PORT));
