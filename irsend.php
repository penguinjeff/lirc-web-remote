<?php
//simple wrapper to allow not exposing another port to an outside network.
function irsend(&$response,$arg1,$arg2,$arg3)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "127.0.0.1:4444?arg1=$arg1&arg2=$arg2&arg3=$arg3");
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
if((isset($_REQUEST['arg1']) &&  isset($_REQUEST['arg2']) && isset($_REQUEST['arg3'])))
{
irsend($response,$_REQUEST['arg1'],$_REQUEST['arg2'],$_REQUEST['arg3']);
}
//allows to test via command line
//example: php ./irsend.php list "" ""
if((isset($argv[1]) &&  isset($argv[2]) && isset($argv[3])))
{
irsend($response,$argv[1],$argv[2],$argv[3]);
}
?>
