var Macros=new Selector('Macro');

function Macro(data)
{if(typeof(data)=='undefined')
 {data={};
  data['name']='Edit';
  data['buttons']=[];
 }
 this.data=data;
 this.data['id']=Macros.items();
 Macros.add(this);
}

Macro.prototype.save=function(){return JSON.parse(JSON.stringify(this.data));}

Macro.prototype.getset=function(item,newvalue)
{if(typeof(newvalue)!='undefined')
 {this.data[item]=newvalue;
 }
 if(this.data[item])
 {return this.data[item];
 }
 else
 {return false;
}}

Macro.prototype.addRemote=function()
{
}

Macro.prototype.update=function(selected,data)
{if(data['itemnumber']!=-1)
 {var property=''
  if(data['property']){property=data['property'];}
  if(property=='remote')
  {
   alert(JSON.stringify(data))
   data['parentid']='key_'+data['itemnumber'];data['property']='key';data['list']=[];data['selected']=key;
   if(remote_index[selected]!=-1){data['list']=getdata['remotes'][remote_index[selected]];}
   alert(JSON.stringify(data))
   selectbox(data);
}}}

Macro.prototype.addButton=function(data)
{if(typeof(data)=='undefined'){data={}}
 var itemnumber=this.data['buttons'].length;
 var buttonparentid='button_'+itemnumber;
 var keyparentid='key_'+itemnumber;
 var buttondiv=document.getElementById(buttonparentid);
 var delay=0;
 if(data['delay']){delay=data['delay'];}
 if(!buttondiv)
 {var html='<div id="'+buttonparentid+'"></div>';
  html+='<div id="'+keyparentid+'"></div>';
  html+='<input type=text value="'+delay
  html+='" onchange="Macros.item('+this.data['id']+').update(\'\',{\'delay\':'+itemnumber+',\'value\':this.value,\'itemnumber\':'+itemnumber+'})">';
  document.getElementById('buttons').innerHTML+=html;
 }
 buttondiv=document.getElementById('button_'+this.data['buttons'].length);
 this.data['buttons'].push(['','',0]);
 var remote=-1
 var key=-1
 if(data['remote']){remote=data['remote'];}
 if(data['key']){key=data['key'];}
 var senddata={'onchange':'Macros.item('+this.data['id']+').update','itemnumber':itemnumber};
 senddata['parentid']=buttonparentid;senddata['property']='remote';senddata['list']=remote_index;senddata['selected']=remote;
 selectbox({'parentid':buttonparentid,'onchange':'Macros.item('+this.data['id']+').update','itemnumber':itemnumber,'list':remote_index,'property':'remote','selected':remote});
 senddata['parentid']=keyparentid;senddata['property']='key';senddata['list']=[];senddata['selected']=key;
 if(remote!=-1){senddata['list']=remotes[remote_index[remote]];}
 selectbox({'parentid':keyparentid,'onchange':'Macros.item('+this.data['id']+').update','itemnumber':itemnumber,'list':[],'property':'key','selected':key});
}

Macro.prototype.rename=function(item)
{this.data['name']=item.value;
}

Macro.prototype.edit=function()
{var html="Macro Edit";
 html+='<input type="text" onchange="Macros.item('+this.data['id']+').getset(\'name\',this.value);'
 html+='Macros.display();Macros.item('+this.data['id']+').edit();'
 html+='" value="'+this.data['name']+'"><div id="buttons"></div>';
 html+='<button onclick="Macros.item('+this.data['id']+').addButton()">Add Button</button>'
 document.getElementById('EditSubItemDisplay').innerHTML=html;
}
