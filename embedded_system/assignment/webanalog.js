const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const gpio = require('node-wiring-pi');
const mcpadc = require('mcp-spi-adc');

const CS_MCP3208 = 10;
const SPI_CHANNEL_0 = 0;
const SPI_CHANNEL_1 = 1;
const SPI_SPEED = 1000000;
var QuietSound = 1997;
var sid, lid;

const LED = 29;

const soundsensor = mcpadc.openMcp3208(SPI_CHANNEL_0,
    {speedHz:SPI_SPEED},
    (err) => {
        console.log("MCP-ADC 사운드센서 초기화");
        if(err)
            console.log("ADC 사운드센서 초기화 실패 (HW 점검!)");
    });

const lightsensor = mcpadc.openMcp3208(SPI_CHANNEL_1,
    {speedHz:SPI_SPEED},
    (err) => {
        console.log("MCP-ADC 광센서 초기화");
        if(err)
            console.log("ADC 광센서 초기화 실패 (HW 점검!)");
    });

app.use(bodyParser.urlencoded({extended:false}));

const SoundDetect = () => {
    soundsensor.read((error, reading) => {
        console.log("▲ ▼ (%d)", reading.rawValue);
        if(reading.rawValue > QuietSound) // 기준값 이상인 경우
            console.log("기준값:(%d), 사운드센서 아날로그 측정값:(%d)", QuietSound, reading.rawValue);
        else
            console.log("인식 안 함");
    });

    sid = setTimeout(SoundDetect, 200);
}

const LightDetect = () => {
    lightsensor.read((error, reading) => {
        console.log("광센서 아날로그 측정값: (%d)", reading.rawValue);

        gpio.softPwmWrite(LED, 0);

        if(reading.rawValue > 250 && reading.rawValue <= 500){ // 251~500
            gpio.softPwmWrite(LED, 20);
        }
        else if(reading.rawValue > 500 && reading.rawValue <= 550){    // 501~550
            gpio.softPwmWrite(LED, 30);
        }
        else if(reading.rawValue > 550 && reading.rawValue <= 1000){    // 551~1000
            gpio.softPwmWrite(LED, 40);
        }
        else if(reading.rawValue > 1000 && reading.rawValue <= 1500){   // 1001~1500
            gpio.softPwmWrite(LED, 50);
        }
        else if(reading.rawValue > 1500 && reading.rawValue <= 2000){   // 1501~2000
            gpio.softPwmWrite(LED, 60);
        }
        else if(reading.rawValue > 2000 && reading.rawValue <= 2500){   // 2001~2500
            gpio.softPwmWrite(LED, 70);
        }
        else if(reading.rawValue > 2500 && reading.rawValue <= 3000){   // 2501~3000
            gpio.softPwmWrite(LED, 80);
        }
        else if(reading.rawValue > 3000 && reading.rawValue <= 3500){   // 3001~3500
            gpio.softPwmWrite(LED, 90);
        }
        else if(reading.rawValue > 3500 && reading.rawValue <= 4095){   // 3501~4095
            gpio.softPwmWrite(LED, 100);
        }
        else{   // 0~250
            gpio.softPwmWrite(LED, 10);
        }
        
        lid = setTimeout(LightDetect, 200);
    });
}

app.get('/', (req, res) => {
    console.log("sensor 호출");
    fs.readFile('views/web_analog.html', 'utf8', (error, data) => {
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

app.get('/3', (req, res) => {
    console.log("light sensor 활성화 수행");
    lid = setTimeout(LightDetect, 200); // 활성화
    res.redirect('/');
});

app.get('/4', (req, res) => {
    console.log("light sensor 비활성화 수행");
    clearTimeout(lid); // 비활성화
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
    gpio.softPwmWrite(LED, 0);

    soundsensor.close(() => {
        console.log("사운드센서가 해제됩니다.");
    });

    lightsensor.close(() => {
        console.log("광센서가 해제됩니다.");
    });

    console.log("웹서버가 종료됩니다.");
    process.exit();
});

app.listen(60001, () => {
    gpio.wiringPiSetup();
    gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
    gpio.pinMode(LED, gpio.OUTPUT);
    gpio.softPwmCreate(LED, 0, 100);

    console.log("-------------------------------------------------");
    console.log("사운드센서 제어, 광센서 측정 웹서버");
    console.log("웹 브라우저 접속주소: http://192.9.113.106:60001/");
    console.log("-------------------------------------------------");
});