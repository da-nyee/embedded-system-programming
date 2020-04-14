const gpio = require('node-wiring-pi');
const DT = 25;
const CLK = 24;

var rotate = 0;     // 오른쪽으로 돌리면 +1, 왼쪽으로 돌리면 -1

const SenseRotate = function(){
    var checked = 0;

    // 왼쪽 핀(DT)가 먼저 접점이 떨어질 경우
    while(gpio.digitalRead(DT) == 0){
        if(checked == 0){
            rotate++;
            checked++;
            console.log(rotate);
        }
        while(gpio.digitalRead(CLK) == 0){}
    }
    
    while(gpio.digitalRead(CLK) == 0){
        if(checked == 0){
            rotate--;
            checked++;
            console.log(rotate);
        }
        while(gpio.digitalRead(DT) == 0){}
    }

    setTimeout(SenseRotate, 20);
}

process.on('SIGINT', function(){
    console.log("Program Exit...");
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(DT, gpio.INPUT);
gpio.pinMode(CLK, gpio.INPUT);
setImmediate(SenseRotate);