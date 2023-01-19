//websocketの接続を確立する。
const ws = new WebSocket("ws://172.21.0.3:8080");

//butttonを取得。
const button = document.querySelector('#button');
button.addEventListener("click",(event)=>{
    console.log('clicked!');
    ws.send('clicked!');
});

//接続時に発生するイベントを定義
ws.addEventListener('open', (event)=>{
    console.log("opened!");
});
//データを受信したときの挙動を定義
ws.addEventListener('message',(data,isBinary)=>{
    console.log(data.data);
});