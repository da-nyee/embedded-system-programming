const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var mydata = {
    name:"홍길동",
    age:27,
    addr:"수원",
    tel:"010-9999-8888",
    };

app.use(bodyParser.urlencoded({extended:false}));

app.put('/member', function(req, res){
    console.log("PUT method로 데이터 수신...");
    console.log("이름: " + req.body.name);
    console.log("나이: " + req.body.age);
    console.log("주소: " + req.body.addr);
    console.log("전화: " + req.body.tel);
    res.send("서버에서 확실하게 받았다고 함");
});

app.listen(60001, () => {
    console.log("Peer1: 서버(60001) 가동 중...");
});