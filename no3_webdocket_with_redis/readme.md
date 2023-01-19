# no3_webdocket_with_redis
　単純にRedisとWebsocketサーバをつなげる。

no1とno2の内容をつなげる。送受信するデータはテキストベースに変更する。

## websocketサーバを作る
　no2の内容を持ってきてサーバを作る。

- index.html, websocket.js, app.jsをコピーして持ってくる。
- 以下のコマンドを実行する。（nodejsのコンテナ内で）

```bash
npm init
npm install express
npm i ws
touch .gitignore #→node_modulesを除外する
```

OK。ブラウザから接続してno2のときと同様の動作を確認。

次はテキストを送信してhtmlファイルを書き換える。

- [Static method: Buffer.from(string[, encoding])](https://nodejs.org/api/buffer.html#static-method-bufferfromobject-offsetorencoding-length)

上記のメソッドを確認。`toString()`が使えるそうだ。

ひとまずテキスト入力と、送信内容をhtmlに埋め込む部分もOK。

