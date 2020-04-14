const gpio = require("node-wiring-pi");
const RED = 29;
const BLUE = 28;
const GREEN = 27;

const LedAlloffHandler = function() {
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(GREEN, 0);

    console.log("All off");

    setTimeout(LedBlinkHandler, 1000);
}

const LedRedon = function() {
    gpio.digitalWrite(RED, 1);

    console.log("RED on");

    setTimeout(LedRedoff, 1000);
}

const LedRedoff = function() {
    gpio.digitalWrite(RED, 0);

    console.log("RED off");

    setTimeout(LedRedon, 1000);
}

const LedBlueon = function() {
    gpio.digitalWrite(BLUE, 1);
    
    console.log("BLUE on");

    setTimeout(LedBlueoff, 2000);
}

const LedBlueoff = function() {
    gpio.digitalWrite(BLUE, 0);

    console.log("BLUE off");

    setTimeout(LedBlueon, 2000);
}

const LedGreenon = function() {
    gpio.digitalWrite(GREEN, 1);

    console.log("GREEN on");

    setTimeout(LedGreenoff, 3000);
}

const LedGreenoff = function() {
    gpio.digitalWrite(GREEN, 0);

    console.log("GREEN off");

    setTimeout(LedGreenon, 3000);
}

const LedBlinkHandler = function() {
    setImmediate(LedRedon);
    setImmediate(LedBlueon);
    setImmediate(LedGreenon);
    setTimeout(LedAlloffHandler, 10000);
}

process.on('SIGINT', function(){
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(BLUE, 0);
    gpio.digitalWrite(GREEN, 0);
    console.log("Program Exit...");
    process.exit();
});

gpio.setup("wpi");
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
setImmediate(LedBlinkHandler);