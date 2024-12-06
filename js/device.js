var Devices=new Selector('Device');
Devices.final();

function Device(datain)
{if(typeof(datain)=='undefined')
 {datain={};
  datain['name']='Edit';
  datain['buttons']=[];
 }
 this.data=datain;
 if(!this.data['display']){this.data['display']='Default';}
 if(!this.data['catchallgrid']){this.data['catchallgrid']=['2','2'];}
 this.data['buttons'].sort();
 this.data['id']=Devices.items();
 Devices.add(this);
}

Device.prototype.save=function(){return JSON.parse(JSON.stringify(this.data));}

Device.prototype.getset=function(item,newvalue)
{if(typeof(newvalue)!='undefined')
 {this.data[item]=newvalue;
  if(!newvalue)
  {delete this.data[item];
 }}
 if(this.data[item])
 {return this.data[item];
 }
 else
 {return false;
}}

Device.prototype.addRemote=function()
{
}

Device.prototype.addButton=function()
{
}

Device.prototype.edit=function()
{var html="Device Edit";
 var hidemsg='Hide';
 if(this.getset('hidden')){hidemsg='Unhide';}
 html='<input type="button" value="'+hidemsg+'" onclick="Devices.item('+this.data['id']+').getset(\'hidden\','+(!this.getset('hidden'))+');Devices.item('+this.data['id']+').edit()">'
 document.getElementById('EditSubItemDisplay').innerHTML=html;
}

function list_remove(list,item)
{var x;
 var retlist=[];
 for(x=0;x<list.length;x++)
 {if(list[x]!=item)
  {retlist.push(list[x]);
 }}
 return retlist;
}

Device.prototype.display=function()
{var html="Device "+this.data['name'];
 var x,y;
 Displays.item(this.data['display']).display();
 var modules=Modules.bestfit(this.data['buttons']);
 if(document.getElementsByName('module_Name'))
 {for(x=0;x<document.getElementsByName('module_Name').length;x++)
  {document.getElementsByName('module_Name')[x].innerHTML=html;
 }}
 var modulebuttons;
 var devicebuttons=JSON.parse(JSON.stringify(this.data['buttons']))
// alert(JSON.stringify(devicebuttons))
 for(x=0;x<modules.length;x++)
 {modulebuttons=Modules.item(modules[x]).buttons();
  for(y=0;y<modulebuttons.length;y++)
  {devicebuttons=list_remove(devicebuttons,modulebuttons[y])
  }
  Modules.item(modules[x]).display(this.data['name']);
 }
 CatchAll(this.data['name'],devicebuttons,3,5);
}


var getdata={};
    getdata['remotes']={}
var remote_index=[];
function send_action(arg1,arg2,arg3)
{if(typeof(arg1)=='undefined'){arg1='list';}
 if(typeof(arg2)=='undefined'){arg2='';}
 if(typeof(arg3)=='undefined'){arg3='';}
//function getremotes() {
 var id = Math.round(+new Date()/1000);
 fetch('irsend.php?arg1='+arg1+'&arg2='+arg2+'&arg3='+arg3+'&id='+id)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    // console.log(data); // Log the JSON response
    // Process the data
   remote_index=[];
   if(JSON.stringify(data['stderr'])!='["",""]')
   {alert(JSON.stringify(data['arg1']+' '+data['arg2']+' '+data['arg3']+' '+data['stderr']))
   }
   if(data['remotes'])
   {
    for(key in data['remotes']){remote_index.push(key);}
    var x;
    for(x=0;x<remote_index.length;x++)
    {if(!getdata['remotes'][remote_index[x]])
     {getdata['remotes'][remote_index[x]]=data['remotes'][remote_index[x]];
      new Device({'name':remote_index[x],'buttons':getdata["remotes"][remote_index[x]]})
    }}

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


function Device_init()
{send_action();
}
window.onload=Device_init();
