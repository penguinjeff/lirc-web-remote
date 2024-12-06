var Displays=new Selector('Display');

function Display(data)
{if(typeof(data)=='undefined')
 {data={};
  data['name']='Edit';
  data['modules']=[];
 }
 this.data=data;
 this.data['id']=Displays.items();
 Displays.add(this);
}

Display.prototype.save=function()
{if(this.data['editable'])
 {return JSON.parse(JSON.stringify(this.data));
 }
 else
 { return '';
}}

Display.prototype.getset=function(item,newvalue)
{if(typeof(newvalue)!='undefined')
 {this.data[item]=newvalue;
 }
 if(this.data[item])
 {return this.data[item];
 }
 else
 {return false;
}}

Display.prototype.edit=function()
{var html="Display Edit";
 document.getElementById('EditSubItemDisplay').innerHTML=html;
}


Display.prototype.addRemote=function()
{
}

Display.prototype.addButton=function()
{
}

Display.prototype.display=function()
{var html='';
 var x,y,color,count,width,middle,leftover,itemwidth;
 for(x=0;x<this.data['modules'].length;x++)
 {//rows
  html+='<div class="container-1">'
  count=this.data['modules'][x].length;
  width=Math.floor((1/count)*100);
  middle=Math.floor(count/2)+1;
  leftover=100-(width*count);
  for(y=0;y<this.data['modules'][x].length;y++)
  {if(x%2){if(y%2){color='green';}else{color='red';}}
   else{if(y%2){color='blue';}else{color='orange';}}
   itemwidth=width;
   if(y==middle){itemwidth+=leftover;}
   html+='<div '
   html+='name="'+this.data['modules'][x][y][0]+'" '
   html+='class="'+this.data['modules'][x][y][0]+'" '
   html+='>';
   html+='</div>\n'
  }
  html+='</div>'
 }
 document.getElementById('Remote').innerHTML=html;
}

function Display_init()
{
 new Display({'editable':false,'name':'Default','modules':[
 [['remotename']],
 [['power']],
 [['catchall']],
 [['common']],
 [['colors']],
 [['volume'],['directions'],['channels']],
 [['navigatorpads'],['navigator'],['navigatorpads']],
 [['numberpads'],['numbers'],['numberpads']]
 ]});
}

window.onload=Display_init();
