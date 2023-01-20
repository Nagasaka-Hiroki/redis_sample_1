//expressフレームワークを使用する
const express = require('express');
const app = express();
//redisを使えるようにする。
const Redis = require('redis');

//htmlファイルを返す
app.use(express.static('public'));
//javascriptファイルを返す。
app.use('/assets',express.static(__dirname+'/assets'));
//3000番ポートで受け付ける
app.listen(3000);

//websocketサーバを作成する。
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});

// Pub/Subを使う。
//redisサーバに接続する
const client = Redis.createClient({ url: 'redis://172.21.0.4:6379/0' });
// Pub/Subの処理を追加する。
const subscriber = client.duplicate(); //購読：受信側
const publisher = client.duplicate(); //出版：送信側
//接続する。
subscriber.connect();
publisher.connect();

//接続が確立したときに発生するイベント。
wss.on('connection',(ws)=>{
    //websocketからメッセージを受信したときの挙動
    ws.on('message',(data,isBinary)=>{
        //出版する。メッセージを送信する。
        //nodejsサーバからredisサーバにデータを送信する。
        //直接クライアントに送信せずに一度redisに送信する。
        publisher.publish('channel',data.toString());
    });
    //購読する。メッセージを受信する。
    //redisサーバからnodejsサーバにデータを送信する
    subscriber.subscribe('channel',(message)=>{
        console.log(message);
        ws.send(message);
    });
});