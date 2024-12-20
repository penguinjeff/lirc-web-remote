var Devices=
{
 display()
 {alert('displays edit mode')
 },
 remotes()
 {var into
  into=document.getElementById('choose');
  into.innerHTML='';
  into.appendChild(createElement(
  {'options':Object.keys(data['remotes']),
   'onchange':'Devices.select(this)',
   'namevalues':true
  }));
  into=document.getElementById('Display')
  into.appendChild(createElement(
  {'tag':'div',
   'class':'container',
   'id':'remote'
  }));
 },
 select(item)
 {if(item.value!='none')
  {Modules.display(item.value)
  }
  else
  {document.getElementById('remote').innerHTML='';
 }},
 save()
 {alert('Saving Devices')
 },
 send_action(arg1,arg2,arg3,loop,remote,button)
 {if(typeof(arg1)=='undefined'){arg1='list';}
  if(typeof(arg2)=='undefined'){arg2='';}
  if(typeof(arg3)=='undefined'){arg3='';}
  if(typeof(loop)=='undefined'){loop=false;}
  //function getremotes() {
  var id = Math.round(+new Date()/1000);
  fetch('irsend.php?arg1='+arg1+'&arg2='+arg2+'&arg3='+arg3+'&id='+id)
  .then(response =>
  {if (!response.ok)
   {throw new Error("Network response was not ok");
   }
   return response.json();
  })
  .then(localdata =>
  {if(loop)
   {if(eval(loop))
    {holdtimer=setTimeout(function(){ hold(remote,button); }, 10);
    }
    return
   }
   data['remote_index']=[];
   if(JSON.stringify(localdata['stderr'])!='["",""]')
   {alert(JSON.stringify(localdata['arg1']+' '+localdata['arg2']+' '+localdata['arg3']+' '+localdata['stderr']))
   }
   if(localdata['remotes'])
   {data['remotes']={'none':['none']};
    var remotes_index=Object.keys(localdata['remotes'])
    for(var x=0;x<remotes_index.length;x++)
    {data['remotes'][remotes_index[x]]=localdata['remotes'][remotes_index[x]];
    }
    data['remote_index']=Object.keys(data['remotes']);
    data['remote_reverse_index']=reverse_index(data['remote_index'])
    data['remotes_index']={}
    data['remotes_reverse_index']={};
    for(var x=0;x<data['remote_index'].length;x++)
    {data['remotes_reverse_index'][data['remote_index'][x]]=reverse_index(data['remotes'][data['remote_index'][x]]);
   }}
  })
  .catch(error => {});
 },

 presshold(remote,button,item,event)
 {if(!event['button'])
  {
   item.setAttribute('class','button_clicked')
 //document.getElementById("Show").innerHTML='pressed '+remote+' '+button;
   mousedown=true;
   held=false;
   holdtimer=setTimeout(function(){ hold(remote,button); }, 500);
   navigator.vibrate(500);
   this.send_action('send_once',remote,button);
 }},

 hold(remote,button)
 {
  held=true;
 // send_action('send_start',remote,button);
  this.send_action('send_once',remote,button,'held',remote,button);
 },


 release(remote,button,item,event)
 {if(!event['button'])
  {altholdtimer=setTimeout(function(){ this.delayed_release(item); }, 100);
 //  alert('stop')
 // console.log(event);
   clearTimeout(holdtimer);
   mousedown=false;
   if(held)
   {
    //send_action('send_stop',remote,button);
    held=false;
 }}},
 delayed_release(item)
 {item.setAttribute('class','button')
 }

}




var holdtimer;
var altholdtimer;
var held=false;
var mousedown=false;





function Device_init()
{Devices.send_action();
}
window.onload=Device_init();
