import {execFile} from 'node:child_process';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files={'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js','/activities.js':'activities.js','/engine.js':'engine.js'};
const types={html:'text/html',css:'text/css',js:'text/javascript'};
const server=http.createServer(async(req,res)=>{
 const file=files[new URL(req.url,'http://localhost').pathname];
 if(!file){res.writeHead(404);return res.end('Not found');}
 try{const body=await readFile(new URL('./dist/'+file,import.meta.url));res.writeHead(200,{'Content-Type':types[file.split('.').pop()]+'; charset=utf-8','Cache-Control':'no-store'});res.end(body);}
 catch{res.writeHead(500);res.end('Could not load application');}
});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'Port 4173 is already in use. Close the other app or use its existing window.':e.message);process.exit(1);});
server.listen(4173,'127.0.0.1',()=>{console.log('What Should I Do? → http://127.0.0.1:4173');if(process.argv.includes('--open'))execFile('cmd.exe',['/c','start','','http://127.0.0.1:4173']);});

