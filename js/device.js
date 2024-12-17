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
}}



function send_action(arg1,arg2,arg3,loop,remote,button)
{if(typeof(arg1)=='undefined'){arg1='list';}
 if(typeof(arg2)=='undefined'){arg2='';}
 if(typeof(arg3)=='undefined'){arg3='';}
 if(typeof(loop)=='undefined'){loop=false;}
//function getremotes() {
 var id = Math.round(+new Date()/1000);
 fetch('irsend.php?arg1='+arg1+'&arg2='+arg2+'&arg3='+arg3+'&id='+id)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(localdata => {
    // console.log(data); // Log the JSON response
    // Process the data
   if(loop)
   {
    if(eval(loop))
    {holdtimer=setTimeout(function(){ hold(remote,button); }, 10);
    }
    return
   }
   data['remote_index']=[];
   if(JSON.stringify(localdata['stderr'])!='["",""]')
   {alert(JSON.stringify(localdata['arg1']+' '+localdata['arg2']+' '+localdata['arg3']+' '+localdata['stderr']))
   }
   if(localdata['remotes'])
   {
    data['remotes']={'none':['none']};
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
    }

/*
var selectionselections={
'none':['none'],
'item1':['none','sub1item1','sub1item2','sub1item3'],
'item2':['none','sub2item1','sub2item2','sub2item3'],
'item3':['none','sub3item1','sub3item2','sub3item3']
}

//index to allow an integer to reference
var selections_index=Object.keys(selectionselections);

//function to create an object from a list where that list item becomes a key with its index being the value
//useful for converting the name to an index
function reverse_index(list)
{var myobject={};
 list.forEach((value, index) => myobject[value] = index);
 return myobject;
}

// to allow fast convertion of name to index number
var selections_reverse_index=reverse_index(selections_index);

// to allow fast convertion of name to index number
var selectionselections_reverse_index={}
selections_index.forEach((value,index) => selectionselections_reverse_index[value] = reverse_index(selectionselections[value]))
*/




   }
  })
  .catch(error => {});
}

var holdtimer;
var altholdtimer;
var held=false;
var mousedown=false;
function presshold(remote,button,item,event)
{if(!event['button'])
 {
  item.setAttribute('class','button_clicked')
//document.getElementById("Show").innerHTML='pressed '+remote+' '+button;
  mousedown=true;
  held=false;
  holdtimer=setTimeout(function(){ hold(remote,button); }, 500);
  navigator.vibrate(500);
  send_action('send_once',remote,button);
}}

function hold(remote,button)
{
 held=true;
// send_action('send_start',remote,button);
 send_action('send_once',remote,button,'held',remote,button);
}

function release(remote,button,item,event)
{if(!event['button'])
 {
  altholdtimer=setTimeout(function(){ delayed_release(item); }, 100);
//  alert('stop')
// console.log(event);
  clearTimeout(holdtimer);
  mousedown=false;
  if(held)
  {
   //send_action('send_stop',remote,button);
   held=false;
}}}

function delayed_release(item)
{
  item.setAttribute('class','button')
}


function Device_init()
{send_action();
}
window.onload=Device_init();
