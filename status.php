<?php
header('Content-Type: application/json');
$id='';
$json='{"status":"wait","errors":"false"}';
if(isset($argv[1]))
{$id=$argv[1];
}
if(isset($_REQUEST['id']))
{$id=$_REQUEST['id'];
}
if($id != '')
{
 $file="data/status-".$id.".json";
 if(file_exists($file))
 {$json=file_get_contents($file);
  unlink($file);
 }
}
echo $json;
//allows to test via command line
//example: php ./irsend.php list "" ""
?>
