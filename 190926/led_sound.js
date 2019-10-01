const gpio = require('node-wiring-pi');
const SOUND = 7;
const BLUELED = 29;

const DetectSound = function()
{
    gpio.digitalWrite(BLUELED, 0);
    var data = gpio.digitalRead(SOUND);
    if(data)
    {
        gpio.digitalWrite(BLUELED, 1);
        console.log("Nodejs: it sounds loud!");
    }
    setTimeout(DetectSound, 10);
}

process.on('SIGINT', function()
{
    gpio.digitalWrite(BLUELED, 0);
    console.log("Program Exit...");
    process.exit();
})

gpio.wiringPiSetup();
gpio.pinMode(SOUND, gpio.INPUT);
gpio.pinMode(BLUELED, gpio.OUTPUT);
console.log("소리탐지 중...");
setTimeout(DetectSound, 10);