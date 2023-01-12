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
