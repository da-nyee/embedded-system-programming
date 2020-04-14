const gpio = require('node-wiring-pi');
const mysql = require('mysql');
const ws281x = require('@bartando/rpi-ws281x-neopixel');

const NUM_LEDS = 16;
const TRIG = 29;
const ECHO = 28;

var startTime;  // 초음파 송출시간
var travelTime; // 초음파 수신까지 경과시간

const client = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'gachon654321',
    database:'sensordb'
});

ws281x.init({
    count:NUM_LEDS,
    stripType:ws281x.WS2811_STRIP_GRB
});
ws281x.setBrightness(10);

const LEDon = (color, max) => {
    for(let i = 0; i < max; i++) {
        ws281x.setPixelColor(i, color);
        ws281x.show();
        gpio.delay(1);
    }
}

const Triggering = function() {
    gpio.digitalWrite(TRIG, gpio.LOW);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(TRIG, gpio.HIGH);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(TRIG, gpio.LOW);

    while(gpio.digitalRead(ECHO) == gpio.LOW);
    startTime = gpio.micros();

    while(gpio.digitalRead(ECHO) == gpio.HIGH);
    travelTime = gpio.micros() - startTime;

    distance = travelTime/58;

    if(distance < 400) {    // filtering
        console.log("근접거리: %icm", distance);

        if(distance > 0 && distance < 5)
            LEDon({r:255, g:0, b:0}, 16);
        else if(distance >= 5 && distance < 10)
            LEDon({r:255, g:0, b:0}, 13);
        else if(distance >= 10 && distance < 20)
            LEDon({r:255, g:0, b:0}, 10);
        else if(distance >= 20 && distance < 30)
            LEDon({r:255, g:0, b:0}, 6);
        else
            LEDon({r:255, g:0, b:0}, 1);

        if(distance <= 20) {
            let stamptime = new Date();

            client.query('INSERT INTO neosonic VALUES (?, ?)', [stamptime, distance], (err, result) => {
                if(err) {
                    console.log("DB 저장실패");
                    console.log(err);
                }
                else {
                    console.log("DB 저장성공");
                }
            });
        }
    }
    LEDon({r:0, g:0, b:0}, 16);

    setTimeout(Triggering, 100);
}

process.on('SIGINT', function() {
    console.log("Program Exit...");
    ws281x.reset();
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
setImmediate(Triggering);