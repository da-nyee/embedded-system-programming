const gpio = require('node-wiring-pi');
const mysql = require('mysql');

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mcpadc = require('mcp-spi-adc');

const CS_MCP3208 = 10;
const SPI_CHANNEL_0 = 0;
const SPI_SPEED = 1000000;
var lid;

const LIGHT = 29;

const client = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'gachon654321',
    database:'sensordb'
});

const lightsensor = mcpadc.openMcp3208(SPI_CHANNEL_0,
    {speedHz:SPI_SPEED},
    (err) => {
        console.log("MCP-ADC 광센서 초기화");
        if(err)
            console.log("ADC 광센서 초기화 실패 (HW 점검!)");
    });

app.use(bodyParser.urlencoded({extended:false}));

const LightDetect = () => {
    lightsensor.read((error, reading) => {
        console.log("광센서 아날로그 측정값: %d", reading.rawValue);

        if(reading.rawValue >= 1092 && reading.rawValue <= 4095) {
            let stamptime = new Date();

            client.query('INSERT INTO light VALUES (?, ?)', [stamptime, reading.rawValue], (err, result) => {
                if(err) {
                    console.log("DB 저장실패");
                    console.log(err);
                }
                else {
                    console.log("DB 저장성공");
                }
            });
        }

        lid = setTimeout(LightDetect, 800);
    });
}

app.get('/', (req, res) => {
    console.log("light sensor 호출");

    fs.readFile('views/light_db.html', 'utf8', (error, data) => {
        if(!error) {
            res.send(data);
        }
    });
});

app.get('/1', (req,res) => {
    console.log("light sensor 활성화 수행");
    lid = setTimeout(LightDetect, 800);
    res.redirect('/');
});

app.get('/0', (req, res) => {
    console.log("light sensor 비활성화 수행");
    clearTimeout(lid);
    res.redirect('/');
});

process.on('SIGINT', function(){
    lightsensor.close(() => {
        console.log("광센서가 해제됩니다.");
        console.log("웹서버가 종료됩니다.");
        process.exit();
    });
});

app.listen(60001, () => {
    gpio.wiringPiSetup();
    gpio.pinMode(CS_MCP3208, gpio.OUTPUT);

    console.log("-------------------------------------------------");
    console.log("광센서 측정 웹서버");
    console.log("웹 브라우저 접속주소: http://192.9.113.214:60001/");
    console.log("-------------------------------------------------");
});