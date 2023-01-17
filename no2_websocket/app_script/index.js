const fs = require('fs');
const http = require('http');

//サーバを作成
const server = http.createServer((req, res)=>{
    fs.readFile('./index.html','utf-8',(err,data)=>{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
});

server.listen(3000);
