<?php
header('Content-Type: application/json');
//simple wrapper to allow not exposing another port to an outside network.
function irsend(&$response,$json)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "127.0.0.1:4444?json=$json");
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_VERBOSE, true); // Optional: for detailed output
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
        echo $response;
	if (curl_errno($ch)) {
		return false;
	} else {
		return true;
	}
	curl_close($ch);
}
if(isset($_REQUEST['json']))
{
irsend($response,$_REQUEST['json']);
}
//allows to test via command line
//example: php ./irsend.php list "" ""
if(isset($argv[1]))
{
irsend($response,$argv[1]);
}
?>
