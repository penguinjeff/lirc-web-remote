<?php
$scale=1;
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
<script>
var mode='remote';
var data={};
function timestamp(){return Math.floor(Date.now()/1000);}

function changemode()
{
 document.getElementById("Display").innerHTML='';
 if(document.getElementById("mode").value==="Edit")
 {Edit.display();
 }
 else
 {mode='remote';
 }
 if(document.getElementById("mode").value==="Activities")
 {Activities.remotes();
 }
 if(document.getElementById("mode").value==="Devices")
 {Devices.remotes();
 }
}

window.addEventListener('load',function(){changemode();})
</script>
<?php
$javascript_files=scandir('./js/');
$time=time();
foreach($javascript_files as $js)
{if($js!='.'&&$js!='..')
 {print '<script class="code" src="js/'.$js.'?timestamp='.$time.'"></script>'."\n";
}}
?>
<link rel="stylesheet" href="css/remote_css.php?scale=<?php echo $scale; ?>&timestamp=<?php echo time()?>">
</head>
<body style="width:100%;height:100%">
<div class="container-1">
<div class="select_area">
<select id="mode" onchange="changemode()">
<option value="Activities">Activities</option>
<option value="Devices">Devices</option>
<option value="Edit">Edit</option>
</select>
<div id="choose"></div>
</div>
<div id="activity" class="activity">
</div>
</div>
<div id="Display"></div>
<div id="Show"></div>
</body>
</html>
