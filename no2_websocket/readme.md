# no2_websocket
　Node.jsコンテナでWebSocketサーバを作る。

## コンテナを準備する
イメージは以下。
- [Node.js｜Docker](https://hub.docker.com/_/node)

イメージをプルする。
- [node:18.13.0-bullseye](https://hub.docker.com/layers/library/node/18.13.0-bullseye/images/sha256-d9061fd0205c20cd47f70bdc879a7a84fb472b822d3ad3158aeef40698d2ce36?context=explore)
- [Node.js](https://nodejs.org/ja/)
> 最新安定版は18.13.0だそうだ。

```bash
docker pull node:18.13.0-bullseye
```

イメージの使い方は以下。
- [docker-node/README.md at main · nodejs/docker-node · GitHub](https://github.com/nodejs/docker-node/blob/main/README.md#how-to-use-this-image)

Dockerfileかdocker-compose.ymlで作成できるそうだ。docker run コマンドは引数が長くて面倒なのでdocker-compose.ymlで実行する。

上記サイトを参考にdocker-compose.ymlを作成する。  
また、[node:18.13.0-bullseye](https://hub.docker.com/layers/library/node/18.13.0-bullseye/images/sha256-d9061fd0205c20cd47f70bdc879a7a84fb472b822d3ad3158aeef40698d2ce36?context=explore)の内容を見ているとユーザが追加されている以下にメモする。

|項目|名称|ID|
|-|-|-|
|グループ名|node|1000|
|ユーザ名|node|1000|

そのためすでにユーザとグループは追加されている。また、IDがどちらも1000なのでホスト側との共有も楽になる。

nodejsコンテナのベストプラクティスがあった。一応リンクを貼っておく。
- [docker-node/BestPractices.md at main · nodejs/docker-node · GitHub](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

コンテナの準備はおおよそできたと思う。起動時に実行するコマンドの変更などはあるが、手動で操作する分には問題ない程度にできたはず。ここからは、Node.jsのAPIについて学習する。

APIリファレンス（最新安定版：18.13.0）は以下の通り。
- [Index｜Node.js v18.13.0 Documentation](https://nodejs.org/dist/latest-v18.x/docs/api/)

また、websocketのライブラリは以下。
- [ws - npm](https://www.npmjs.com/package/ws)
    - [ws/ws.md at a3214d31b63acee8e31065be9f5ce3dd89203055 · websockets/ws · GitHub](https://github.com/websockets/ws/blob/HEAD/doc/ws.md)
- [websocket - npm](https://www.npmjs.com/package/websocket)
    - [WebSocket-Node/index.md at cce6d468986dd356a52af5630fd8ed5726ba5b7a · theturtle32/WebSocket-Node · GitHub](https://github.com/theturtle32/WebSocket-Node/blob/HEAD/docs/index.md)

javascriptのwebsocketのページは以下。
- [WebSocket - Web APIs｜MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

Node.jsの使い方の参考は以下を参考。
- [とほほのNode.js入門 - とほほのWWW入門](https://www.tohoho-web.com/ex/nodejs.html)

---

docker-compose.ymlの追記：  
ポートを外に出していなかったのでそれを追加する。

---

## Node.jsの練習
　まず、
[とほほのNode.js入門 - とほほのWWW入門](https://www.tohoho-web.com/ex/nodejs.html)
にあるHello, worldから始める。  
→動作はちゃんとした。

また、Zennにまとめを作ってくれている人がいた。
- [Node.jsによるWebアプリケーション作成入門](https://zenn.dev/wkb/books/node-tutorial)

このサイトの次が重要そう。
- [Node.jsでHTTPサーバを構築しよう｜Node.jsによるWebアプリケーション作成入門](https://zenn.dev/wkb/books/node-tutorial/viewer/todo_02)

とほほのサイトにあるメソッドについてメモする。
- [Class: http.Server｜HTTP｜Node.js v18.13.0 Documentation](https://nodejs.org/dist/latest-v18.x/docs/api/http.html#requestwritechunk-encoding-callback)
- [server.listen()｜HTTP｜Node.js v18.13.0 Documentation](https://nodejs.org/dist/latest-v18.x/docs/api/http.html#serverlisten)

下記を記述してサーバを起動し、
[http://localhost:3000/](http://localhost:3000/)にアクセスするorコマンド`curl http://localhost:3000/`を実行する。

```js
const http = require('http');
const server = http.createServer((req, res)=>{
    res.end("Hello, world!\n");
});
server.listen(3000);
```

また、今回はdocker-compose.ymlで`expose`に3000を指定している。コンテナのIPアドレスは`172.21.0.3`に固定しているので以下のコマンドでも接続は成功するはず。

```bash
curl http://172.21.0.3:3000/
```
→OK成功した。

---

dockerの話になるが、理解の整理として記す。  
```yml
expose:
  - 3000
...
  ipv4_address: 172.21.0.3
```

上記のような書き方をすると、コンテナのipアドレスと開放したポートで`172.21.0.3:3000`に接続できるようになる。

それに対し、以下の書き方をすると`localhost:3000`にアクセスできるようになる。

```yml
ports:
  - 3000:3000
```

これはコンテナ（ipアドレス関係なく）の3000ポートをホスト（ループバックアドレス）の3000につなげることを表している。そのため`localhost:3000`とした結果が`<コンテナのIPアドレス>:3000`と同一になる。

---

ここまでで一通り、nodejsについて調べたが、結構難しいと感じた。

文法自体は簡単である。なぜならほとんどjavascriptと同じなので。なんどかjavascriptを書いたことがあったのでその点は問題ない。  
難しい点は、nodejsが非常にプレーンな機能であるからだ。Railsであればコマンドでおおよその基本機能の土台を提供してくれる。しかしnode.jsは現状そういったところがなさそう。そのため基本的な知識がかなり必要になる。当然なれている人にとってはよいことだが、現状の私には難しいところがある。しかしこれも勉強であるため調べながら解決することにする。

## Node.jsでサーバを作成。
　Node.jsの練習（Hello, world!)が済んだので、websocketサーバを作る。

package.jsonを作成し"type":"module"を追加する。package.json自体はnpm initでEnterを連打して生成した。  

まずhtmlファイルをgetする。  
index.jsに以下を追加する。
```js
import { readFile } from 'node:fs';
readFile('./index.html','utf-8',(err,data)=>{
    console.log(data);
});
```

これで`./index.html`をnodejsで読み込んで返すことができる。上記を実行した結果は以下。
```bash
$ node index.js 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>test page</h1>
</body>
</html>
```

---

注釈：  
`import { readFile } from 'node:fs';`の書き方をするためにpackage.jsonに"type":"module"と追記した。以下の書き方であれば不要。
```js
const fs = require('fs');
```

---

このファイルの読み込みをまずサーバ化する。

以下の様に変更し実行した結果を示す。
```js
//ファイルを読み込む。
const fs = require('fs');
//ファイルを読み込むオブジェクトを宣言
const input_data = {};
fs.readFile('./index.html','utf-8',(err,data)=>{
    input_data.html = data;
});
//サーバを作成
const http = require('http');
const server = http.createServer((req, res)=>{
    res.end(input_data.html);
});

server.listen(3000);
```
結果は以下。
```bash
$ curl http://localhost:3000
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>test page</h1>
</body>
</html>
```

上記のやり方でデバックコンソール（ブラウザ）を見たところ、htmlファイル自体がない。文字列として配信されていてファイルとして配信されているわけではないそうだ。方法を変える。

- [http.get(url[, options][, callback])｜HTTP｜Node.js v18.13.0 Documentation](https://nodejs.org/dist/latest-v18.x/docs/api/http.html#httpgetoptions-callback)  
→やってみたがこれも違いそう。

- [Node.jsでHTMLファイルを表示する｜プログラミング学習　きくちゃんの勉強部屋](https://kikuchance.com/2020/09/12/node-js-html/)  
→これに書いている内容だと、描画の仕方が違う感じ。response.writeが重要そう。この点でリファレンスを調べる。

- [response.write(chunk[, encoding][, callback])｜HTTP｜Node.js v18.13.0 Documentation](https://nodejs.org/dist/latest-v18.x/docs/api/http.html#responsewritechunk-encoding-callback)
- [response.writeHead(statusCode[, statusMessage][, headers])｜HTTP｜Node.js v18.13.0 Documentation](https://nodejs.org/dist/latest-v18.x/docs/api/http.html#responsewriteheadstatuscode-statusmessage-headers)



---

途中のエラー対応について調べた。リンクをメモする。
- [Node.jsでimport・exportを使う - みかづきブログ・カスタム](https://blog.kimizuka.org/entry/2021/09/10/223310)  
 "type": "module"を直接うちこんでOK。初めはそれぞれに対応する名前が入ると思ったが、エラーをそのまま書き込むそうだ。
- [package.json ファイルを作成する (npm init) - まくまくNode.jsノート](https://maku77.github.io/nodejs/npm/npm-init.html)
- [オブジェクト · JavaScript Primer #jsprimer](https://jsprimer.net/basic/object/)

---