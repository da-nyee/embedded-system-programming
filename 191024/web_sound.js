const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const gpio = require('node-wiring-pi');
const mcpadc = require('mcp-spi-adc');

const CS_MCP3208 = 10;
const SPI_CHANNEL = 0;
const SPI_SPEED = 1000000;
var QuietSound = 1997;
var sid;

const soundsensor = mcpadc.openMcp3208(SPI_CHANNEL,
    {speedHz:SPI_SPEED},
    (err) => {
        console.log("MCP-ADC 초기화");
        if(err)
            console.log("ADC 초기화 실패 (HW 점검!)");
    });

app.use(bodyParser.urlencoded({extended:false}));

const SoundDetect = () => {
    soundsensor.read((error, reading) => {
        console.log("▲ ▼ (%d)", reading.rawValue);
        if(reading.rawValue > QuietSound) // 기준값 이상인 경우
            console.log("기준값:(%d), 아날로그 측정값:(%d)", QuietSound, reading.rawValue);
        else
            console.log("인식 안 함");
    });

    sid = setTimeout(SoundDetect, 200);
}

app.get('/', (req, res) => {
    console.log("sensor 호출");
    fs.readFile('views/sen.html', 'utf8', (error, data) => {
        if(!error)
            res.send(data);
    });
});

app.get('/1', (req, res) => {
    console.log("sound sensor 활성화 수행");
    sid = setTimeout(SoundDetect, 200); // 활성화
    res.redirect('/');
});

app.get('/0', (req, res) => {
    console.log("sound sensor 비활성화 수행");
    clearTimeout(sid); // 비활성화
    res.redirect('/');
});

app.post('/', (req, res) => {
    let body = req.body;

    console.log("기준값이 다음 값으로 설정됩니다.");
    console.log("==> " + body.threshold);
    QuietSound = body.threshold;
    res.redirect('/');
});

process.on('SIGINT', function(){
    soundsensor.close(() => {
        console.log("MCP-ADC가 해제됩니다.");
        console.log("웹서버를 종료합니다.");
        process.exit();
    });
});

app.listen(60001, () => {
    gpio.wiringPiSetup();
    gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
    console.log("-----------------------");
    console.log("사운드센서 제어용 웹서버(인식용 기준값: %d)", QuietSound);
    console.log("웹 브라우저 접속주소: http://192.9.113.106:60001/");
    console.log("-----------------------");
});