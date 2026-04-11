
//////////////////////////////////////////////





let held=false;
let lolding=false;
let mousedown=false;
let holdtimer=0;

function presshold(remote,button,item,event)
{
 function hold(remote,button)
 {
  if(holding)
  {
   held=true
   // loop an unreasonable amount of times 1000 is unreasonable and should be cut off long before reached
   execute('macro',[[remote,button,0,1000]])
   console.log("remote:"+remote+" button:"+button);
  }
 }
 console.log(remote+"+"+button);
 item.setAttribute('class','button_clicked')
 mousedown=true;
 holding=true;
 held=false;
 holdtimer=setTimeout(function(){hold(remote,button); }, 700);
 navigator.vibrate(700);
 console.log("remote:"+remote+" button:"+button);
 execute('macro',[[remote,button,0,1]])
}


let altholdtimer=0;
function release(remote,button,item,event)
{
 function delayed_release(item)
 {item.setAttribute('class','button')
 }
 if(event && !event['button'])
 {
   holding=false;
   clearTimeout(this.holdtimer);
   if(held){execute('stop',[]);}
   altholdtimer=setTimeout(function(){ delayed_release(item); }, 100);
   mousedown=false;
   held=false;
 }
}


