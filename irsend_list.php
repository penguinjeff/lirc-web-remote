<?php
header('Content-Type: application/json');
ignore_user_abort(1);
set_time_limit(0);
//simple wrapper to allow not exposing another port to an outside network.
function irsend_list()
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "127.0.0.1:3434");
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_VERBOSE, true); // Optional: for detailed output
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_exec($ch);
	curl_close($ch);
}
irsend_list();
?>
