const gpio = require('node-wiring-pi');
const BUTTON = 2;
const LED = 3;

const DetectButton = function()
{
    gpio.digitalWrite(LED, 1);
    gpio.delay(50);
    gpio.digitalWrite(LED, 0);
}

process.on('SIGINT', function()
{
    gpio.digitalWrite(LED, 0);
    console.log("Program Exit...");
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(LED, gpio.OUTPUT);
console.log("Event Driven Method: Button을 누르면 LED가 켜집니다.");
gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_RISING, DetectButton);