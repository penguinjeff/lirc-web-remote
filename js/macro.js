var Macros=
{
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

// Update list

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
    {'options':temp,
     'onchange':'Macros.edit(this.value)',
     'value':item
    }));
   }
   if(typeof(item)=='undefined'){item=-1;}
   this.edit(item);
  }
 },

// ####################### Add Ircode ###############################
 add_ircode(item,item_data)
 {var remote;
  var ircode;
  var delay;
  var remote_index;
  var ircode_index;
  var into=document.getElementById('ircodes');
  if(!data['macros'][item]['ircodes'])
  {data['macros'][item]['ircodes']=[];
  }
  if(item_data==-1)
  {remote_index=0
   ircode_index=0
   delay=0
   remote=data['remote_index'][remote_index];
   ircode=data['remotes'][remote][ircode_index];
   item_data=data['macros'][item]['ircodes'].length;
   data['macros'][item]['ircodes'].push([remote,ircode,delay]);
   event=true;
  }
  else
  {
   remote=data['macros'][item]['ircodes'][item_data][0];
   ircode=data['macros'][item]['ircodes'][item_data][1];
   delay=data['macros'][item]['ircodes'][item_data][2];
   remote_index=data['remote_reverse_index'][remote];
   ircode_index=data['remotes_reverse_index'][remote][ircode];
   event=false;
  }
//  alert('item:'+item+' item_data:'+item_data+' '+JSON.stringify(data['macros'][item]['ircodes']))
  var box=createElement(
  {'tag':'div',
   'name':item_data
  });
  var remote_handle=createElement(
  {'options':data['remote_index'],
   'name':'remote',
   'class':'lefty',
   'onclick':'Macros.update('+item+',this,event)',
   'value':remote_index
  });
  box.appendChild(remote_handle);
  box.appendChild(createElement(
  {'tag':'div',
   'class':'lefty',
   'name':'ircode_parent'
  }));
  this.update(item,remote_handle,event)
  box.getElementsByClassName('ircode')[0].value=ircode_index;
  box.appendChild(createElement(
  {'tag':'button',
   'name':'remove',
   'innerHTML':'remove',
   'onclick':'Macros.update('+item+',this,event)'
  }));
  into.appendChild(box);
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
   {for(var x=0;x<data['macros'][item]['ircodes'].length;x++)
    {this.add_ircode(item,x);
   }}
 }},

 execute()
 {
 },
 save()
 {savedata['macros']=data['macros'];
 },
 update(item,handle,event)
 {
if(handle.getAttribute('name')=='name')
{
data['macros'][item]['name']=handle.value;
//update selectbox with new name
this.update_list(item)
return;
}
if(handle.getAttribute('name')=='remove_macro')
{
data['macros'].splice(item,1);
this.update_list()
return;
}
if(handle.getAttribute('name')=='remove')
{
data['macros'][item]['ircodes'].splice(handle.parentElement.getAttribute('name'),1);
handle.parentElement.remove();
return;
}
if(handle.getAttribute('name')=='ircode')
{data['macros'][item]['ircodes'][handle.parentElement.parentElement.getAttribute('name')][1]=
 data['remotes'][data['macros'][item]['ircodes'][handle.parentElement.parentElement.getAttribute('name')][0]][handle.value];
return;
}
if(handle.getAttribute('name')=='test')
{alert(JSON.stringify(data['macros'][item]['ircodes']));
return;
}
if(handle.getAttribute('name')=='remote')
{var ircode_parent=handle.parentElement.getElementsByClassName('ircode_parent')[0];
 var ircode_index=handle.parentElement.getAttribute('name');
 data['macros'][item]['ircodes'][ircode_index][0]=data['remote_index'][handle.value];
 if(event)
 {data['macros'][item]['ircodes'][ircode_index][1]=data['remotes'][data['remote_index'][handle.value]][0];
 }
 ircode_parent.innerHTML=''
 ircode_parent.appendChild(createElement(
 {'options':data['remotes'][data['remote_index'][handle.value]],
  'name':'ircode',
  'onclick':'Macros.update('+item+',this,event)',
  'value':0
 }));
return;
}

 }
 // End of macro class
}
