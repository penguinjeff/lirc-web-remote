<?php
header('Content-Type: application/json');
ignore_user_abort(1);
set_time_limit(0);
//simple wrapper to allow not exposing another port to an outside network.
function irsend(&$response,$mode,$extra="")
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "127.0.0.1:4343?mode=$mode$extra");
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
if(isset($_REQUEST['mode']))
{
	$idstring="";
	$macrostring="";
	if (isset($_REQUEST['id'])){$idstring="&id=$_REQUEST['id']";}
	if (isset($_REQUEST['json'])){$macrostring="&json=$_REQUEST['json']";}
	irsend($response,$_REQUEST['mode'],"$idstring$macrostring");
}
//allows to test via command line
//example: php ./irsend.php list "" ""
if(isset($argv[1]))
{
	extra=""
	if(isset($argv[2])){$extra="&$argv[2]";}
	if(isset($argv[3])){$extra.="&$argv[2]";}
	irsend($response,$argv[1],$extra);
}
?>
