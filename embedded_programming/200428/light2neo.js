const fs = require("fs");
const http = require("http");
const gpio = require("node-wiring-pi");
const socketio = require("socket.io");
const mcpadc = require("mcp-spi-adc");
const ws281x = require("@bartando/rpi-ws281x-neopixel");

const CS_MCP3208 = 10;
const SPI_SPEED = 1000000;
const LIGHT = 0;
const NUM_LEDS = 12;

var timerid, timeout = 800;
var lightdata = -1;

ws281x.init({
    count: NUM_LEDS,
    stripType: ws281x.WS2811_STRIP_GRB
});
ws281x.setBrightness(5);

const Light = mcpadc.openMcp3208(
    LIGHT,
    { speedHz: SPI_SPEED },
    (err) => {
        console.log("SPI 채널0 초기화 완료!");
        
        if(err) {
            console.log("SPI 채널0 초기화 실패! (HW 점검!)");
        }
    }
);

const AnalogLight = () => {
    Light.read((error, reading) => {
        console.log("▲ ▼ (%d)", reading.rawValue);
        lightdata = reading.rawValue;
    });

    if(lightdata != -1) {
        io.sockets.emit('watch', lightdata);

        if(lightdata > 2200) {          // 어두운 경우
            LEDtime(NUM_LEDS);
        }
        else if(lightdata < 1000) {     // 매우 밝은 경우
            LEDtime(2);
        }
        else {                          // 밝은 경우
            LEDtime(NUM_LEDS/2);
        }
        timerid = setTimeout(AnalogLight, timeout);
    }
}

process.on('SIGINT', () => {
    Light.close(() => {
        console.log("MCP-ADC가 해제되어 웹서버를 종료합니다.");
        ws281x.reset();
        process.exit();
    });
});

// 웹브라우저에서 접속할 경우, 해당 페이지를 읽어 전송함
const serverbody = (request, response) => {
    fs.readFile("./views/plotly_light.html", "utf8", (err, data) => {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(data);
    });
};

const LEDon = (color, max) => {
    for(let i = 0; i < max; i++) {
        ws281x.setPixelColor(i, color);
        ws281x.show();
        gpio.delay(1);
    }
}

const LEDtime = (max) => {
    LEDon({ r:180, g:0, b:0 }, max);

    for(let i = 0; i < max; i++) {
        ws281x.setPixelColor(i, { r:0, g:0, b: 0 });
        ws281x.show();
        gpio.delay(200);
    }
}

const server = http.createServer(serverbody);
const io = socketio.listen(server);
io.sockets.on("connection", (socket) => {
    socket.on("startmsg", (data) => {
        console.log("가동메세지 수신(측정주기: %d)!", data);
        timeout = data;
        AnalogLight();
    });

    socket.on("stopmsg", (data) => {
        console.log("중지메세지 수신!");
        clearTimeout(timerid);
    });
});

server.listen(65001, () => {
    gpio.wiringPiSetup();
    gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
    console.log("--------------------------------------");
    console.log("아날로그 조도센서 측정 및 실시간 모니터링 웹서버");
    console.log("웹브라우저 접속주소: http://192.168.35.24:65001/");
    console.log("--------------------------------------");
});