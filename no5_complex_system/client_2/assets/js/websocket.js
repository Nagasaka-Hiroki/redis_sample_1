//websocketの接続を確立する。
const ws = new WebSocket("ws://172.21.0.5:8080");

//butttonを取得。
const text_box = document.querySelector('#text_box');
text_box.addEventListener("keydown",(event)=>{
    if(event.key!=='Enter'|| !event.shiftKey || event.target.value===""){
        return;
    }
    ws.send(event.target.value);
    event.target.value = "";
});

//div要素を取得する。
const text_field = document.querySelector('#text_list');
//データを受信したときの挙動を定義
ws.addEventListener('message',(data,isBinary)=>{
    text_field.insertAdjacentHTML('beforeend',"<p>"+data.data+"</p>");
});