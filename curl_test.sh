curl 'http://192.168.0.7/lirc-web-remote/irsend_mult.php?json=\{%22ircodes%22:%5B%5B%22Logitech_Samsung%22,%22KEY_POWERON%22,0,1000%5D%5D\}&id=1755042951'
sleep 2
curl 'http://192.168.0.7/lirc-web-remote/irsend_mult.php?json=\{%22ircodes%22:%5B%5D\}&id=1755042951'
