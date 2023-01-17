# redisの学習 1
　Ruby on RailsのActionCableは、Redisと関係がある。以下参考。

- [ Action Cable の概要 - Railsガイド](https://railsguides.jp/action_cable_overview.html)

個人的にPub/SubモデルおよびはRedisについて知りたいと思っていたので、学習する。

## リンク
　Redisに関するリンクを以下に示す。
- [Documentation｜Redis](https://redis.io/docs/)
- [Redis Pub/Sub｜Redis](https://redis.io/docs/manual/pubsub/)
- [GitHub - redis/redis](https://github.com/redis/redis)
- [ 7.1.1.2 Redisアダプタ｜Action Cable の概要 - Railsガイド](https://railsguides.jp/action_cable_overview.html#redis%E3%82%A2%E3%83%80%E3%83%97%E3%82%BF)
- [ 9 依存関係｜Action Cable の概要 - Railsガイド](https://railsguides.jp/action_cable_overview.html#%E4%BE%9D%E5%AD%98%E9%96%A2%E4%BF%82)
    →ActionCableで必ずしもRedisが必要なわけではない。他の選択肢として`PostgreSQL`もある。
- [RedisのPub/Subがわからない人はRedisを使って理解しよう｜アールエフェクト](https://reffect.co.jp/laravel/redis-pub-sub-dont-understand)
- [WebsocketとRedis Pub/Sub - Qiita](https://qiita.com/satofujino/items/7bf4b99e2176f63ca7ef)
- [Amazon ElastiCache for Redis を使ったChatアプリの開発｜Amazon Web Services ブログ](https://aws.amazon.com/jp/blogs/news/how-to-build-a-chat-application-with-amazon-elasticache-for-redis/)
- [【ザックリ解説】Redisが高速で動作する理由](https://zenn.dev/nameless_sn/articles/why_is_redis_so_fast)


上記の中でも[WebsocketとRedis Pub/Sub - Qiita](https://qiita.com/satofujino/items/7bf4b99e2176f63ca7ef)が興味深いと感じる。Dockerコンテナでredisサーバとクライアントを立てて接続する。またWebSocketについても言及している。RailsでActionCableを使う上では確認しておきたい内容だと思う。

WebsocketとRedisに関して以下も追加でリンクを以下に示す。
- [WebSocket(ブラウザAPI)とws(Node.js) の基本、自分用のまとめ - Qiita](https://qiita.com/okumurakengo/items/c497fba7f16b41146d77)

Node.jsでWebsocketを使う方法についてのブログである。また以下も参考。
- [とほほのWebSocket入門 - とほほのWWW入門](https://www.tohoho-web.com/ex/websocket.html)

Node.jsコンテナに関しては以下。
- [Node.js Web アプリケーションを Docker 化する｜Node.js](https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/)


## 学習目標
　作業の方針としては
[WebsocketとRedis Pub/Sub - Qiita](https://qiita.com/satofujino/items/7bf4b99e2176f63ca7ef)
に近い内容を自分でやってみる。理由は以下の通り。

1. このブログはわかりやすくまとめてくれている反面、私の疑問点が解決していないから。（私の認識がどう間違っているか明確でない）
1. Dockerに慣れるため。
1. Websocketについて学習するため。
1. もう少し複雑な構成で実験したい。

しかし、この内容を実行するためには以下の事項が必要。
1. redisの前にNode.jsコンテナの作成が必要。
1. Node.jsでWebsocketのコードを作る必要がある。

上記までの目的を一度に達成することは難しいので分割していく。学習目標および項目を以下に示す。

1. Redisコンテナを使って操作の基本を練習
1. Node.jsコンテナを使ってWebsocketサーバを作る(Railsだと大きすぎるのでNode.jsで作る)
1. RedisとWebsocketサーバをつなげる
1. Pub/Subの動作を確認する
1. 構成を複雑にする（理解があっているか確認するのが目的）

それぞれディレクトリに分けて学習する。

## ディレクトリ構成
　学習目標・項目をディレクトリに分ける。これは、分けたほうが後から見返しやすくなると考えたので、復習の意味合いを込めてそうしている。

ディレクトリと学習目標の対応は以下の通り。

|ディレクトリ|学習目標・項目|
|-|-|
|no1_redis_basic|Redisコンテナを使って操作の基本を練習|
|no2_websocket|Node.jsコンテナを使ってWebsocketサーバを作る|