const gpio = require('node-wiring-pi');
const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const LED = 22;
const BUZZER = 24;
const RED = 29;
const GREEN = 27;
const BLUE = 26;

var led, buzzer, r, g, b;
var timeout = 500;

const server = http.createServer(function(request, response){
    fs.readFile('views/web_ui.html', 'utf8', function(error, data){
    response.writeHead(200, {'Content-Type':'text/html'});
    response.end(data);
    });
}).listen(65001, function(){
    gpio.wiringPiSetup();
    gpio.pinMode(LED, gpio.OUTPUT);
    gpio.pinMode(BUZZER, gpio.OUTPUT);
    gpio.pinMode(RED, gpio.OUTPUT);
    gpio.pinMode(GREEN, gpio.OUTPUT);
    gpio.pinMode(BLUE, gpio.OUTPUT);
    gpio.digitalWrite(LED, 0);
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BLUE, 0);
    console.log("웹서버실행중(http://192.9.113.65:65001)");
});

const io = socketio.listen(server);
io.sockets.on('connection', function(socket){
    socket.on('oneLEDon', function(data){  // LED1 ON
        console.log("LED1 on");
        timeout = data;
        oneLEDon();
    });

    socket.on('oneLEDoff', function(data){
        console.log("LED1 off");
        oneLEDoff();
    });

    socket.on('BUZZERon', function(data){
        console.log("BUZZER on");
        timeout = data;
        BUZZERon();
    });

    socket.on('BUZZERoff', function(data){
        console.log("BUZZER off");
        BUZZERoff();
    });

    socket.on('REDon', function(data){
        console.log("RED on");
        timeout = data;
        REDon();
    });

    socket.on('REDoff', function(data){
        console.log("RED off");
        REDoff();
    });

    socket.on('GREENon', function(data){
        console.log("GREEN on");
        timeout = data;
        GREENon();
    });

    socket.on('GREENoff', function(data){
        console.log("GREEN off");
        GREENoff();
    });

    socket.on('BLUEon', function(data){
        console.log("BLUE on");
        timeout = data;
        BLUEon();
    });

    socket.on('BLUEoff', function(data){
        console.log("BLUE off");
        BLUEoff();
    });
});

const oneLEDon = () => {
    gpio.digitalWrite(LED, 1);
    led = setTimeout(oneLEDon, timeout);
}

const oneLEDoff = () => {
    gpio.digitalWrite(LED, 0);
    clearTimeout(led);
}

const BUZZERon = () => {
    gpio.digitalWrite(BUZZER, 1);
    buzzer = setTimeout(BUZZERon, timeout);
}

const BUZZERoff = () => {
    gpio.digitalWrite(BUZZER, 0);
    clearTimeout(buzzer);
}

const REDon = () => {
    gpio.digitalWrite(RED, 1);
    r = setTimeout(REDon, timeout);
}

const REDoff = () => {
    gpio.digitalWrite(RED, 0);
    clearTimeout(r);
}

const GREENon = () => {
    gpio.digitalWrite(GREEN, 1);
    g = setTimeout(GREENon, timeout);
}

const GREENoff = () => {
    gpio.digitalWrite(GREEN, 0);
    clearTimeout(g);
}

const BLUEon = () => {
    gpio.digitalWrite(BLUE, 1);
    b = setTimeout(BLUEon, timeout);
}

const BLUEoff = () => {
    gpio.digitalWrite(BLUE, 0);
    clearTimeout(b);
}

process.on('SIGINT', function(){
    gpio.digitalWrite(LED, 0);
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(BLUE, 0);
    process.exit();
});