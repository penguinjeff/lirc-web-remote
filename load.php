<?php
header('Content-Type: application/json');
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
if(isset($argv[1]))
{$version=$argv[1];
}
echo json_encode(json_decode(file_get_contents("data/saved-data-".$version.".json")),JSON_PRETTY_PRINT)."\n";
?>
