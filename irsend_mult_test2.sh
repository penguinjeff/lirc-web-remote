id=$(curl --no-progress-meter 'http://127.0.0.1/lirc-web-remote/irsend_mult.php' --data-raw 'mode=macro&json=[["Logitech_Samsung","KEY_VOLUMEDOWN",5000,1]]')
echo -e "$id"
id=$(echo -e "$id" | head -n 1)
id="${id#[\"}"
id="${id%\"]}"
echo "$id"
curl --no-progress-meter 'http://127.0.0.1/lirc-web-remote/irsend_mult.php' --data-raw "mode=status&json=[\"$id\"]"
sleep 7
curl --no-progress-meter 'http://127.0.0.1/lirc-web-remote/irsend_mult.php' --data-raw "mode=status&json=[\"$id\"]"
