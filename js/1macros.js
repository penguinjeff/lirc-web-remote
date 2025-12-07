var Macros=
{
 holdtimer:0,
 display(macro)
 {if(typeof(macro)=='undefined')
  {var into=document.getElementById('EditDisplay')
   var box=createElement(
   {'tag':'div',
    'id':'Edit'
   });
   box.appendChild(createElement(
   {'tag':'button',
    'onclick':'Macros.add()',
    'innerHTML':'Add Macro'
   }));
   box.appendChild(createElement(
   {'tag':'div',
    'id':'macrolist'
   }));
   into.appendChild(box);
   this.update_list()
  }
 },

//################# Update list ##################

 update_list(item)
 {
  document.getElementById('macrolist').innerHTML=''
  if(data['macros'])
  {if(data['macros'].length)
   {var temp=[];
    if(typeof(item)=='undefined'){item=0;}
    for(var x=0;x<data['macros'].length;x++)
    {temp.push(data['macros'][x]['name'])
    }
    document.getElementById('macrolist').appendChild(createElement(
    {'select':temp,
     'onchange':'Macros.edit(this.value)',
     'value':item
    }));
   }
   if(typeof(item)=='undefined'){item=-1;}
   this.edit(item);
  }
 },

// ####################### Add Ircode ###############################
 add_ircode(item,sub_item)
 {var remote_index=0;
  var ircode_index=0;
  var delay=0;
  var loops=1;
  var remote;
  var ircode;
  var event=true;
  var into=document.getElementById('ircodes');
  if(!data['macros'][item]['ircodes'])
  {data['macros'][item]['ircodes']=[];
  }
  if(sub_item==-1)
  {remote=data['remote_index'][remote_index];
   ircode=data['remotes'][remote][ircode_index];
   sub_item=data['macros'][item]['ircodes'].length;
   data['macros'][item]['ircodes'].push([remote,ircode,delay,loops]);
  }
  else
  {remote=data['macros'][item]['ircodes'][sub_item][0];
   ircode=data['macros'][item]['ircodes'][sub_item][1];
   delay=data['macros'][item]['ircodes'][sub_item][2];
   loops=data['macros'][item]['ircodes'][sub_item][3];
   remote_index=data['remote_reverse_index'][remote];
   ircode_index=data['remotes_reverse_index'][remote][ircode];
   event=false;
  }
  var intermediate_handle;
  var intermediate_attributes={'tag':'div','class':'lefty'};
  var remote_handle;
  var box=createElement(
  {'tag':'div',
   'name':sub_item
  });
  if(data['remote_index'].length==0)
  {alert('remote_index is empty')
  }
  remote_handle=createElement(
  {'select':data['remote_index'],
   'name':'remote',
   'id':'remote-'+sub_item,
   'onchange':'Macros.update('+item+',this,event)',
   'value':remote_index
  });
  intermediate_handle=createElement(intermediate_attributes);
  intermediate_handle.appendChild(createElement(
  {'tag':'label',
   'for':'remote-'+sub_item,
   'innerHTML':'Remote'
  }));
  intermediate_handle.appendChild(remote_handle);
  box.appendChild(intermediate_handle);
  intermediate_handle=createElement(intermediate_attributes);
  intermediate_handle.appendChild(createElement(
  {'tag':'label',
   'for':'ircode-'+sub_item,
   'innerHTML':'IR Code'
  }));
  intermediate_handle.appendChild(createElement(
  {'tag':'div',
   'id':'ircode_parent-'+sub_item,
   'name':'ircode_parent'
  }));
  box.appendChild(intermediate_handle);
  intermediate_handle=createElement(intermediate_attributes);
  intermediate_handle.appendChild(createElement(
  {'tag':'label',
   'for':'delay-'+sub_item,
   'innerHTML':'Delay'
  }));
  intermediate_handle.appendChild(createElement(
  {'tag':'input',
   'name':'delay',
   'id':'delay-'+sub_item,
   'type':'number',
   'min':0,
   'max':30000,
   'value':delay,
   'onchange':'Macros.update('+item+',this,event)'
  }));
  box.appendChild(intermediate_handle);
  intermediate_handle=createElement(intermediate_attributes);
  intermediate_handle.appendChild(createElement(
  {'tag':'label',
   'for':'loops-'+sub_item,
   'innerHTML':'Loops'
  }));
  intermediate_handle.appendChild(createElement(
  {'tag':'input',
   'name':'loops',
   'id':'loops-'+sub_item,
   'type':'number',
   'min':0,
   'max':1000,
   'value':loops,
   'onchange':'Macros.update('+item+',this,event)'
  }));
  box.appendChild(intermediate_handle);
  intermediate_handle=createElement({'tag':'div'});
  intermediate_handle.appendChild(createElement(
  {'tag':'label',
   'for':'remove-'+sub_item,
   'innerHTML':'Remove'
  }));
  intermediate_handle.appendChild(createElement(
  {'tag':'button',
   'name':'remove',
   'id':'remove-'+sub_item,
   'innerHTML':'remove',
   'onclick':'Macros.update('+item+',this,event)'
  }));
  box.appendChild(intermediate_handle);
  into.appendChild(box);
  if(remote_handle.value!=remote_index)
  {alert('remote_selection.value:'+remote_handle.value+' should be:'+remote_index);
  }
  else
  {this.update(item,remote_handle,event)
   document.getElementById('ircode-'+sub_item).value=ircode_index;
  }
 },

// ################# Add Macro #############################

 add()
 {
  if(!data['macros'])
  {data['macros']=[];
  }
  data['macros'].push({'name':'Macro'+(data['macros'].length+1)});
  this.update_list(data['macros'].length-1);
 },

 //#################### Edit ####################
 edit(item)
 {var into=document.getElementById('EditItemDisplay');
  into.innerHTML='';
  if(item>-1)
  {into.appendChild(createElement(
   {'tag':'button',
    'innerHTML':'Add ircode',
    'onclick':'Macros.add_ircode('+item+',-1)'
   }));
   into.appendChild(createElement(
   {'tag':'INPUT',
    'name':'name',
    'onchange':'Macros.update('+item+',this,event)',
    'value':data['macros'][item]['name']
   }));
   into.appendChild(createElement(
   {'tag':'button',
    'name':'test',
    'innerHTML':'Test',
    'onclick':'Macros.update('+item+',this,event)'
   }));
   into.appendChild(createElement(
   {'tag':'button',
    'name':'remove_macro',
    'innerHTML':'Remove Macro',
    'onclick':'Macros.update('+item+',this,event)'
   }));
   into.appendChild(createElement(
   {'tag':'div',
    'id':'ircodes'
   }));
   if(data['macros'][item]['ircodes'])
   {for(var i=0;i<data['macros'][item]['ircodes'].length;i++)
    {this.add_ircode(item,i);
   }}
 }},

 execute(list)
 {
  var reallist=[];
  json='{"id":'+Math.round(+new Date()/1000)+',"ircodes":'+JSON.stringify(list)+'}'
  fetch('irsend_mult.php',{
	method: 'POST',
	headers: {
		'Accept':'application/json',
		'Content-Type':'application/json'
	},
	body:'json='+json+'&id='+id,
        signal: AbortSignal.timeout(5000)
  });
  return;
 },

 save()
 {savedata['macros']=data['macros'];
 },

//############### remoterefresh ################

remote_refresh()
{
  var id = Math.round(+new Date()/1000);
  data['remotes']={'none':['none']};
  data['remotes_index']={}
  data['remotes_reverse_index']={};

  data['remote_index']=[];
  data['remote_reverse_index']=reverse_index(data['remote_index']);

  fetch('irsend_list.php?id='+id)
  .then(function () {})

  fetch('remotes/remotes.js?id='+id)
  .then(function (a) {
	return a.json(); // call the json method on the response to get JSON
  })
  .then(function (localdata){
	if(localdata['remotes']){
		var index=Object.keys(localdata['remotes'])
		for(var x=0;x<index.length;x++){
			data['remotes'][index[x]]=localdata['remotes'][index[x]];
		}
		data['remote_index']=Object.keys(data['remotes']);
		data['remote_reverse_index']=reverse_index(data['remote_index'])
		for(var x=0;x<data['remote_index'].length;x++){
			data['remotes_reverse_index'][data['remote_index'][x]]=reverse_index(data['remotes'][data['remote_index'][x]]);
		}
	}
  })
},


//################ Update #######################


 update(item,handle,event)
 {
const regex=/[0-9]*$/;
var sub_item=-1;
if(handle.hasAttribute('id'))
{sub_item=handle.getAttribute('id').match(regex);
}

if(handle.getAttribute('name')=='name')
{data['macros'][item]['name']=handle.value;
 //update selectbox with new name
 this.update_list(item)
 return;
}

if(handle.getAttribute('name')=='delay')
{data['macros'][item]['ircodes'][sub_item][2]=handle.value;
 return;
}

if(handle.getAttribute('name')=='loops')
{data['macros'][item]['ircodes'][sub_item][3]=handle.value;
 return;
}

if(handle.getAttribute('name')=='remove_macro')
{data['macros'].splice(item,1);
 this.update_list()
 return;
}

if(handle.getAttribute('name')=='remove')
{data['macros'][item]['ircodes'].splice(sub_item,1);
 handle.parentElement.remove();
 this.edit(item);
 return;
}

if(handle.getAttribute('name')=='ircode')
{data['macros'][item]['ircodes'][sub_item][1]=
 data['remotes'][data['macros'][item]['ircodes'][sub_item][0]][handle.value];
 return;
}

if(handle.getAttribute('name')=='test')
{
 this.execute(data['macros'][item]['ircodes']);
 return;
}

if(handle.getAttribute('name')=='remote')
{var ircode_parent=document.getElementById('ircode_parent-'+sub_item);
 data['macros'][item]['ircodes'][sub_item][0]=data['remote_index'][handle.value];
 if(event)
 {data['macros'][item]['ircodes'][sub_item][1]=data['remotes'][data['remote_index'][handle.value]][0];
 }
 ircode_parent.innerHTML=''
 ircode_parent.appendChild(createElement(
 {'select':data['remotes'][data['remote_index'][handle.value]],
  'name':'ircode',
  'id':'ircode-'+sub_item,
  'onchange':'Macros.update('+item+',this,event)',
  'value':0
 }));
 return;
}

 }
 // End of macro class
}
