const ws281x = require('@bartando/rpi-ws281x-neopixel');
const NUM_LEDS = 16;

ws281x.init({
    count:NUM_LEDS,
    stripType:ws281x.WS2811_STRIP_GRB
});
ws281x.setBrightness(5);

const waitTime = 3000; // 3secs
var offset = 0;

const LEDon = function(color, max) {
    for(let i = 0; i < max; i++) {
        ws281x.setPixelColor(i, color);
        ws281x.show();
    }
}

process.on('SIGINT', function() {
    ws281x.reset();
    process.exit();
});

setInterval(() => {
    if(offset == 0) {
        LEDon({r:255, g:255, b:255}, 5);
        offset = 1;
        console.log("LED ON");
    }
    else {
        LEDon({r:0, g:0, b:0}, 5);
        offset = 0;
        console.log("LED OFF");
    }
}, waitTime);