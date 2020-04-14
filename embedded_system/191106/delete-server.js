const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var mydata = {
    name:"bmlee",
    age:89,
    addr:"성남",
    tel:"010-2222-3333",
    };

app.use(bodyParser.urlencoded({extended:false}));

app.delete('/member', function(req, res){
    console.log("DELETE: " + req.body.name + "인 자료를 삭제합니다.");
    res.send("서버에서 확실하게 받았다고 함");
});

app.listen(60001, () => {
    console.log("Peer1: 서버(60001) 가동 중...");
});