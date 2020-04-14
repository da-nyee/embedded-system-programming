const express = require('express');
const gpio = require('node-wiring-pi');
const bodyParser = require('body-parser');
const app = express();

const GREEN = 29;
const RED = 28;
const BLUE = 27;

var mydata = {
    actid:'LED3',
    encode:0
    };

const led3control = (req, res) => {
    console.log("PUT method로 데이터 수신...");

    if(req.body.actid == 'LED3'){
        if(req.body.encode == 0){
            gpio.digitalWrite(RED, 0);
            gpio.digitalWrite(GREEN, 0);
            gpio.digitalWrite(BLUE, 0);
            console.log("ALL OFF");
        }
        if(req.body.encode == 1){
            gpio.digitalWrite(RED, 1);
            gpio.digitalWrite(GREEN, 0);
            gpio.digitalWrite(BLUE, 0);
            console.log("RED LED ON");
        }
        if(req.body.encode == 2){
            gpio.digitalWrite(RED, 0);
            gpio.digitalWrite(GREEN, 1);
            gpio.digitalWrite(BLUE, 0);
            console.log("GREEN LED ON");
        }
        if(req.body.encode == 3){
            gpio.digitalWrite(RED, 0);
            gpio.digitalWrite(GREEN, 0);
            gpio.digitalWrite(BLUE, 1);
            console.log("BLUE LED ON");
        }
        if(req.body.encode == 4){
            gpio.digitalWrite(RED, 1);
            gpio.digitalWrite(GREEN, 1);
            gpio.digitalWrite(BLUE, 1);
            console.log("WHITE LED ON");
        }
        res.send("OK");
    }
    else
        res.send("FAIL");
}

app.use(bodyParser.urlencoded({extended:false}));
app.put('/rotary', led3control);
app.get('/rotary', (req, res) => {
    console.log("GET method");
    res.okay("OK");
});

process.on('SIGINT', function(){
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BLUE, 0);
    process.exit();
});

app.listen(60001, () => {
    console.log("SVR_LED_ROTARY.js: 서버(60001) 가동 중...");

    gpio.wiringPiSetup();
    gpio.pinMode(GREEN, gpio.OUTPUT);
    gpio.pinMode(RED, gpio.OUTPUT);
    gpio.pinMode(BLUE, gpio.OUTPUT);
});