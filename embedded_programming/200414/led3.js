const gpio = require("node-wiring-pi");
const BLUE = 29;
const RED = 28;
const GREEN = 27;
var count = 0;

const TimeOutHandler = function(){
    switch(count % 4){
        case 0: gpio.digitalWrite(RED, 1);
                console.log("Node: RED on");
                break;
        case 1: gpio.digitalWrite(RED, 0);
                gpio.digitalWrite(GREEN, 1);
                console.log("Node: GREEN on");
                break;
        case 2: gpio.digitalWrite(GREEN, 0);
                gpio.digitalWrite(BLUE, 1);
                console.log("Node: BLUE on");
                break;
        case 3: gpio.digitalWrite(RED, 0);
                gpio.digitalWrite(GREEN, 0);
                gpio.digitalWrite(BLUE, 0);
                console.log("Node: All off");
                break;
        default: break;
    }
    count++;
    setTimeout(TimeOutHandler, 1000);
}

gpio.setup("wpi");
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
setImmediate(TimeOutHandler);