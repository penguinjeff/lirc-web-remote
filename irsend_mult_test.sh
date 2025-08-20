curl 'http://127.0.0.1/lirc-web-remote/irsend_mult.php?'\
'json=\{%22ircodes%22:%5B%5B%22Logitech_Samsung%22,%22KEY_1%22,2000,2%5D%5D\}&id=1755042951'
sleep 2
curl 'http://127.0.0.1/lirc-web-remote/irsend_mult.php?json=\{%22ircodes%22:%5B%5D\}&id=1755042951'
