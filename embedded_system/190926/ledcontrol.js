const gpio = require('node-wiring-pi');
const BUTTON = 22;
const BUZZER = 24;
const BLUE = 29;
const RED = 28;
const GREEN = 27;

var count = 0;

const ControlLedBuzzer = function()
{
    switch(count % 3)
    {
        case 0: gpio.digitalWrite(BLUE, 1);
                gpio.digitalWrite(BUZZER, 1);
                console.log("Nodejs: BLUE on");
                break;
        case 1: gpio.digitalWrite(RED, 1);
                gpio.digitalWrite(BUZZER, 1);
                console.log("Nodejs: RED on");
                break;
        case 2: gpio.digitalWrite(GREEN, 1);
                gpio.digitalWrite(BUZZER, 1);
                console.log("Nodejs: GREEN on");
                break;
        default: break;
    }
}

const CheckButton = function()
{
    let data = gpio.digitalRead(BUTTON);
    if(!data)
    {
        ControlLedBuzzer();
    }
    setTimeout(CheckButton, 500);
}

process.on('SIGINT', function()
{
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    console.log("Program Exit..");
    process.exit();
})

gpio.setup('wpi');
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
setImmediate(CheckButton);