const gpio = require("node-wiring-pi");
const ws281x = require("@bartando/rpi-ws281x-neopixel");

const NUM_LEDS = 12;
const TRIG = 29;
const ECHO = 28;
var startTime, travelTime;

ws281x.init({
    count: NUM_LEDS,
    stripType: ws281x.WS2811_STRIP_GRB
});
ws281x.setBrightness(10);

const BUZZER = 25;
const BUTTON = 24;
var count = 0;

const RED = 21;
const GREEN = 22;

var flag = 0;

const RedOn = function() {
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(RED, 1);
}

const GreenOn = function() {
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 1);
}

const DetectButton = function() {
    gpio.delay(150);

    if((count++ % 2) == 0) {
        console.log("첫번째 버튼 눌림. 활성화상태!");
        RedOn();

        gpio.digitalWrite(BUZZER, 1);
        gpio.delay(100);
        gpio.digitalWrite(BUZZER, 0);

        flag = 1;
    }
    else {
        console.log("두번째 버튼 눌림. 비활성화상태!");
        GreenOn();

        gpio.digitalWrite(BUZZER, 1);
        gpio.delay(30);
        gpio.digitalWrite(BUZZER, 0);
        gpio.delay(20);
        gpio.digitalWrite(BUZZER, 1);
        gpio.delay(30);
        gpio.digitalWrite(BUZZER, 0);

        flag = 0;
    }
    Triggering();
}

const LEDon = (color, max) => {
    for(let i = 0; i < max; i++){
        ws281x.setPixelColor(i, color);
        ws281x.show();
        gpio.delay(1);
    }
}

const LEDon_half1 = (color, max) => {
    for(let i = 0; i < max; i++){
        ws281x.setPixelColor(i, color);
        ws281x.show();
        gpio.delay(1);
    }
}

const LEDon_half2 = (color, max) => {
    for(let i = max; i < NUM_LEDS; i++){
        ws281x.setPixelColor(i, color);
        ws281x.show();
        gpio.delay(1);
    }
}

const Triggering = function() {
    if(flag == 1) {
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

            if(distance > 0 && distance < 5) {
                LEDon({r:180, g:0, b:0}, NUM_LEDS);
            }
            else if(distance >= 5 && distance < 15) {
                LEDon_half1({r:180, g:0, b:0}, NUM_LEDS/2);
                LEDon_half2({r:0, g:0, b:180}, NUM_LEDS/2);
            }
            else if(distance >= 15) {
                LEDon({r:0, g:0, b:180}, NUM_LEDS);
            }
        }
    }
    else {
        LEDon({r:0, g:0, b:0}, NUM_LEDS);
    }

    setTimeout(Triggering, 500);
}

process.on('SIGINT', function() {
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    ws281x.reset();

    console.log("Program Exit...");
    process.exit();
});

gpio.wiringPiSetup();

gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);

gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_FALLING, DetectButton);