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

