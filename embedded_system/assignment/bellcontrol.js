const gpio = require('node-wiring-pi');
const BUTTON = 24;
const BLUE = 29;
const RED = 28;
const BUZZER = 26;
var count = 0;

const TurnOnBlueLED = function()
{
    gpio.digitalWrite(BLUE, 1);
    gpio.delay(500);
    gpio.digitalWrite(BLUE, 0);
}

const TurnOnBuzzer = function()
{
    console.log("Buzzer");
    gpio.digitalWrite(BUZZER, 1);
    gpio.delay(300);
    gpio.digitalWrite(BUZZER, 0);
}

const ControlButton = function()
{
    var data = gpio.digitalRead(BUTTON);

    if(!data)
        count++;
    else
        count = 0;

    setTimeout(ControlButton, 300);
}

const BellControl = function()
{
    if((count > 0) && (count < 10))
    {
        gpio.digitalWrite(RED, 0);
        TurnOnBlueLED();
    }
    else if(count >= 10)
    {
        if(count == 10)
            TurnOnBuzzer();
        else
            gpio.digitalWrite(RED, 1);
    }
    
    setTimeout(BellControl, 500);
}

process.on('SIGINT', function()
{
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(BUZZER, 0);
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
setImmediate(ControlButton);
setImmediate(BellControl);