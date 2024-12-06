var Modules=new Selector('Module');

function Module(data)
{if(typeof(data)=='undefined')
 {data={};
  data['editable']=true;
  data['name']='Edit';
  data['in']='Edit';
  data['buttons']=[];
  data['needed']=[];
  data['skip']=false;
 }
 this.data=data;
 this.data['id']=Modules.items();
 Modules.add(this);
}

Module.prototype.save=function()
{if(this.data['editable'])
 {return JSON.parse(JSON.stringify(this.data));
 }
 else
 {return '';
}}

Module.prototype.getset=function(item,newvalue)
{if(typeof(newvalue)!='undefined')
 {this.data[item]=newvalue;
 }
 if(this.data[item])
 {return this.data[item];
 }
 else
 {return false;
}}

Module.prototype.buttons=function()
{var buttonlist=[];
 var x,y;
 for(x=0;x<this.data['buttons'].length;x++)
 {//rows
  for(y=0;y<this.data['buttons'][x].length;y++)
  {if(this.data['buttons'][x][y].length>1)
   {buttonlist.push(this.data['buttons'][x][y][2]);
 }}}
 return buttonlist;
}

Module.prototype.addButton=function()
{
}

function remote_has_button(remote,button)
{var x;
 for(x=0;x<getdata['remotes'][remote].length;x++)
 {if(getdata['remotes'][remote][x]==button)
  {return true;
}}}

Module.prototype.display=function(remote)
{var html='';
 var x,y,z,button,displayname;
 var list=document.getElementsByName(this.data['in']);
 if(list.length)
 {for(y=0;y<this.data['buttons'].length;y++)
  {//rows
   html+='<div class="container-2">';
   for(z=0;z<this.data['buttons'][y].length;z++)
   {if(this.data['buttons'][y][z].length>1)
    {buttontype=this.data['buttons'][y][z][1];
     button=this.data['buttons'][y][z][2];
     if(buttontype=='key')
     {
      displayname=this.data['buttons'][y][z][0];
      if(remote_has_button(remote,button))
      {html+='<div class="button"'
       html+='\n onpointerdown="presshold(\''+remote+'\',\''+button+'\')"'
       html+='\n onpointerup="release(\''+remote+'\',\''+button+'\')"'
       html+='\n onpointerleave="release(\''+remote+'\',\''+button+'\')"';
       html+='>'
       html+=displayname
       html+='</div>\n';
      }
      else
      {if(!this.data['skip']){html+='<div class="empty"></div>\n';}
     }}
     else if(buttontype=='macro')
     {html+='<div class="button"'
      html+='\n onpointerdown="Macros.item(\''+button+'\').run()"'
      html+='>'
      html+=displayname
      html+='</div>\n';
   }}}
   html+='</div>\n';
  }
  list[0].innerHTML=html;
 }
}

var catchallbuttons={}
function CatchAll(remote,buttons,rows,columns)
{var html='';
 var pad=buttons.length%rows;
 if(pad!=0){pad=rows-pad}
 var x,y;
 for(x=0;x<pad;x++){buttons.push('')}
 catchallbuttons[remote]={'buttons':buttons,'current':0,'per':(rows*columns)};
/*
   y0 y1
x0 0  2
x1 1  3
*/
 for(x=0;x<rows;x++)
 {html+='<div class="container-2">';
  for(y=0;y<columns;y++)
  {html+='<div id="catch_all_'+remote+'_'+(y*rows+x)+'"></div>';
  }
  html+='</div>';
 }
 if(buttons.length>rows*columns)
 {
 html+='<div class="container-2">'
 html+='<div class="button" onclick="CatchAllAdvanceRewind(\''+remote+'\','+columns+','+rows+',-'+rows+')">&lt;</div>'
 for(x=0;x<(columns-2);x++){html+='<div class="empty"></div>';}
 html+='<div class="button" onclick="CatchAllAdvanceRewind(\''+remote+'\','+columns+','+rows+','+rows+')">&gt;</div>'
 html+='</div>';
 }
 var list=document.getElementsByName('catchall')
 if(list)
 {list[0].innerHTML=html;
 }
 CatchAllAdvanceRewind(remote,columns,rows,0);
}

function CatchAllAdvanceRewind(remote,columns,rows,advance)
{var current=catchallbuttons[remote]['current'];
 var per=catchallbuttons[remote]['per'];
 var buttons=catchallbuttons[remote]['buttons'];
 var x,item;
 var html;
 current+=advance;
 var end=current+per;
 if((buttons.length-1)>per)
 {if(current>buttons.length){current=0;}
  if(current<0){current=buttons.length-(rows)}
 }
 else
 {current=0;
  per=buttons.length;
 }
 catchallbuttons[remote]['current']=current;
 for(x=0;x<per;x++)
 {item=current+x;
  if(current+x>(buttons.length-1)){item=current+x-buttons.length}
  if(buttons[item]!='')
  {
   html='<div class="button"'
   html+='\n onpointerdown="presshold(\''+remote+'\',\''+buttons[item]+'\')"'
   html+='\n onpointerup="release(\''+remote+'\',\''+buttons[item]+'\')"'
   html+='\n onpointerleave="release(\''+remote+'\',\''+buttons[item]+'\')"';
   html+='>'+buttons[item].replace('KEY_','').replaceAll('_',' ')+'</div>';
  }
  else
  {html='<div class="empty"></div>'}
  document.getElementById('catch_all_'+remote+'_'+x).innerHTML=html;
}}

var holdtimer;
var held=false;
var mousedown=false;
function presshold(remote,button)
{
//document.getElementById("Show").innerHTML='pressed '+remote+' '+button;
 mousedown=true;
 held=false;
 holdtimer=setTimeout(function(){ hold(remote,button); }, 500);
 navigator.vibrate(500);
 send_action('send_once',remote,button);
}

function hold(remote,button)
{
 held=true;
 send_action('send_start',remote,button);
}

function release(remote,button)
{
 clearTimeout(holdtimer);
 mousedown=false;
 if(held)
 {send_action('send_stop',remote,button);
  held=false;
}}

function Module_init()
{new Module({'editable':false,'name':'numbers','in':'numbers','buttons':
 [[['1','key','KEY_1'],['2','key','KEY_2'],['3','key','KEY_3']]
 ,[['4','key','KEY_4'],['5','key','KEY_5'],['6','key','KEY_6']]
 ,[['7','key','KEY_7'],['8','key','KEY_8'],['9','key','KEY_9']]
 ,[['-','key','KEY_MINUS'],['0','key','KEY_0'],['E','key','KEY_OK']]],
 'needed':['KEY_1','KEY_2','KEY_3','KEY_4','KEY_5','KEY_6','KEY_7','KEY_8','KEY_9','KEY_0'],
 'skip':false
 })
 new Module({'editable':false,'name':'directions','in':'directions','buttons':
 [[[],['&#9652;','key','KEY_UP'],[]]
 ,[['&#9666;','key','KEY_LEFT'],['OK','key','KEY_OK'],['&#9656;','key','KEY_RIGHT']]
 ,[[],['&#9662;','key','KEY_DOWN'],[]]],
 'needed':['KEY_UP','KEY_DOWN','KEY_LEFT','KEY_RIGHT'],
 'skip':false
 })
 new Module({'editable':false,'name':'navigator1','in':'navigator','buttons':
 [[['&#x23EA;','key','KEY_FASTREWIND'],['&#9654;','key','KEY_PLAY'],['&#x23E9;','key','KEY_FASTFORWARD']]
 ,[['&#x23EE;','key','key','KEY_PREVIOUS'],[],['&#x23ED;','key','KEY_NEXT']]
 ,[['&#x23FA;','key','KEY_RECORD'],['&#x23F8;','key','KEY_PAUSE'],['&#x23F9;','key','KEY_STOP']]],
 'needed':['KEY_PLAY','KEY_FASTREWIND','KEY_FASTFORWARD','KEY_PREVIOUS','KEY_NEXT','KEY_PAUSE'],
 'skip':false
 })
 new Module({'editable':false,'name':'navigator2','in':'navigator','buttons':
 [[['&#x23EA;','key','KEY_FASTREWIND'],['&#x23ef;','key','KEY_PAUSE'],['&#x23E9;','key','KEY_FASTFORWARD']]
 ,[['&#x23EE;','key','KEY_PREVIOUS'],[],['&#x23ED;','key','KEY_NEXT']]
 ,[['&#x23FA;','key','KEY_RECORD'],[],['&#x23F9;','key','KEY_STOP']]],
 'needed':['KEY_FASTREWIND','KEY_FASTFORWARD','KEY_PAUSE'],
 'skip':true
 })
 new Module({'editable':false,'name':'channels','in':'channels','buttons':
 [[['Ch+','key','KEY_CHANNELUP']]
 ,[['Ch']]
 ,[['Ch-','key','KEY_CHANNELDOWN']]
 ,[['Ch&#x21BA;','key','KEY_CHANNELPREVIOUS']]],
 'needed':['KEY_CHANNELUP','KEY_CHANNELDOWN'],
 'skip':true
 })
 new Module({'editable':false,'name':'volume','in':'volume','buttons':
 [[['&#x1F50A;+','key','KEY_VOLUMEUP']]
 ,[['&#x1F50A;Vol']]
 ,[['&#x1F50A;-','key','KEY_VOLUMEDOWN']]
 ,[['&#x1F507;','key','KEY_MUTE']]],
 'needed':['KEY_VOLUMEUP','KEY_VOLUMEDOWN'],
 'skip':true
 })
 new Module({'editable':false,'name':'common','in':'common','buttons':
 [[['Home','key','KEY_HOME'],['List','key','KEY_LIST'],['Exit','key','KEY_EXIT']
 ,['Menu','key','KEY_MENU'],['Guide','key','KEY_GUIDE'],['Info','key','KEY_INFO']]],
 'needed':[],
 'skip':true
 });
 new Module({'editable':false,'name':'colors','in':'colors','buttons':
 [[['<font color="red">&#x25A0;</font>','key','KEY_RED']
  ,['<font color="green">&#x25A0;</font>','key','KEY_GREEN']
  ,['<font color="yellow">&#x25A0;</font>','key','KEY_YELLOW']
  ,['<font color="#0000FF">&#x25A0;</font>','key','KEY_BLUE']]],
 'needed':[],
 'skip':true
 });
 new Module({'editable':false,'name':'power','in':'power','buttons':
 [[['Power','key','KEY_POWER'],['On','key','KEY_POWERON'],['Off','key','KEY_POWEROFF']]],'needed':[],skip:true});
 new Module({'editable':false,'name':'catch','in':'catch','buttons':'REST','needed':[],'skip':false});
}

window.onload=Module_init();
