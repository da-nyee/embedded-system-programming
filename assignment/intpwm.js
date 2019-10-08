const gpio = require('node-wiring-pi');
const BUTTON = 24;
const BLUE = 29;
const RED = 28;
const GREEN = 27;
const BUZZER = 26;
var caseCount = 0;
var ledCount = 0;

const ControlBuzzer = function()
{
    gpio.digitalWrite(BUZZER, 1);
    gpio.delay(50);
    gpio.digitalWrite(BUZZER, 0);
}

const DetectButton = function()
{
    switch(caseCount)
    {
        case 0: 
            if(ledCount === 0) // strict equality
                gpio.softPwmWrite(GREEN, 1);
            else if(ledCount === 1)
                gpio.softPwmWrite(GREEN, 25);
            else if(ledCount === 2)
                gpio.softPwmWrite(GREEN, 50);
            else if(ledCount === 3)
                gpio.softPwmWrite(GREEN, 75);
            else if(ledCount === 4)
                gpio.softPwmWrite(GREEN, 100);
            else
            {
                ControlBuzzer();
                ledCount = 0;
                caseCount++;
            }
            ledCount++;
            break;
        case 1:
            gpio.softPwmWrite(GREEN, 0);
            if(ledCount === 0)
                gpio.softPwmWrite(BLUE, 1);
            else if(ledCount === 1)
                gpio.softPwmWrite(BLUE, 25);
            else if(ledCount === 2)
                gpio.softPwmWrite(BLUE, 50);
            else if(ledCount === 3)
                gpio.softPwmWrite(BLUE, 75);
            else if(ledCount === 4)
                gpio.softPwmWrite(BLUE, 100);
            else
            {
                ControlBuzzer();
                ledCount = 0;
                caseCount++;
            }
            ledCount++;
            break;
        case 2:
            gpio.softPwmWrite(BLUE, 0);
            if(ledCount === 0)
                gpio.softPwmWrite(RED, 1);
            else if(ledCount === 1)
                gpio.softPwmWrite(RED, 25);
            else if(ledCount === 2)
                gpio.softPwmWrite(RED, 50);
            else if(ledCount === 3)
                gpio.softPwmWrite(RED, 75);
            else if(ledCount === 4)
                gpio.softPwmWrite(RED, 100);
            else
            {
                ControlBuzzer();
                ledCount = 0;
                caseCount++;
            }
            ledCount++;
            break;
        case 3:
            gpio.softPwmWrite(RED, 0);
            if(ledCount === 0)
            {
                gpio.softPwmWrite(GREEN, 1);
                gpio.softPwmWrite(BLUE, 1);
                gpio.softPwmWrite(RED, 1);
            }
            else if(ledCount === 1)
            {
                gpio.softPwmWrite(GREEN, 25);
                gpio.softPwmWrite(BLUE, 25);
                gpio.softPwmWrite(RED, 25);
            }
            else if(ledCount === 2)
            {
                gpio.softPwmWrite(GREEN, 50);
                gpio.softPwmWrite(BLUE, 50);
                gpio.softPwmWrite(RED, 50);
            }
            else if(ledCount === 3)
            {
                gpio.softPwmWrite(GREEN, 75);
                gpio.softPwmWrite(BLUE, 75);
                gpio.softPwmWrite(RED, 75);
            }
            else if(ledCount === 4)
            {
                gpio.softPwmWrite(GREEN, 100);
                gpio.softPwmWrite(BLUE, 100);
                gpio.softPwmWrite(RED, 100);
            }
            else
            {
                ledCount = 0;
                caseCount++;
            }
            ledCount++;
            break;
        case 4:
            gpio.softPwmWrite(GREEN, 0);
            gpio.softPwmWrite(BLUE, 0);
            gpio.softPwmWrite(RED, 0);
            ControlBuzzer();
            caseCount = 0;
            break;
        default:
            break;
    }
}

process.on('SIGINT', function()
{
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BUZZER, 0);
    console.log("Program Exit..");
    process.exit();
})

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_RISING, DetectButton);
gpio.softPwmCreate(BLUE, 0, 100);
gpio.softPwmCreate(RED, 0, 100);
gpio.softPwmCreate(GREEN, 0, 100);