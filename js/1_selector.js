/*
 Because this is needed by others it is named 1_selector.js so that its name is first
*/
function Selector(itemtype,itemtypes)
{this.list=[];
 if(typeof(itemtypes)=='undefined')
 {this.listfor=itemtype+'s';
 }
 else
 {this.listfor=itemtypes;
 }
 this.singular=itemtype;
 this.allownew=true;
 this.data={};
}

Selector.prototype.save=function()
{var x;
 var data=[];
 var item='';
 for(x=0;x<this.list.length;x++)
 {item=this.list[x].save();
  delete item['id'];
  if(item!='')
  {data.push(item)
 }}
 return data;
}

Selector.prototype.getset=function(item,newvalue)
{if(typeof(newvalue)!='undefined')
 {this.data[item]=newvalue;
 }
 if(this.data[item])
 {return this.data[item];
 }
 else
 {return false;
}}


Selector.prototype.find=function(key,value)
{var x;
 for(x=0;x<this.list.length;x++)
 {if(this.list[x].getset(key)==value)
  {return x;
 }}
 return -1;
}

Selector.prototype.item=function(item)
{var itemnum;
 if(typeof(item)=='string'){itemnum=this.find('name',item);}else{itemnum=item;}
 return this.list[itemnum];
}

Selector.prototype.namelist=function()
{var list=[];
 var x;
 for(x=0;x<this.list.length;x++)
 {list.push(this.list[x].getset('name'));
 }
 return list;
}

Selector.prototype.final=function(){this.allownew=false}

Selector.prototype.count=function(){return this.list.length}

Selector.prototype.items=function(){return this.list.length}

Selector.prototype.re_id=function(){var x;for(x=0;x<this.list.length;x++){this.list[x].getset('id',x);}}

Selector.prototype.remove=function(item){var newlist=[];var x;for(x=0;x<this.list.length;x++){if(x!=item){newmacros.push(this.list[x]);}}this.list=newlist;this.re_id()}

Selector.prototype.edit=function(item){this.list[item].edit();}

Selector.prototype.select=function(data)
 {if(typeof(data)=='undefined'){data={}}
  if(!data['display']){data['display']='Display';}
  if(!data['chosen']){data['chosen']=-1;}
  if(!data['selectfunction']){data['selectfunction']='display()';}
  this.data=data;
  selectbox({'list':this.namelist(),'parentid':data['display'],'onchange':this.listfor+'.selected','selected':data['chosen']})
  document.getElementById(data['display']).innerHTML+='\n<div class="container" id="Remote"></div>'
 }

Selector.prototype.selected=function(value)
{
 this.data['chosen']=value;
 if(this.data['chosen']!=-1)
 {eval(this.listfor+'.item('+this.data['chosen']+').'+this.data['selectfunction']);
 }
 else
 {document.getElementById(this.data['display']).innerHTML=''
}}

Selector.prototype.display=function()
 {var html=this.listfor;
  html+='<div id="EditSubItemDisplay"></div>'
  if(this.allownew)
  {html+='<button onclick="'+this.listfor+'.add()">Add '+this.singular+'</button>';
  }
  document.getElementById('EditItemDisplay').innerHTML=html
  this.select({'display':'EditDisplay','showall':true,'selectfunction':'edit()'});
 }

Selector.prototype.add=function(item)
 {if(typeof(item)=='undefined')
  {eval('new '+this.singular+'()');
   var selected=this.list.length-1;
   this.display();
   document.getElementById('EditDisplay').getElementsByTagName('select')[0].value=selected;
   this.list[selected].edit();
  }
  else
  {this.list.push(item);
   this.data['chosen']=this.list.length-1;
 }}

Selector.prototype.bestfit=function(buttons)
{var hasmodules=[];
 var x,y,z,include;
 for(x=0;x<this.list.length;x++)
 {var module_buttons=this.list[x].getset('needed');
  include=0
  for(y=0;y<module_buttons.length;y++)
  {for(z=0;z<buttons.length;z++)
   {if(buttons[z]==module_buttons[y]){include++;}
  }}
  if(include==module_buttons.length)
  {hasmodules.push(this.list[x].getset('name'))
 }}
// alert(hasmodules)
 return hasmodules;
}
