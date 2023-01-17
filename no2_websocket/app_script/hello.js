//curl http://172.21.0.3:3000/ で接続する。
const http = require('http');
const server = http.createServer((req, res)=>{
    res.end("<h1>Hello, world!</h1>\n");
});

server.listen(3000);