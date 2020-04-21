const gpio = require("node-wiring-pi");

const RED = 24;
const GREEN = 25;
const BLUE = 23;

const TRIG = 29;
const ECHO = 28;
var startTime, travelTime;

const LedOn = function() {
    gpio.digitalWrite(RED, 1);
    gpio.digitalWrite(BLUE, 1);
    gpio.digitalWrite(GREEN, 1);

    gpio.delay(400);
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(RED, 1);

    gpio.delay(400);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(GREEN, 1);

    gpio.delay(400);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BLUE, 1);

    gpio.delay(400);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(GREEN, 0);
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

    distance = travelTime / 58;
    if(distance < 400) {
        console.log("Distance: %i cm\n", distance);

        if(distance > 0 && distance < 5) {
            LedOn();
        }
    }

    setTimeout(Triggering, 400);
}

process.on('SIGINT', function(){
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BLUE, 0);
    
    console.log("Program Exit...");
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);

setImmediate(Triggering);