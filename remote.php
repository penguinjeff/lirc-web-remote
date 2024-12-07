<?php
$scale=1.4;
if(isset($_REQUEST['scale']))
{$scale=$_REQUEST['scale'];
}
if(isset($argv[1]))
{$scale=$argv[1];
}
?>
<!DOCTYPE html>
<html style="width:100%;height:100%">
<head>
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<?php
$javascript_files=scandir('./js/');
$time=time();
foreach($javascript_files as $js)
{if($js!='.'&&$js!='..')
 {print '<script class="code" src="js/'.$js.'?timestamp='.$time.'"></script>'."\n";
}}
?>
<script>
var mode='remote';

function timestamp(){return Math.floor(Date.now()/1000);}

function changemode()
{document.getElementById("Display").innerHTML='';
 if(document.getElementById("mode").value==="Edit")
 {Edit.display({'display':'EditDisplay','showall':true});
 }
 else
 {mode='remote';
 }
 if(document.getElementById("mode").value==="Activities")
 {Activities.select();
 }
 if(document.getElementById("mode").value==="Devices")
 {Devices.select();
}}

window.addEventListener('load',function(){changemode();})
</script>
<link rel="stylesheet" href="css/remote_css.php?scale=<?php echo $scale; ?>&timestamp=<?php echo time()?>">
</head>
<body style="width:100%;height:100%">
<select id="mode" onchange="changemode()">
<option value="Activities">Activities</option>
<option value="Devices">Devices</option>
<option value="Edit">Edit</option>
</select>
<div id="Display"></div>
<div id="Show"></div>
</body>
</html>
