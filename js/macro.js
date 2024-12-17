var Macros=
{
 display(macro)
 {if(typeof(macro)=='undefined')
  {alert('Macros Edit Mode')
   var into=document.getElementById('EditDisplay')
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
 update_list(item)
 {document.getElementById('macrolist').innerHTML=''
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
  }}
 },

// ########################### Add #############################################

 add(item,item_data)
 {var remote;
  var ircode;
  var delay;
  var remote_index;
  var ircode_index;
  if(typeof(item)!='undefined')
  {var into=document.getElementById('ircodes');
   alert('add ircode to macro:'+data['macros'][item]['name'])
   if(!data['macros'][item]['ircodes'])
   {data['macros'][item]['ircodes']=[];
   }
   if(typeof(item_data)=='undefined')
   {remote_index=0
    ircode_index=0
    delay=0
    remote=data['remote_index'][remote_index];
    ircode=data['remotes'][remote][ircode_index];
    item_data=
    [remote,
     ircode,
     delay
    ];
    data['macros'][item]['ircodes'].push(item_data);
   }
   else
   {
    remote=item_data[0];
    ircode=item_data[1];
    delay=item_data[2];
    remote_index=data['remote_reverse_index'][remote];
    ircode_index=data['remotes_reverse_index'][remote][ircode];
   }
   var box=createElement(
   {'tag':'div',
    'name':item
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
   this.update(item,remote_handle);
   box.getElementsByClassName('ircode')[0].value=ircode_index;
   box.appendChild(createElement(
   {'tag':'button',
    'name':'remove',
    'innerHTML':'remove',
    'onclick':'Macros.update('+item+',this,event)'
   }));
   into.appendChild(box);
   return
  }
  if(!data['macros'])
  {data['macros']=[];
  }
  data['macros'].push({'name':'Macro'+(data['macros'].length+1)});
  this.update_list(data['macros'].length-1);
  this.edit(data['macros'].length-1);
 },

 //#################### Edit ####################
 edit(item)
 {alert('Edit Macro:'+data['macros'][item]['name'])
  var into=document.getElementById('EditItemDisplay');
  into.innerHTML='';
  into.appendChild(createElement(
  {'tag':'button',
   'innerHTML':'Add ircode',
   'onclick':'Macros.add('+item+')'
  }));
  into.appendChild(createElement(
  {'tag':'INPUT',
   'name':'name',
   'onchange':'Macros.update('+item+',this,event)',
   'value':data['macros'][item]['name']
  }));
  into.appendChild(createElement(
  {'tag':'div',
   'id':'ircodes'
  }));
  if(data['macros'][item]['ircodes'])
  {for(var x=0;x<data['macros'][item]['ircodes'].length;x++)
   {this.add(item,data['macros'][item]['ircodes'][x]);
  }}
 },
 execute()
 {
 },
 save()
 {alert('Saving Macros');
  savedata['macros']=data['macros'];
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
if(handle.getAttribute('name')=='remote')
{var ircode_parent=handle.parentElement.getElementsByClassName('ircode_parent')[0];
 data['macros'][item]['ircodes'][handle.parentElement.getAttribute('name')][0]=data['remote_index'][handle.value];
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
