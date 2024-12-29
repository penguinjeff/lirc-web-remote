<?php
header('Content-Type: application/json');
ignore_user_abort(1);
set_time_limit(0);
//simple wrapper to allow not exposing another port to an outside network.
function irsend(&$response,$json)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "127.0.0.1:4343?json=$json");
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_VERBOSE, true); // Optional: for detailed output
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
        if(isset($_REQUEST['id']))
        {
         file_put_contents("data/status-".$_REQUEST['id'].".json",$response);
        }
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
