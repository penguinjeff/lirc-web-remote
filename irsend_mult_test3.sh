id=$(curl --no-progress-meter  'http://127.0.0.1/lirc-web-remote/irsend_mult.php' --data-raw 'mode=macro&json=[["Logitech_Samsung","BADKEY",0,1]]')
echo -e "$id"
id=$(echo -e "$id"|head -n 1)
id="${id#[\"}"
id="${id%\"]}"
curl --no-progress-meter 'http://127.0.0.1/lirc-web-remote/irsend_mult.php' --data-raw "mode=status&json=[\"$id\"]"
