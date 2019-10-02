const gpio = require('node-wiring-pi');
const BUTTON = 24;
const LIGHT = 23;
const TOUCH = 22;
const LED = 21;
const BLUE = 29;
const RED = 28;
const GREEN = 27;
const BUZZER = 26;
const RELAY = 25;
var count = 0;

const TurnOnOneLED = function()
{
    gpio.digitalWrite(LED, 1);
}

const TurnOffOneLED = function()
{
    gpio.digitalWrite(LED, 0);
}

const TurnOnBuzzer = function()
{
    gpio.digitalWrite(BUZZER, 1);
}

const TurnOffBuzzer = function()
{
    gpio.digitalWrite(BUZZER, 0);
}

const TurnOnLEDs = function()
{
    gpio.digitalWrite(BLUE, 1);
    gpio.digitalWrite(RED, 1);
    gpio.digitalWrite(GREEN, 1);
    CheckLight();
}

const TurnOffLEDs = function()
{
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
}

const CheckLight = function()
{
    var light = gpio.digitalRead(LIGHT);
    if(!light)
    {
        console.log("Nodejs: Bright! RELAY off");
        gpio.digitalWrite(RELAY, gpio.LOW);
    }
    else
    {
        console.log("Nodejs: Dark.. RELAY on");
        gpio.digitalWrite(RELAY, gpio.HIGH);
    }

    if(BLUE == 1 && RED == 1 && GREEN == 1)
        setTimeout(CheckLight, 300);
}

const MyControl = function()
{
    var touch = gpio.digitalRead(TOUCH);
    if(touch)
    {
        console.log("Nodejs: Touched! One LED on");
        TurnOnOneLED();
        setTimeout(TurnOffOneLED, 200);
    }

    let button = gpio.digitalRead(BUTTON);
    if(!button)
    {
        switch(count % 2)
        {
            case 0: console.log("First Pressed!");
                    TurnOnBuzzer();
                    setTimeout(TurnOffBuzzer, 100);
                    TurnOnLEDs();
                    break;
            case 1: console.log("Second Pressed!");
                    TurnOnBuzzer();
                    setTimeout(TurnOffBuzzer, 100);
                    TurnOffLEDs();
                    break;
            default: break;
        }
        count++;
    }
    
    setTimeout(MyControl, 500);
}

process.on('SIGINT', function()
{
    gpio.digitalWrite(LED, 0);
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(RELAY, 0);
    console.log("Program Exit..");
    process.exit();
})

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(LIGHT, gpio.INPUT);
gpio.pinMode(TOUCH, gpio.INPUT);
gpio.pinMode(LED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(RELAY, gpio.OUTPUT);
setImmediate(MyControl);