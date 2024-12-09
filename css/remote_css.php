<?php header("Content-type: text/css");


$w=250; $sw=50; $mw=150; $scale=1;
if(isset($_REQUEST['scale']))
{$scale=$_REQUEST['scale'];
}

if(isset($argv[1]))
{$scale=$argv[1];
}
if($scale==''){$scale=1;}

$output=file_get_contents('remote.css');
print preg_replace_callback('/([0-9]*px)/',function($matches){global $scale;return $scale*(int)substr($matches[0],0,-2).'px';},$output);
//print $scale."\n";
//print $output;
?>
