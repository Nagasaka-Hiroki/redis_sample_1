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

## Node.jsでサーバを作成
### Node.js単体で作成
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

以下のサイトはcssまで適応する内容を書いてくれている。
- [第3回「Node.js入門」htmlファイルを表示　node.js – ページ 4 – 優しいPHPとHTML5](https://testtesttest21.sakura.ne.jp/wp/2018/06/06/%e7%ac%ac3%e5%9b%9e%e3%80%8cnode-js%e5%85%a5%e9%96%80%e3%80%8dhtml%e3%83%95%e3%82%a1%e3%82%a4%e3%83%ab%e3%82%92%e8%a1%a8%e7%a4%ba%e3%80%80node-js/4/)

とりあえず、今回の主眼はwebsocketなのでこのへんでソースとしてファイルが認識されていない点は無視する。

次はjavascriptファイルを読み込む。

単純にscriptタグをつけると読み込まれるのはhtmlファイルだった。そのためURLによって返すファイルを変える設定を追加する。

なお、javascript（scriptタグで設定したもの）をリクエストしたときのURLは以下。

```
http://localhost:3000/console_write.js
```

nodejsのURLについては以下。
- [URL｜Node.js v18.13.0 Documentation](https://nodejs.org/dist/latest-v18.x/docs/api/url.html#url-strings-and-url-objects)

以下の構成でjavascriptが使えるようになった。

```js
//必要なモジュールをロードする。
const fs = require('fs');
const http = require('http');
const path = require('path');

//サーバを作成
const server = http.createServer((req, res)=>{
    //ファイルを開くためにパスを作る。
    let file_name = "."+req.url;
    //もしルートでアクセスされた場合、index.htmlを返す
    if (req.url==="/") {
        file_name = "./index.html";
    } else if (req.url==="/favicon.ico") {
        //faviconは作っていないが、これで停止されると困るので200で返す。
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write("/favicon.ico is not defined.\n");
        res.end();
        return;
    }
    //ファイルパスを取得しファイルを読み込む。拡張子の種類によってヘッダを変える。
    fs.readFile(file_name,'utf-8',(err,data)=>{
        const ext_format = path.extname(req.url);
        if (ext_format===".html") {
            res.writeHead(200,{'Content-Type':'text/html'});
        } else if (ext_format===".js"){
            res.writeHead(200,{'Content-Type':'text/javascript'});
        }
        //レスポンスボディの内容は共通
        res.write(data);
        res.end();
    });
});

//3000番ポートで受け付ける。
server.listen(3000);
```

上記の状態はリクエストしたURLによってきちんと返す内容を変更している。こうするとjavascriptファイルを読み込むことができる。javascriptの読み込みはajax通信だと思っていたが通常のhttpリクエストで処理されていた。そのためnodejs側でもindex.htmlと同様の処理で対応できた。ajaxについては後日しっかりと確認しておく。今回は主眼ではないので除外する。

サーバサイドスクリプトを上記のようにしクライアントサイドスクリプトを以下のように設定した（index.htmlのscriptタグに読み込むように追加している）。

```js
console.log('hello world!');
```

この状態でサーバを起動してコンソールを確認した結果。`hello world!`と表示されていた。

よって、上記までで以下の項目を実現できた。

1. URLのパスに指定されたソースを種類に応じてレスポンスできる
1. クライアント側でjavascriptの実行が可能になった。

故に、次はwebsocketを導入し双方向通信の実現をやってみる。

---

途中のエラー対応について調べた。リンクをメモする。
- [Node.jsでimport・exportを使う - みかづきブログ・カスタム](https://blog.kimizuka.org/entry/2021/09/10/223310)  
 "type": "module"を直接うちこんでOK。初めはそれぞれに対応する名前が入ると思ったが、エラーをそのまま書き込むそうだ。
- [package.json ファイルを作成する (npm init) - まくまくNode.jsノート](https://maku77.github.io/nodejs/npm/npm-init.html)
- [オブジェクト · JavaScript Primer #jsprimer](https://jsprimer.net/basic/object/)

---

## Node.jsでWebsocketサーバを作成
　通常のサーバは完成したはず（リクエストした結果が返されるのでサーバと呼べるはず。）。  
　そのためWebsocketをjavascriptで作って動作させる。

websocketのライブラリは以下。
- [websocket - npm](https://www.npmjs.com/package/websocket)
- [ws - npm](https://www.npmjs.com/package/ws)

上記の２つだが、１つ目は更新が２年前なので、２つ目を使う。２つ目は１０日前になっている。

以下のコマンドでインストールする。

```bash
npm i ws
```

---

小ネタ
- [JavaScript とは - ウェブ開発を学ぶ｜MDN](https://developer.mozilla.org/ja/docs/Learn/JavaScript/First_steps/What_is_JavaScript)  
これによれば`<script defer>`とすると全体を読み込んだ後にスクリプトを読み込むことができる。

---

wsのドキュメントは以下。
- [ws/ws.md at a3214d31b63acee8e31065be9f5ce3dd89203055 · websockets/ws · GitHub](https://github.com/websockets/ws/blob/HEAD/doc/ws.md)

このライブラリには大きく２つのクラスがある。種類と用途をまとめると以下の通りだと思われる。

|クラス名|用途|
|-|-|
|WebSocket|クライアントサイドの挙動を定義|
|WebSocketServer|サーバサイドの挙動を定義|

あくまで推測だが、使用例を読んでいるとそんな感じがした。

また、javascript自体にwebsocketがあるので、それと混同しないように注意する。以下に示す。
- [WebSocket - Web API｜MDN](https://developer.mozilla.org/ja/docs/Web/API/WebSocket)

まず、使用例を参考にサーバ側とクライアント側の実装を試す。

以下のエラーが出る。

```
Uncaught ReferenceError: require is not defined
```

おそらくnode_mmodulesがブラウザ側にないからだと思われる。javascriptがリクエストされたときに一緒に飛ばす。

- [for...of - JavaScript｜MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for...of)

ディレクトリの中の一覧がほしい。以下を読んだ。
- [node.js 指定したディレクトリの配下にあるディレクトリやフォルダを取得する｜mebee](https://mebee.info/2021/01/03/post-24355/)

上記によれば`readdir`を使うそう。

- [指定したパスがディレクトリかどうか調べる - まくまくNode.jsノート](https://maku77.github.io/nodejs/io/is-directory.html)

ファイルか？ディレクトリかの判定は`isDirectory`が使えるそうだ。

うっかりミスをしていた。同じことをしている人がいたのでメモ。
- [javascript - Unhandled rejection TypeError: path.extname is not a function - Stack Overflow](https://stackoverflow.com/questions/40692358/unhandled-rejection-typeerror-path-extname-is-not-a-function)


`node_module`がないとメソッドを呼び出せない。そのためブラウザ側に`node_module`を配置する。リクエストを発行できるのはクライアントだけなので、javascriptで`node_module`を読み込む。一度fetch apiで試したが、ソースにうまく配置されていなかったので、XMLHttpRequestを使って取得する。

- [XMLHttpRequest.open() - Web API｜MDN](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/open)
- [XMLHttpRequest の使用 - Web API｜MDN](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)
- [XMLHttpRequest.setRequestHeader() - Web API｜MDN](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/setRequestHeader)
- [XMLHttpRequest - Web API｜MDN](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest)
- [サーバーからのデータ取得 - ウェブ開発を学ぶ｜MDN](https://developer.mozilla.org/ja/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data)
- [厳格モード - JavaScript｜MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Strict_mode)
- [モジュール, 導入](https://ja.javascript.info/modules-intro)

xhrは使わなくても良かった。以下のようにすれば良いと感じる。

```html
<!-- html file -->
<script type="module" src="./websocket.js" defer></script>
```
```js
// javascript file
import WebSocket from './node_modules/ws';
```

認識の間違い。node.jsはあくまでサーバサイドスクリプトなのでクライアントで使える（使えなくはないと思うが）わけではないと思う。  
そのため、今の主眼はwebsocketサーバを立てることなので、`node_module`をクライアント側に送信する操作は今は考えない。  
→クライアントはjavascript標準のwebsocketを使う。  
→クライアントで使うためには`node_module`をクライアントに配置しないといけない。→これができていないので必要に応じて調べる

---

小ネタ。

nodejsでファイルを開くときに書いたものをメモする。

```js
//node_modulesを返す。
function get_node_modules(dir_path){
    fs.readdir(dir_path,(err,files)=>{
        for (const item of files) {
            fs.stat(dir_path+"/"+item,(err,stats)=>{
                if (stats.isDirectory()){
                    get_node_modules(dir_path+"/"+item);
                } else {
                    const file_ext = path.extname(item);
                    if (file_ext===".js"){
                        fs.readFile(dir_path+"/"+item,'utf-8',(err,data)=>{
                            console.log(data);
                        });
                    }
                }
            });
        }
    });
}
```

---

### Expressフレームワークを使う。
　Nodejs単体で作るのは、やっていて難しい。単純なサーバであれば作ることができたが、WebSocketサーバはうまく行かなかった。そのため一旦フレームワークを試してみようと思う。以下に示す。

- [Express - Node.js Web アプリケーション・フレームワーク](https://expressjs.com/ja/)
- [GitHub - expressjs/express: Fast, unopinionated, minimalist web framework for node.](https://github.com/expressjs/express)
- [【Express】Node.js 人気No.1フレームワーク とは｜Hisamacho Engineer Blog](https://yu-teck.com/programming/express/what-is-express/)

Expressは小さい機能と高いカスタマイズ性。その反面、多くの知識が必要。といった特徴があるそうだ。そこまで大きいプログラムを作る予定はないことと、基礎を学ぶことが目的であるため今回のケース的に良いと感じるため採用する。

インストールをする。
- [Express のインストール](https://expressjs.com/ja/starter/installing.html)

まずは単純なhttpサーバを作る。
- [Express の「Hello World」の例](https://expressjs.com/ja/starter/hello-world.html)
- [GitHub - expressjs/express: Fast, unopinionated, minimalist web framework for node.](https://github.com/expressjs/express)

上記を例にする。

とりあえずHello world。

```js
const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.send("Hello, World!\n");
});
app.listen(3000);
```

#### httpサーバの作成
静的なhtmlファイルを返す様に設定するには以下。

ファイルを、`./public/index.html`にはいちする。その後`http://localhost:3000/index.html`にアクセスする。

```js
const express = require('express');
const app = express();

app.use(express.static(__dirname+'/public'))
app.listen(3000);
```

→OK。

次はjavascriptのインクルードを試す。

1. `assets/js/hello.js`を配置する。
1. `<script src="./assets/js/hello.js"></script>`をヘッダに追加。

読み込みがうまく行かないので以下参考。
- [Express4 jadeからのjsファイル読み込みにハマる。 - かもメモ](https://chaika.hatenablog.com/entry/2015/10/30/083000)

以下のように設定すると、nodejs単体で作ったときとほどんど同じ動作になる。

```js
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use('/assets',express.static(__dirname+'/assets'));
app.listen(3000);
```

コードの量がかなり圧縮できた。

とりあえず、単純なhttpサーバはできたはず。次はwebsocketサーバを作る。

---

小ネタ。  
app.onはExpressにあった。ということはWebSocketはExpressに依存している？  
→依存関係を調べた。以下に示す。

- [express-ws - npm](https://www.npmjs.com/package/express-ws?activeTab=readme)  
とりあえず無関係ではなさそう。

読み込み方については以下。
- [jsのimportとrequireの違い - Qiita](https://qiita.com/minato-naka/items/39ecc285d1e37226a283)

---

#### WebSocketサーバの作成
　時間がかかり過ぎなので以下の内容をもう少し見る。
- [WebsocketとRedis Pub/Sub - Qiita](https://qiita.com/satofujino/items/7bf4b99e2176f63ca7ef)

書き方が参考になった点と`noServer`モードがあることがわかった。

もう少し細かい内容は以下。
- [【Node.js】WebSocketサーバ と WebSocket API を使ってチャットもどきを作ってみよう！【サンプルコードあり】｜ラッコWeb](https://don-bu-rakko.com/javascript-websocket-api/)

上記の疎通確認コマンドの存在がびっくり。そんなコマンドがあったとは知らなかった。
- [wscat - npm](https://www.npmjs.com/package/wscat)

`g`オプションでインストールするのでDockerfileを使ってイメージを作り直す。

とりあえず以下を実行。

```bash
$ wscat -c ws://localhost:3000
error: Unexpected server response: 200
```

コマンドは動いたが、エラーが出た。サーバ側は以下の構成。

```js
//websocketサーバを作成する。
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });
wss.on('connection',(ws)=>{
    ws.on('message',(data)=>{
        console.log(data);
    });
    ws.send('connected!');
});
```

下記も参考になるかもしれない。
- [【Node.js + Express】WebSocketを使ってみる( + 全クライアントに一斉送信) - とある科学の備忘録](https://shizenkarasuzon.hatenablog.com/entry/2021/04/21/004132)


以下の構成でうまく行った。

```js
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});

wss.on('connection',(ws)=>{
    ws.on('message',(data)=>{
        console.log(data);
    });
    ws.send('connected!');
});
```

上記構成で、以下のコマンドを実行すると接続が確認できた。

```bash
$ wscat -c ws://localhost:8080
Connected (press CTRL+C to quit)
< connected!
```

やはりクライアント側で`on`が使えない。

クライアント側とサーバ側のメッセージのやり取りについてまとめる。  
→以下は誤りだと後から気づいたが、どう間違っていたかを記録するために残しておく。

|種類|名称|サーバorクライアント|内容|
|-|-|-|-|
|メソッド|send|クライアント|サーバにデータを送信する。|
|メソッド|send|サーバ|クライアントにデータを送信する。|
|イベント|message|クライアント|サーバからデータを受信した時に発生する。|
|イベント|message|サーバ|クライアントからデータが送られて来たときに発生する。|
|イベント|connection|サーバ|コネクションが確立したときに発生する。|
|イベント|open|クライアント|コネクションが確立したときに発生する。|

- [【JavaScript】WebSocketとは？仕組みや使い方をわかりやすく解説｜アントレプレナー](https://kosuke-space.com/websocket-javascript)
- [WebSocket.send() - Web API｜MDN](https://developer.mozilla.org/ja/docs/Web/API/WebSocket/send)

上記のまとめを作って認識の間違いに気づいた。それは以下。
- websocketでは接続に成功するとクライアントとサーバの概念がなくなる（と感じる）。
 
そのため以下に示す内容に認識を変える。
- サーバとクライアントの概念があるのは接続を確立する時（httpで確立するので）
- サーバにはwebsocketサーバというhttpリクエストによってwebsocketによる接続を確立する処理が必要。
- クライアントにはwebsocketによる接続を開始するための処理が必要。
- セッションが確立するとクライアントとサーバの両方にwebsocketが生成され、それを使って双方向通信をおこなう。

とりあえずコードの方もボタンでイベントを発生させて、それをサーバとクライアントで受信する様に設定した。

これで、no2の目的である、websocketサーバの作成は達成できたと思う。次に進む。