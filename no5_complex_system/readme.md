# no5_complex_system
　複数のコンテナを接続して見る。

## no4の構成を複雑にする。
　以下の構成で実験する。

|コンテナ|個数|
|redis|1|
|nodejs|2|

上記の構成は以下のサイトの構成を参考にしている。
- [WebsocketとRedis Pub/Sub - Qiita](https://qiita.com/satofujino/items/7bf4b99e2176f63ca7ef)

上記のサイトの構成を参考にする理由は、この構成が複数コンテナを接続する構成の中で最も単純だからである。

まずdocker-compose.ymlでnodejsコンテナを複数作成する。

コンテナ起動後にポート番号を書き換えてブラウザ２つでそれぞれのコンテナに接続。メッセージを送信して反対側のブラウザを確認。  
→OK。うまく動作した。

## 疑問点の整理
　今回自分の構成では、同一チャネルで購読しているサブスクライバに対してブロードキャストする形で実装した。しかし、上記の参考サイトではwebsocketの機能で、websocket内のすべてのクライアントに対してブロードキャストしている。どういった違いがあるのだろうか？もう一度参考サイトを読んで確認してみる。

どうやら`noServer`が参考サイトではミソらしい。以下参考。
- [ws/ws.md at a3214d31b63acee8e31065be9f5ce3dd89203055 · websockets/ws · GitHub](https://github.com/websockets/ws/blob/HEAD/doc/ws.md)

このモードで初期化すると、httpサーバを一つだけ用意するだけでいいそうだ。つまり、コンテナでスクリプトを実装するのは片方だけで良いということ。２つ必要なのはwebsocketサーバ。複雑なので表にまとめる。名称は適当にしている。あくまで理解が目的なので。

|サーバ名|役割|クライアント名|
|-|-|-|
|nodejs 1|httpサーバ、websocketサーバ|client 1|
|nodejs 2|websocketサーバ|client 2|
|redis|redisサーバ|nodejs 1, nodejs 2|

すなわち、websocketサーバは２つ用意する必要があるが、httpサーバは一つで良いということになる。これは`noServer`の参考サイトのところに書いている内容、websocketサーバは完全にhttpサーバと分離することができるというところに相当している。

つまり、client 1はwebsocketサーバとしてnodejs 1を、client 2はnodejs 2をwebsocketサーバとして使用している。

となると読み間違えをしている。ソースを読みに行った。
- [GitHub - rihofujino/pubsub-demo](https://github.com/rihofujino/pubsub-demo)

上記を読みにいくと両方のコンテナでhttpサーバとして動作するように設定している。

となると以下のように整理されるはず。正確でないので注意が必要だが、現状の理解を記録する。

|クライアント|httpサーバ|websocket確立の試行|websocketサーバ|
|-|-|-|-|
|client 1|nodejs 1|nodejs 1|nodejs 2|
|client 2|nodejs 2|nodejs 2|nodejs 1|

`noServer`が外部のhttpサーバを使用するという点に注意すると上記になる（これがないと単純に上記の表はすべて末尾の数字がクライアントと同じになる）。

`noServer`は外部のhttpサーバを使うという、つまりwebsocket確立の試行にはファイルを取得しているhttpサーバを使用するが、`noServer`オプションでwebsocketには反対側のサーバを指定する様になる。という理解をするとコードに納得がいく。

誤りかもしれないが、それはおいおい修正していく。あくまで現状の理解の整理として記録した。

そのため自分のコードと参考サイトのコードの違いは、チャネル単位で見るか？websoket単位で見るかの違いだろうか？整理できたら追記or別リポジトリで記述することにする。

## 基本的な学習の終了
　参考サイトのコード理解が曖昧だが、一応websocketとredisのPub/Subを使ってチャットもどきが作れた。そのため最低限の学習目標は達成できたと考え、一旦学習を終了としてこのリポジトリの追記をやめる。理解が深まるor別途学習が必要な場合は新しいリポジトリを作成して学習を再開する。