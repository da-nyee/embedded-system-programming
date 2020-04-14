const gpio = require('node-wiring-pi');
const SOUND = 29;
var count = 0;

const DetectSound = function()
{
    let data = gpio.digitalRead(SOUND);
    if(data)
    {
        console.log("%d !", count++);
    }
    setTimeout(DetectSound, 10);
}

process.on('SIGINT', function()
{
    console.log("Program Exit...");
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(SOUND, gpio.INPUT);
console.log("소리탐지 중...");
setTimeout(DetectSound, 10);