/*
 Because this is needed by others it is named 1_selector.js so that its name is first
*/
function Selector(itemtype,itemtypes)
{this.list=[{}];
 if(typeof(itemtypes)=='undefined'){this.listfor=itemtype+'s';}
 else{this.listfor=itemtypes;}
 this.singular=itemtype;
 this.allownew=true;
 this.data={};
}

Selector.prototype.save=function()
{var data=[];
 var item='';
 for(var x=0;x<this.list.length;x++)
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
{for(var x=1;x<this.list.length;x++)
 {if(this.list[x].getset(key)==value)
  {return x;
 }}
 return 0;
}

Selector.prototype.item=function(item)
{var itemnum;
 if(typeof(item)=='string'){itemnum=this.find('name',item);}else{itemnum=item;}
 return this.list[itemnum];
}

Selector.prototype.namelist=function()
{var list=['none'];
 for(var x=1;x<this.list.length;x++)
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
  if(!data['chosen']){data['chosen']=0;}
  if(!data['selectfunction']){data['selectfunction']='display()';}
  var box=document.getElementById(data['display'])
  this.data=data;
  box.appendChild(createElement(
  {'options':this.namelist(),
   'onchange':this.listfor+'.selected(this)',
   'value':data['chosen']
  }));
  box.appendChild(createElement(
  {'tag':'div',
   'class':'container',
   'id':'Remote'
  }));
}

Selector.prototype.selected=function(item)
{
 this.data['chosen']=item.value;
 if(this.data['chosen']!=0)
 {eval(this.listfor+'.item('+this.data['chosen']+').'+this.data['selectfunction']);
 }
 else
 {document.getElementById(this.data['display']).innerHTML=''
}}

Selector.prototype.display=function()
{
 box=document.getElementById('EditItemDisplay')
 box.appendChild(createElement(
 {'tag':'div',
  'innerHtml':this.listfor
 }));
 box.appendChild(createElement(
 {'tag':'div',
  'id':'EditSubItemDisplay'
 }));
 if(mode=='edit')
 {box.appendChild(createElement(
  {'tag':'button',
   'onclick':this.listfor+'.add()',
   'innerHTML':'Add '+this.singular
  }));
 }
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
 for(x=1;x<this.list.length;x++)
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
