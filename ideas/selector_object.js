function SelectorObject(selectorin,datain)
{if(typeof(data)=="undefined")
 {datain={};
  datain['name']='Edit';
 }
 this.data=datain;
 this.data['id']=selectorin.count();
 this.modulesFor=[];
 selectorin.add(this)
}

SelectorObject.prototype.getset=function(item,newvalue)
{if(typeof(newvalue)!='undefined')
 {this.data[item]=newvalue;
 }
 if(this.data[item])
 {return this.data[item];
 }
 else
 {return false;
}}


SelectorObject.prototype.remove=function(){Activities.remove(this.data['id']);}

SelectorObject.prototype.edit=function()
{var html="Activity Edit";
 document.getElementById('EditSubItemDisplay').innerHTML=html;
}

Activity.prototype.display=function()
{var html="Hello";
 document.getElementById('Remote').innerHTML=html;
}
