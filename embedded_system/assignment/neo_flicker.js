const gpio = require('node-wiring-pi');
const ws281x = require('@bartando/rpi-ws281x-neopixel');
const NUM_LEDS = 16;

ws281x.init({
    count:NUM_LEDS,
    stripType:ws281x.WS2811_STRIP_GRB
});
ws281x.setBrightness(15);

const waitTime = 500; // 0.5sec
var offset = 0;

const LEDon = function(color, max) {
    for(let i = 0; i < max; i++) {
        ws281x.setPixelColor(i, color);
        ws281x.show();
    }
}

const ODDon = function(color, max) {
    for(let i = 0; i < max; i += 2) {
        ws281x.setPixelColor(i, color);
        ws281x.setPixelColor(i+1, {r:0, g:0, b:0});
        ws281x.show();
    }
}

const EVENon = function(color, max) {
    for(let i = 0; i < max; i += 2) {
        ws281x.setPixelColor(i, {r:0, g:0, b:0});
        ws281x.setPixelColor(i+1, color);
        ws281x.show();
    }
}

process.on('SIGINT', function() {
    ws281x.reset();
    process.exit();
});

setInterval(() => {
    if(offset == 0) {
        LEDon({r:40, g:0, b:0}, 4);
        gpio.delay(15);
        LEDon({r:100, g:0, b:0}, 8);
        gpio.delay(15);
        LEDon({r:180, g:0, b:0}, 12);
        gpio.delay(15);
        LEDon({r:255, g:0, b:0}, 16);
        
        offset = 1;
        console.log("RED ON");
    }
    else if(offset == 1) {
        LEDon({r:0, g:40, b:0}, 4);
        gpio.delay(15);
        LEDon({r:0, g:100, b:0}, 8);
        gpio.delay(15);
        LEDon({r:0, g:180, b:0}, 12);
        gpio.delay(15);
        LEDon({r:0, g:255, b:0}, 16);

        offset = 2;
        console.log("GREEN ON");
    }
    else if(offset == 2) {
        LEDon({r:0, g:0, b:40}, 4);
        gpio.delay(15);
        LEDon({r:0, g:0, b:100}, 8);
        gpio.delay(15);
        LEDon({r:0, g:0, b:180}, 12);
        gpio.delay(15);
        LEDon({r:0, g:0, b:255}, 16);

        offset = 3;
        console.log("BLUE ON");
    }
    else if(offset == 3) {
        LEDon({r:40, g:40, b:0}, 4);
        gpio.delay(15);
        LEDon({r:100, g:100, b:0}, 8);
        gpio.delay(15);
        LEDon({r:180, g:180, b:0}, 12);
        gpio.delay(15);
        LEDon({r:255, g:255, b:0}, 16);

        offset = 4;
        console.log("YELLOW ON");
    }
    else if(offset == 4) {
        LEDon({r:40, g:0, b:40}, 4);
        gpio.delay(15);
        LEDon({r:100, g:0, b:100}, 8);
        gpio.delay(15);
        LEDon({r:180, g:0, b:180}, 12);
        gpio.delay(15);
        LEDon({r:255, g:0, b:255}, 16);

        offset = 5;
        console.log("PURPLE ON");
    }
    else if(offset == 5) {
        for(let i = 0; i < 10; i++) {
            ODDon({r:255, g:255, b:255}, 16);
            gpio.delay(25);
            EVENon({r:255, g:255, b:255}, 16);
            gpio.delay(25);    
        }

        offset = 6;
        console.log("WHITE ON");
    }
    else {
        LEDon({r:0, g:0, b: 0}, 16);

        offset = 0;
        console.log("ALL OFF");
    }
}, waitTime);