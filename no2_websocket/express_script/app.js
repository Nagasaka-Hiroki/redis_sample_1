//expressフレームワークを使用する
const express = require('express');
const app = express();

//htmlファイルを返す
app.use(express.static('public'));
//javascriptファイルを返す。
app.use('/assets',express.static(__dirname+'/assets'));
//3000番ポートで受け付ける
app.listen(3000);

//websocketサーバを作成する。
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});

//接続が確立したときに発生するイベント。
wss.on('connection',(ws)=>{
    console.log('connected!');

    //メッセージを受信したときの挙動
    ws.on('message',(data,isBinary)=>{
        console.log('received!');
        ws.send('received!');
    });
});