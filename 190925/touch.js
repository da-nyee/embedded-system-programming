const gpio = require('node-wiring-pi');
const TOUCH = 23;

const CheckTouch = function()
{
    var data = gpio.digitalRead(TOUCH);
    if(data)
        console.log("Nodejs: Touched!");
    setTimeout(CheckTouch, 300);
}

process.on('SIGINT', function()
{
    gpio.digitalWrite(LED, 0);
    console.log("Program Exit..");
    process.exit();
})

gpio.setup('wpi');
gpio.pinMode(TOUCH, gpio.INPUT);
setTimeout(CheckTouch, 10);