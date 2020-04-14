const http = require('http');
const gpio = require('node-wiring-pi');
const fs = require('fs');
const socketio = require('socket.io');
const LED = 27;
const TRIG = 29;
const ECHO = 28;
var startTime, travelTime; // 초음파 거리 계산용
var index = 0, value = []; // 측정거리 데이터 저장용
var timerid, timeout = 800; // 타이머 제어용
var cnt = 1; // 타이머 제어용

const server = http.createServer(function(request, response){
    fs.readFile('views/plotly_so.html', 'utf8', function(error, data){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data);
    });
}).listen(65001, function(){
    gpio.wiringPiSetup();
    gpio.pinMode(LED, gpio.OUTPUT);
    gpio.pinMode(TRIG, gpio.OUTPUT);
    gpio.pinMode(ECHO, gpio.INPUT);
    gpio.digitalWrite(LED, 0);
    console.log("Server running at http://192.9.113.65:65001");
});

const io = socketio.listen(server);

io.sockets.on('connection', function(socket){
    socket.on('startmsg', function(data){
        console.log("가동메시지 수신(측정주기:%d)!", data);
        timeout = data;
        watchon(); // 타이머 가동(초음파 가동)
    });

    socket.on('stopmsg', function(data){
        console.log("중지메시지 수신!");
        clearTimeout(timerid);
    });
});

const watchon = () => {
    gpio.digitalWrite(TRIG, gpio.LOW);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(TRIG, gpio.HIGH);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(TRIG, gpio.LOW);
    
    while(gpio.digitalRead(ECHO) == gpio.LOW);
    startTime = gpio.micros();
    
    while(gpio.digitalRead(ECHO) == gpio.HIGH);
    travelTime = gpio.micros() - startTime;

    distance = travelTime / 58;
    if(distance < 400) // 센서는 400cm(4m) 이내만 측정 가능
    {
        if(index < 500)
        {
            value[index++] = distance;
            console.log("근접거리: %dcm", value[index-1]);
            io.sockets.emit('watch', value[index-1]);
        }
        else
            index = 0;
        
        if((index % 2) == 0)
            gpio.digitalWrite(LED, 1);
        else
            gpio.digitalWrite(LED, 0);
    }
    timerid = setTimeout(watchon, timeout);
}