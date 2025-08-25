curl --data '{"id":1,"ircodes":[["list","","",""]]}' 127.0.0.1:4334
curl --data '{"id":2,"ircodes":[["restart","","",""]]}' 127.0.0.1:4334
curl --data '{"id":3,"ircodes":[["remote","ircode",2000,1]]}' 127.0.0.1:4334
curl --data '{"id":4,"ircodes":[["remote","ircode1",0,1],["remote","ircode2",0,1]]}' 127.0.0.1:4334
curl --data '{"id":5,"ircodes":[["remote","ircode1",0,1],["remote","ircode2",0,1],["remote","ircode3",0,1]]}' 127.0.0.1:4334
curl --data '{"id":6,"ircodes":[["remote","ircode",0,1]]' 127.0.0.1:4334
curl --data '{"id":7,"ircodes":[["remote","ircode",0,1]}' 127.0.0.1:4334
curl --data 'json={"id":8,"ircodes":[["remote","ircode",0,1]]}' http://127.0.0.1/lirc-web-remote/irsend_post.php
