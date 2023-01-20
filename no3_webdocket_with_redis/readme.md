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

## redisと接続
　Pub/Subを使って、websocketと連携する。

- [WebsocketとRedis Pub/Sub - Qiita](https://qiita.com/satofujino/items/7bf4b99e2176f63ca7ef)

上記を読んでいる限り、redisコンテナ側での操作は特に必要なさそう。

- [redis - npm](https://www.npmjs.com/package/redis)
- [ioredis - npm](https://www.npmjs.com/package/ioredis)

上記のモジュールでredisの操作ができるみたい。

- [Clients｜Redis](https://redis.io/resources/clients/#nodejs)

上記によれば、`node-redis`が人気みたい。今回はこちらを試す。

- [Node Redis](https://redis.js.org/)

インストールは以下。

```bash
npm install redis
```

以下のように書くと中身が見えた。

```js
const Redis = require('redis');
console.log(Redis);
```

Redisのオブジェクトが表示された。以下にしめす。

```js
{
  createClient: [Function: createClient],
  createCluster: [Function: createCluster],
  commandOptions: [Getter],
  defineScript: [Getter],
  GeoReplyWith: [Getter],
  AbortError: [Getter],
  WatchError: [Getter],
  ConnectionTimeoutError: [Getter],
  ClientClosedError: [Getter],
  ClientOfflineError: [Getter],
  DisconnectsClientError: [Getter],
  SocketClosedUnexpectedlyError: [Getter],
  RootNodesUnavailableError: [Getter],
  ReconnectStrategyError: [Getter],
  ErrorReply: [Getter],
  Graph: [Getter],
  SchemaFieldTypes: [Getter],
  SchemaTextFieldPhonetics: [Getter],
  VectorAlgorithms: [Getter],
  AggregateSteps: [Getter],
  AggregateGroupByReducers: [Getter],
  TimeSeriesDuplicatePolicies: [Getter],
  TimeSeriesEncoding: [Getter],
  TimeSeriesAggregationType: [Getter],
  TimeSeriesReducers: [Getter],
  TimeSeriesBucketTimestamp: [Getter]
}
```

redisでクライアントという言葉が出てきて違和感を感じていたが。Node.jsでかけるのはクライアント側だというこということを認識していなかった。  
redisから見るとNode.jsサーバはクライアントに相当する。そのためサーバ側のスクリプトにクライアントが出てくる。クライアントに関しては以下を参照。

- [node-redis/client-configuration.md at abf2b4bc8216c972e40fd369238c84b06e06ce16 · redis/node-redis · GitHub](https://github.com/redis/node-redis/blob/HEAD/docs/client-configuration.md)

クライアントの中身は以下。

```js
Commander {
  _events: [Object: null prototype] {},
  _eventsCount: 0,
  _maxListeners: undefined,
  commandOptions: [Function: commandOptions],
  select: [AsyncFunction: SELECT],
  subscribe: [Function: SUBSCRIBE],
  pSubscribe: [Function: PSUBSCRIBE],
  unsubscribe: [Function: UNSUBSCRIBE],
  pUnsubscribe: [Function: PUNSUBSCRIBE],
  quit: [Function: QUIT],
  multi: [Function: MULTI],
  bf: {},
  cms: {},
  cf: {},
  tDigest: {},
  topK: {},
  graph: {},
  json: {},
  ft: {},
  ts: {},
  [Symbol(kCapture)]: false
}
```

SyntaxError: await is only valid in async functions and the top level bodies of modulesというエラーが出る。
- [javascript エラー「Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules」の解決方法｜mebee](https://mebee.info/2022/03/02/post-57753/)

rubyだとローカルホストで良かったがコンテナからコンテナに接続するときはIPアドレスを直接指定する。以下参照。
- [【Docker】 Redis で Error: Redis connection to 127.0.0.1:6379 failed - connect ECONNREFUSED 127.0.0.1:6379 と出てきたときの対処法 - Qiita](https://qiita.com/risto24/items/301633687d16ae913ad0)

初めの方は直接指定していたが、途中でlocalhostに切り替えたところ挙動が変わった。IPアドレスを直接指定するのは正しい。そのため以下のエラーは原因が別。

```js
Promise { <pending> }
```

上記は非同期処理を理解しないとわからないらしいので、学習する。以下参照。

- [非同期処理:Promise/Async Function · JavaScript Primer #jsprimer](https://jsprimer.net/basic/async/)

とりあえずPub/Subを優先して実装する。

メソッドに関するドキュメントがないので、redisのメソッドを確認する。

- [Commands｜Redis](https://redis.io/commands/?group=pubsub)

とりあえず、nodejsコンテナとredisコンテナを接続した。

また、連携していないが、websocketとPub/Subが動作するようにした。とりあえず当初の目標のコンテナを接続するという目標を達成することはできた。そのため次に移行する。