# no4_simple_pubsub
　Pub/Subの動作を確認する。複数のブラウザを開いて送信内容を相互に受信できるようにする。

## Pub/Subで画面を更新する
　意外と簡単だった。以下の構成。

```js
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
```

複数のブラウザから確認する。  
→OK。２つ開いて確認できた。

自分の実装と参考にしているもの（以下）を比較した。
- [WebsocketとRedis Pub/Sub - Qiita](https://qiita.com/satofujino/items/7bf4b99e2176f63ca7ef)

上記の参考の場合、websocketのすべてのクライアントに対してブロードキャストしている（ブロードキャストを明示的にしている）。

私の場合、ブロードキャストするような書き方をしているわけではないが、クライアントから送信された内容を一度redisに流している。そしてredisでPub/SUb機能を使って購読しているクライアントに対してredisから送信された内容をクライアントに対してwebsocket経由で送信している。

これで単純な構成のPub/Subは完成とする。次へ移行する。