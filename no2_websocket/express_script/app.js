const express = require('express');
const app = express();

//htmlファイルを返す
app.use(express.static('public'));
//javascriptファイルを返す。
app.use('/assets',express.static(__dirname+'/assets'));
app.listen(3000);