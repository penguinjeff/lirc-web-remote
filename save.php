<?php
function sanatize($input)
{
 return preg_replace('/[^A-Za-z0-9_.\ \-\{\}\[\]\"\'\:\,]/', '', $input);
}
function version_sanatize($input)
{
 return preg_replace('/[^0-9.]/', '', $input);
}


$version="";
if(isset($_REQUEST['version']))
{$version=version_sanatize($_REQUEST['version']);
}
file_put_contents("data/saved-data-".$version.".json",json_encode(json_decode(sanatize(file_get_contents('php://input'),JSON_PRETTY_PRINT))));
?>
