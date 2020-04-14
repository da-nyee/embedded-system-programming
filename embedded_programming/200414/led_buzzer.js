const gpio = require("node-wiring-pi");
const BUZZER = 29;
const LED = 24;

const TurnOnLed = function() {
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(LED, 1);
    console.log("Nodejs: LED on, BUZZER off");
    setTimeout(TurnOnBuzzer, 1000);
}

const TurnOnBuzzer = function() {
    gpio.digitalWrite(LED, 0);
    gpio.digitalWrite(BUZZER, 1);
    console.log("Nodejs: LED off, BUZZER on");
    setTimeout(TurnOnLed, 100);
}

process.on('SIGINT', function() {
    gpio.digitalWrite(LED, 0);
    gpio.digitalWrite(BUZZER, 0);
    console.log("Program Exit...");
    process.exit();
});

gpio.setup("wpi");
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(LED, gpio.OUTPUT);
setTimeout(TurnOnLed, 100);