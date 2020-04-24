const gpio = require("node-wiring-pi");
const ws281x = require("@bartando/rpi-ws281x-neopixel");

const NUM_LEDS = 12;
const TRIG = 29;
const ECHO = 28;
var startTime, travelTime;

ws281x.init({count: NUM_LEDS, stripType: ws281x.WS2811_STRIP_GRB});
ws281x.setBrightness(10);

const LEDon = (color, max) => {
    for(let i = 0; i < max; i++){
        ws281x.setPixelColor(i, color);
        ws281x.show();
        gpio.delay(1);
    }
}

const LEDtime = (color, max) => {
    LEDon({r:180, g:0, b:0}, 12);
    for(let i = 0; i < max; i++){
        ws281x.setPixelColor(i, {r:0, g:0, b:0});
        ws281x.show();
        gpio.delay(200);
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
    travelTime = gpio.micros()-startTime;

    distance = travelTime/58;

    if(distance < 400) {
        console.log("근접거리: %i cm", distance);
        if(distance > 0 && distance < 5){
            LEDtime({r:180, g:0, b:0}, 12);
        }
    }
    setTimeout(Triggering, 200);
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