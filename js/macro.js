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
 add(item,item_data)
 {var selected_remote;
  var selected_ircode;
  var selected_remote_index;
  var selected_ircode_index;
  if(typeof(item)!='undefined')
  {var into=document.getElementById('ircodes');
   alert('add ircode to macro:'+data['macros'][item]['name'])
   if(!data['macros'][item]['ircodes'])
   {data['macros'][item]['ircodes']=[];
   }
   if(typeof(item_data)=='undefined')
   {selected_remote_index=0
    selected_ircode_index=0
    alert(JSON.stringify(data['remote_reverse_index']));
    selected_remote=data['remote_reverse_index'][selected_remote_index];
    alert('remote:'+selected_remote+' from:'+JSON.stringify(data['remotes_reverse_index']));
    selected_ircode=data['remotes_reverse_index'][selected_remote][selected_ircode_index];
    item_data=
    [selected_remote,
     selected_ircode,
     0
    ];
    data['macros'][item]['ircodes'].push(item_data);
   }
   else
   {selected_remote=item_data[0];
    selected_ircode=item_data[1];
    selected_remote_index=data['remote_reverse_index'][selected_remote];
    selected_ircode_index=data['remotes_reverse_index'][selected_remote][selected_ircode];
   }
   var box=createElement(
   {'tag':'div',
    'name':item
   });
   box.appendChild(createElement(
   {'options':data['remote_index'],
    'name':'remote',
    'onclick':'Macros.update('+item+',this,event)',
    'value':selected_remote_index
   }));
   box.appendChild(createElement(
   {'options':data['remotes'][selected_ircode],
    'name':'ircode',
    'onclick':'Macros.update('+item+',this,event)',
    'value':selected_ircode_index
   }));
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
return
}
if(handle.getAttribute('name')=='remove')
{
data['macros'][item]['ircodes'].splice(handle.parentElement.getAttribute('name'),1);
handle.parentElement.remove();
return
}

 }
 // End of macro class
}
