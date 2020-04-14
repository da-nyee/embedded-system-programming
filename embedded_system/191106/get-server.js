const express = require('express');
const app = express();

var mydata = {
    name:"홍길동",
    age:27,
    addr:"수원",
    tel:"010-9999-8888",
    };

var cnt = 1;

const getmember = (req, res) => {
    console.log("Server: GET(%d) >> 데이터 보냄!", cnt++);
    res.send(mydata);
}

app.get('/member', getmember);

app.listen(60001, () => {
    console.log("Peer1: 서버(60001) 가동 중...");
});