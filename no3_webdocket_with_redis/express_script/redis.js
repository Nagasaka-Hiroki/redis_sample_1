//モジュールをロードする。
const Redis = require('redis');
//redisサーバに接続する
const client = Redis.createClient({ url: 'redis://172.21.0.4:6379/0' });
// Pub/Subの処理を追加する。
const subscriber = client.duplicate(); //購読：受信側
const publisher = client.duplicate(); //出版：送信側
//接続する。
subscriber.connect();
publisher.connect();
//購読する。メッセージを受信する。
subscriber.subscribe('channel',(message)=>{
    console.log(message);
});
//出版する。メッセージを送信する。
publisher.publish('channel','message');
