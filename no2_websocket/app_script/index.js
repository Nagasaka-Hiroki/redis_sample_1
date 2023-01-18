//必要なモジュールをロードする。
const fs = require('fs');
const http = require('http');
const path = require('path');

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