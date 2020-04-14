const gpio = require('node-wiring-pi');
const RELAY = 22;

const TurnOn = function()
{
    gpio.digitalWrite(RELAY, gpio.HIGH);
    console.log("Nodejs: RELAY on");
    setTimeout(TurnOff, 3000);
}

const TurnOff = function()
{
    gpio.digitalWrite(RELAY, gpio.LOW);
    console.log("Nodejs: RELAY off");
    setTimeout(TurnOn, 3000);
}

gpio.wiringPiSetup();
gpio.pinMode(RELAY, gpio.OUTPUT);
setTimeout(TurnOn, 200);