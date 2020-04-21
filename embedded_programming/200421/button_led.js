const gpio = require("node-wiring-pi");
const BUTTON = 29;
const RED = 28;
const BLUE = 25;
var count = 0;

const DetectButton = function() {
    console.log("Pressed! " + count);

    if((count++ % 2) == 0) {
        gpio.digitalWrite(RED, 1);
        gpio.digitalWrite(BLUE, 0);
    }
    else {
        gpio.digitalWrite(RED, 0);
        gpio.digitalWrite(BLUE, 1);
    }
}

process.on('SIGINT', function() {
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(BLUE, 0);
    console.log("프로그램이 종료됩니다...");
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
console.log("버튼(첫번째: 빨강, 두번째: 파랑)");
gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_FALLING, DetectButton);