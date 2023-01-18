//必要なモジュールをロードする。
const fs = require('fs');
const http = require('http');
const path = require('path');
const ws = require('ws');

//サーバを作成
const server = http.createServer((req, res)=>{
    //ファイルを開くためにパスを作る。
    let file_name = "."+req.url;
    
    if (req.url==="/") {
        //もしルートでアクセスされた場合、index.htmlを返す
        file_name = "./index.html";
    } else if (req.url==="/favicon.ico") {
        //faviconは作っていないが、これで停止されると困るので200で返す。
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write("/favicon.ico is not defined.\n");
        res.end();
        return;
    }
    //ファイルパスを取得しファイルを読み込む。拡張子の種類によってヘッダを変える。
    fs.readFile(file_name,'utf-8',(err,data)=>{
        const ext_format = path.extname(req.url);
        if (ext_format===".html") {
            res.writeHead(200,{'Content-Type':'text/html'});
        } else if (ext_format===".js"){
            res.writeHead(200,{'Content-Type':'text/javascript'});
        }
        //レスポンスボディの内容は共通
        res.write(data);
        res.end();
    });
});
//3000番ポートで受け付ける。
server.listen(3000);

//websocketサーバを作成する。
const wss = new ws.WebSocketServer({ port: 3030 });

wss.on('connection',(websocket)=>{
    /*
    websocket.on('message',(data)=>{
        console.log("received: %s",data);
    });
    websocket.send('something');
    */
   console.log("connected!");
});