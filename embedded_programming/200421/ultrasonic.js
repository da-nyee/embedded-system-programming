const gpio = require("node-wiring-pi");
const TRIG = 29;
const ECHO = 28;

var startTime;
var travelTime;

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
    }

    setTimeout(Triggering, 500);
}

process.on('SIGINT', function() {
    console.log("Program Exit...");
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
setImmediate(Triggering);