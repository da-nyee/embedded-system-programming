const gpio = require('node-wiring-pi');
const BLUE = 24;
const GREEN = 29;
const RED = 28;
const BUZZER = 25;
const TOUCH = 27;
const LIGHT = 23;
var count = 0;

const TurnOnBuzzer = function()
{
    gpio.digitalWrite(BUZZER, 1);
}

const TurnOffBuzzer = function()
{
    gpio.digitalWrite(BUZZER, 0);
}

const CheckTouch = function()
{
    var touch = gpio.digitalRead(TOUCH);
    if(touch)
    {
        console.log("Touched!");
        switch(count % 3)
        {
            case 0: TurnOnBuzzer();
                    setTimeout(TurnOffBuzzer, 50);
                    gpio.digitalWrite(BLUE, 1);
                    gpio.digitalWrite(GREEN, 1);
                    setTimeout(CheckLight, 300);
                    break;
            case 1: TurnOnBuzzer();
                    setTimeout(TurnOffBuzzer, 80);
                    gpio.digitalWrite(BLUE, 0);
                    gpio.digitalWrite(GREEN, 0);
                    break;
            case 2: TurnOnBuzzer();
                    setTimeout(TurnOffBuzzer, 40);
                    setTimeout(TurnOnBuzzer, 50);
                    setTimeout(TurnOffBuzzer, 100);
                    gpio.digitalWrite(BLUE, 0);
                    gpio.digitalWrite(GREEN, 0);
                    gpio.digitalWrite(RED, 0);
                    break;
            default: break;
        }
        count++;
    }
    setTimeout(CheckTouch, 300);
}

const CheckLight = function()
{
    gpio.digitalWrite(RED, 0);
    var data = gpio.digitalRead(LIGHT);
    if(!data)
    {
        console.log("Nodejs: Bright! RED off");
        gpio.digitalWrite(RED, 0);
    }
    else
    {
        console.log("Nodejs: Dark! RED on");
        gpio.digitalWrite(RED, 1);
        gpio.digitalWrite(BLUE, 0);
        gpio.digitalWrite(GREEN, 0);
    }
       setTimeout(CheckLight, 2000);
}

process.on('SIGINT', function()
{
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(BUZZER, 0);
    console.log("Program Exit..");
    process.exit();
})

gpio.setup('wpi');
gpio.pinMode(LIGHT, gpio.INPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(TOUCH, gpio.INPUT);
setImmediate(CheckTouch);