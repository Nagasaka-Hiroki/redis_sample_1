const websocket = new WebSocket('ws://localhost:3030');
websocket.on('open', ()=>{
    websocket.send('something');
});

websocket.on('message',(data)=>{
    console.log("received: %s",data);
});