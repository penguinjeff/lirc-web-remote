var Activities=new Selector('Activity','Activities');

function Activity(data)
{if(typeof(data)=='undefined')
 {data={};
  data['name']='Edit';
  data['remotes']=[];
 }
 this.data=data;
 this.data['id']=Activities.items();
 this.modulesFor=[];
 Activities.add(this)
}

Activity.prototype.save=function(){return JSON.parse(JSON.stringify(this.data));}

Activity.prototype.getset=function(item,newvalue)
{if(typeof(newvalue)!='undefined')
 {this.data[item]=newvalue;
 }
 if(this.data[item])
 {return this.data[item];
 }
 else
 {return false;
}}

Activity.prototype.addRemote=function()
{
}


Activity.prototype.remove=function(){Activities.remove(this.data['id']);}

Activity.prototype.addModuleFor=function(module,remote)
{this.modulesFor.push({module,remote});
}

Activity.prototype.edit=function()
{var html="Activity Edit";
 html+='<input type="text" onchange="Activities.item('+this.data['id']+').getset(\'name\',this.value);'
 html+='Activities.display()';
 html+='" value="'+this.data['name']+'">';
 document.getElementById('EditSubItemDisplay').innerHTML=html;
}

Activity.prototype.display=function()
{var html="Working remote";
 document.getElementById('Remote').innerHTML=html;
}
