const gpio = require('node-wiring-pi');
const BUTTON = 24;
const BLUE = 29;
const RED = 28;
const GREEN = 27;
const BUZZER = 26;
var count = 0;

const TurnOnBuzzer = function()
{
    gpio.digitalWrite(BUZZER, 1);
    gpio.delay(50);
    gpio.digitalWrite(BUZZER, 0);
}

const DetectButton = function()
{
    var data = gpio.digitalRead(BUTTON);
    if(!data)
    {
        switch(count % 3)
        {
            case 0:
                gpio.digitalWrite(BLUE, 1);
                gpio.delay(50);
                TurnOnBuzzer();
                gpio.digitalWrite(BLUE, 0);
                break;
            case 1:
                gpio.digitalWrite(RED, 1);
                gpio.delay(50);
                TurnOnBuzzer();
                gpio.digitalWrite(RED, 0);
                break;
            case 2:
                gpio.digitalWrite(GREEN, 1);
                gpio.delay(50);
                TurnOnBuzzer();
                gpio.digitalWrite(GREEN, 0);
                break;
            default:
                break;
        }
        count++;
    }
    setTimeout(DetectButton, 500);
}

process.on('SIGINT', function()
{
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BUZZER, 0);
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
setImmediate(DetectButton);