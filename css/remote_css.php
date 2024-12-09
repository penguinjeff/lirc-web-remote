<?php header("Content-type: text/css");
$w=250; $sw=50; $mw=150; $scale=1;
if(isset($_REQUEST['scale']))
{$scale=$_REQUEST['scale'];
}

if(isset($argv[1]))
{$scale=$argv[1];
}

?>
.container{display:flex;flex-direction:column;justify-content:space-around;}
.container-1{display:flex;flex-direction:row;justify-content:left;}
.container-2{display:flex;flex-direction:row;justify-content:space-around;}
.item{}
.remotename{width:<?php echo $w*$scale; ?>px;background-color:#A7A7A7}
.power{width:<?php echo $w*$scale; ?>px;background-color:#A7A7A7}
.catchall{width:<?php echo $w*$scale; ?>px;background-color:#979797}
.common{width:<?php echo $w*$scale; ?>px;background-color:#878787}
.colors{width:<?php echo $w*$scale; ?>px;background-color:#979797}
.volume{width:<?php echo $sw*$scale; ?>px;background-color:#A7A7A7}
.directions{width:<?php echo $mw*$scale; ?>px;background-color:#878787}
.channels{width:<?php echo $sw*$scale; ?>px;background-color:#A7A7A7}
.navigator{width:<?php echo $mw*$scale; ?>px;background-color:#979797}
.navigatorpads{width:<?php echo $sw*$scale; ?>px;background-color:#979797}
.numbers{width:<?php echo $mw*$scale; ?>px;background-color:#878787}
.numberpads{width:<?php echo $sw*$scale; ?>px;background-color:#878787}
.empty{height:<?php echo 30*$scale; ?>px;width:<?php echo 33*$scale ?>px;}
.button
{background-color:#888888;
 width:<?php echo 30*$scale; ?>px;
 height:<?php echo 25*$scale; ?>px;
 border-style:solid;
 border-radius:<?php echo 5*$scale; ?>px;
 text-align:center;
 font-size:<?php echo 10*$scale; ?>px;
 margin-top: <?php echo 4*$scale; ?>px;
 margin-right; <?php echo 4*$scale; ?>px;
 margin-bottom: <?php echo 4*$scale; ?>px;
 margin-left: <?php 4*$scale; ?>px;
}
.button_clicked
{background-color:#666666;
 width:<?php echo 30*$scale; ?>px;
 height:<?php echo 25*$scale; ?>px;
 border-style:solid;
 border-radius:<?php echo 5*$scale; ?>px;
 text-align:center;
 font-size:<?php echo 10*$scale; ?>px;
 margin-top: <?php echo 4*$scale; ?>px;}
 margin-right; <?php echo 4*$scale; ?>px;
 margin-bottom: <?php echo 4*$scale; ?>px;
 margin-left: <?php 4*$scale; ?>px;
}
