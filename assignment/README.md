## mycontrol.js
### Sensors
- a button, light, touch
### Actuators
- a buzzer, LEDs, a relay
### Development Requirements
1. touch 센서에 터치할 때마다 1색 LED가 0.2초 동안 켜지고 꺼진다.
2. button을 첫번째 누르면 buzzer 소리가 0.1초 동안 나면서 3색 LEDs가 모두 켜진다.
3. button을 두번째 누르면 buzzer 소리가 0.1초 동안 나면서 3색 LEDs가 모두 꺼진다.
4. 3색 LEDs가 모두 켜져있을 때만 light 센서가 빛을 센싱할 수 있다.
5. light 센서에 '밝음→어두움' 변화가 측정되면 relay를 제어하여 전류를 흐르게 한다.
6. light 센서에 '어두움→밝음' 변화가 측정되면 relay를 제어하여 전류를 차단시킨다.
7. 무한반복 실행되며, ctrl+c를 누르면 buzzer, LEDs, relay가 모두 꺼진 후 프로그램이 종료된다.