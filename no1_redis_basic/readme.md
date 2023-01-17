# no1_redis_basic
　Redisコンテナを使って操作の基本を練習する。ホスト環境にインストールしてもいいが、開発で使用する場合はおそらくコンテナで使用するため学習の段階からコンテナを使用する。

以下DockerHubのリンク。

- [Redis tags｜DockerHub](https://hub.docker.com/_/redis/tags)

以下のコマンドでコンテナを取得する。ディストリビューションはDebian系の方が個人的に扱いやすいのでbullseyeにした。

```bash
docker pull redis:bullseye
```

使い方は以下を参考。

- [Redis overview｜DockerHub](https://hub.docker.com/_/redis)

まず単純に実行する、上記を参考に以下を実行。
```bash
docker run --name some-redis -d redis:bullseye
```
このままだと何もできないのでcliが使えるようにして起動する。以下。
- [Getting started with Redis｜Redis](https://redis.io/docs/getting-started/)

```bash
docker run -it --network some-network --rm redis redis-cli -h some-redis
```

上記だとエラーが出る。docker runコマンドは長いのでdocker-compose.ymlを使って立ち上げを楽にする。

以下のコマンドを実行してコンテナの作成と実行を行う。

```bash
docker compose up -d
docker exec -it redis /bin/bash
```
これでcliで操作できるようになった。試しにpingをしてみる。

```bash
root@9fa78d3fc421:/data# redis-cli 
127.0.0.1:6379> PING
PONG
```

## 手動で操作する
redisのサイトの初めの方を真似して以下を実行。

```bash
127.0.0.1:6379> set key value
OK
127.0.0.1:6379> get key
"value"
```

ドキュメントを読んでいるとgemがあるそうだ。以下に示す。
- [GitHub - redis/redis-rb: A Ruby client library for Redis](https://github.com/redis/redis-rb)

コマンドラインから使えるようになったので早速Pub/Subを試す。以下参考。

- [Redis Pub/Sub｜Redis](https://redis.io/docs/manual/pubsub/)

コマンドラインの操作がよくわからなかったが、以下を読んでいるとターミナルを分けたときにわかりやすくなるそうだ。
- [WebsocketとRedis Pub/Sub - Qiita](https://qiita.com/satofujino/items/7bf4b99e2176f63ca7ef)

あるターミナルで以下を実行。
```bash
127.0.0.1:6379> SUBSCRIBE channel
Reading messages... (press Ctrl-C to quit)
```

もう片方で以下を実行。

```bash
127.0.0.1:6379> PUBLISH channel hello
(integer) 1
```
受信結果は以下

```bash
127.0.0.1:6379> SUBSCRIBE channel
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "channel"
3) (integer) 1
1) "message"
2) "channel"
3) "hello"
```

ドキュメントを眺めているとコマンドの一覧があった。以下に示す。
- [Commands｜Redis](https://redis.io/commands/)

## プログラムから操作する。
- [Getting started with Redis｜Redis](https://redis.io/docs/getting-started/)

上記URLの`Using Redis from your application`を参考にやってみる。まずgemの確認。

```bash
$ gem which redis
ERROR:  Can't find Ruby library file or shared library redis
```

入っていないのでGemfileで管理する。
また、ポートをホスト側とつなげていないのでdocker-compose.ymlにポートを記述する。

- [redis:bullseye｜Docker](https://hub.docker.com/layers/library/redis/bullseye/images/sha256-44acefad97bbaf51632748f469c1ebb859f62e2f2bcc96cdf776b8b791ecac1d?context=explore)

上記によればポートは`6379`なので、それを追加する。

- [ File: README — Documentation for redis (5.0.5) ](https://www.rubydoc.info/gems/redis)
- [GitHub - redis/redis-rb: A Ruby client library for Redis](https://github.com/redis/redis-rb)
- [ Class: Redis::Distributed — Documentation for redis (5.0.5) ](https://www.rubydoc.info/gems/redis/Redis/Distributed#ping-instance_method)

プログラムから利用する方法に関しては上記を参考にする。

コンテナを起動していない状態でスクリプトを実行すると以下のエラーが出る。

```bash
$ ruby redis_application.rb 
#<Redis client v5.0.5 for redis://localhost:6379/0>
/lib/ruby/3.1.0/socket.rb:1214:in `__connect_nonblock': Connection refused - connect(2) for 127.0.0.1:6379 (Redis::CannotConnectError)
```

## もう少し詳しく調べる

redisのチートシートを見つけた。以下に示す。
- [Redisチートシート(導入編) - Qiita](https://qiita.com/morrr/items/271548776938e7ddc0ec)
- [Redisチートシート(コマンド編) - Qiita](https://qiita.com/morrr/items/3639f549dcf33992c851)

cliで操作をもう一度練習する。

```bash
redis-cli
```

- [Redisチートシート(コマンド編) - Qiita](https://qiita.com/morrr/items/3639f549dcf33992c851)

理解を深める有力な方法は、いつもどおりデータの形と演算の種類を理解することだと上記を読んで感じた。

まず、テータの種類。以下に示す。
- [Redis data types｜Redis](https://redis.io/docs/data-types/)
- [Redis data types tutorial｜Redis](https://redis.io/docs/data-types/tutorial/)

演算の種類はチートシートにも書いているが、公式リファレンスのリンクを示す。
- [Commands｜Redis](https://redis.io/commands/)

上記リンクのフィルターに処理したいデータ型を指定するとメソッド一覧が表示される。  
例えばHashだと以下。
- [Hash｜Commands｜Redis](https://redis.io/commands/?group=hash)

とりあえず基本については学習できたと思うので一旦終了。