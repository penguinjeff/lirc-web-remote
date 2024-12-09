var catchallbuttons={}

var Modules=
{
 usedircodes:{},

 //with just remote it uses best fit to find modules
 display(remote,module,buttons,rows,columns)
 {if(typeof(remote)=='undefined')
  {alert('modules edit mode');
   return;
  }
  if(typeof(module)=='undefined')
  {var modules=Modules.bestfit(data['remotes'][remote])
   Displays.display();
   this.usedircodes={};
   this.usedircodes[remote]={};
   modules.forEach(function(module){if(module!='catchall'){Modules.display(remote,module)}})
   var unused=[];
   for(var x=0;x<data['remotes'][remote].length;x++)
   {if(!this.usedircodes[remote][data['remotes'][remote][x]]){unused.push(data['remotes'][remote][x])
   }}

   Modules.display(remote,'catchall',unused,3,5);
   this.usedircodes={};

   return;
  }
  if(typeof(buttons)=='undefined'){buttons=[];}
  if(typeof(rows)=='undefined'){rows=3}
  if(typeof(colums)=='undefined'){columns=5}
  var drawin=document.getElementById(data['modules'][module]['in']);
  if(module=='catchall')
  {var pad=buttons.length%rows;
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
   {var box=createElement(
    {'tag':'div',
     'class':'container-2'
    });
    for(y=0;y<columns;y++)
    {box.appendChild(createElement(
     {'tag':'div',
      'id':'catch_all_'+remote+'_'+(y*rows+x)
     }));
    }
    if(drawin)
    {
     drawin.appendChild(box);
    }
    else{alert('could not find module id:'+module)}
   }
   if(buttons.length>rows*columns)
   {var box=createElement(
    {'tag':'div',
     'class':'container-2'
    });
    box.appendChild(createElement(
    {'tag':'div',
     'class':'button',
     'onclick':'Modules.CatchAllAdvanceRewind(\''+remote+'\','+columns+','+rows+',-'+rows+')',
     'innerHTML':'&lt'
    }));
    for(x=0;x<(columns-2);x++)
    {box.appendChild(createElement(
     {'tag':'div',
      'class':'empty'
     }));
    }
    box.appendChild(createElement(
    {'tag':'div',
     'class':'button',
     'onclick':'Modules.CatchAllAdvanceRewind(\''+remote+'\','+columns+','+rows+','+rows+')',
     'innerHTML':'&gt'
    }));
    if(drawin){drawin.appendChild(box);}
    else{alert('Could not find module id:'+module)}
   }
   Modules.CatchAllAdvanceRewind(remote,columns,rows,0);
   return;
  }
  else //################# End CatchAll ########################
  {var drawin=document.getElementById(data['modules'][module]['in']);
   if(!drawin){alert('no id for '+module);return}
   var skip=data['modules'][module]['skip'];
   for(var x=0;x<data['modules'][module]['buttons'].length;x++)
   {//rows
    var box=createElement(
    {'tag':'div',
     'class':'container-2'
    });
    for(var y=0;y<data['modules'][module]['buttons'][x].length;y++)
    {var buttondisplay='';
     var buttontype='';
     if(data['modules'][module]['buttons'][x][y].length>0)
     {buttondisplay=data['modules'][module]['buttons'][x][y][0];
      buttontype=data['modules'][module]['buttons'][x][y][1];
     }
     if(buttontype=='ircode')
     {var button=data['modules'][module]['buttons'][x][y][2];
      if((new Set(data['remotes'][remote])).has(button))
      {//mark button used
       if(!(this.usedircodes[remote])){this.usedircodes[remote]={};}
       this.usedircodes[remote][button]=true;
       box.appendChild(createElement(
       {'tag':'div',
        'class':'button',
        'onpointerdown':'presshold(\''+remote+'\',\''+button+'\')',
        'onpointerup':'release(\''+remote+'\',\''+button+'\')',
        'onpointerleave':'release(\''+remote+'\',\''+button+'\')',
        'innerHTML':buttondisplay
       }));
      }
      else
      {buttontype='';
     }}
     if((!skip)&&buttontype!='ircode')
     {box.appendChild(createElement(
      {'tag':'div',
       'class':'empty'
      }));
     }
     else if(buttontype=='macro')
     {var macro=data['modules'][module]['buttons'][x][y][1];
      box.appendChild(createElement(
      {'tag':'button',
       'name':'button',
       'onpointerdown':'Macros.execute('+macro+')'
      }));
    }}
    if(drawin)
    {drawin.appendChild(box);
    }
    else{alert('could not find id:'+module)}
 }}},


 CatchAllAdvanceRewind(remote,columns,rows,advance)
 {var current=catchallbuttons[remote]['current'];
  var per=catchallbuttons[remote]['per'];
  var buttons=catchallbuttons[remote]['buttons'].sort();
  var x,item;
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
   var button;
   if(current+x>(buttons.length-1)){item=current+x-buttons.length}
   if(buttons[item]!='')
   {button=createElement(
    {'tag':'div',
     'class':'button',
     'onpointerdown':'presshold(\''+remote+'\',\''+buttons[item]+'\')',
     'onpointerup':'release(\''+remote+'\',\''+buttons[item]+'\')',
     'onpointerleave':'release(\''+remote+'\',\''+buttons[item]+'\')',
     'innerHTML':buttons[item].replace('KEY_','').replaceAll('_',' ')
    })
   }
   else
   {button=createElement(
    {'tag':'div',
     'class':'emty'
    });
   }
   if(document.getElementById('catch_all_'+remote+'_'+x))
   {document.getElementById('catch_all_'+remote+'_'+x).innerHTML='';
    document.getElementById('catch_all_'+remote+'_'+x).appendChild(button);
   }
   else{alert('can not find id: catch_all_'+remote+'_'+x)}
  }
 },


 bestfit(buttons)
 {var hasmodules=[];
  var x,y,z,include;
  modules=Object.keys(data['modules']);
  for(x=0;x<modules.length;x++)
  {var module_buttons=data['modules'][modules[x]]['needed'];
   include=0
   for(y=0;y<module_buttons.length;y++)
   {for(z=0;z<buttons.length;z++)
    {if(buttons[z]==module_buttons[y]){include++;}
   }}
   if(include==module_buttons.length)
   {hasmodules.push(modules[x])
  }}
  return hasmodules;
 }
 //close out Modules
}


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
{data['modules']={};
 data['modules']['numbers']={'editable':false,'in':'numbers','buttons':
 [[['1','ircode','KEY_1'],['2','ircode','KEY_2'],['3','ircode','KEY_3']],
  [['4','ircode','KEY_4'],['5','ircode','KEY_5'],['6','ircode','KEY_6']],
  [['7','ircode','KEY_7'],['8','ircode','KEY_8'],['9','ircode','KEY_9']],
  [['-','ircode','KEY_MINUS'],['0','ircode','KEY_0'],['E','ircode','KEY_OK']]
 ],
 'needed':['KEY_1','KEY_2','KEY_3','KEY_4','KEY_5','KEY_6','KEY_7','KEY_8','KEY_9','KEY_0'],
 'skip':false
 };
 data['modules']['directions']={'editable':false,'in':'directions','buttons':
 [[[],['&#9652;','ircode','KEY_UP'],[]],
  [['&#9666;','ircode','KEY_LEFT'],['OK','ircode','KEY_OK'],['&#9656;','ircode','KEY_RIGHT']],
  [[],['&#9662;','ircode','KEY_DOWN'],[]]
 ],
 'needed':['KEY_UP','KEY_DOWN','KEY_LEFT','KEY_RIGHT'],
 'skip':false
 };
 data['modules']['navigator1']={'editable':false,'in':'navigator','buttons':
 [[['&#x23EA;','ircode','KEY_FASTREWIND'],['&#9654;','ircode','KEY_PLAY'],['&#x23E9;','ircode','KEY_FASTFORWARD']],
  [['&#x23EE;','ircode','ircode','KEY_PREVIOUS'],[],['&#x23ED;','ircode','KEY_NEXT']],
  [['&#x23FA;','ircode','KEY_RECORD'],['&#x23F8;','ircode','KEY_PAUSE'],['&#x23F9;','ircode','KEY_STOP']]
 ],
 'needed':['KEY_PLAY','KEY_FASTREWIND','KEY_FASTFORWARD','KEY_PREVIOUS','KEY_NEXT','KEY_PAUSE'],
 'skip':false
 };
 data['modules']['navigator2']={'editable':false,'in':'navigator','buttons':
 [[['&#x23EA;','ircode','KEY_FASTREWIND'],['&#x23ef;','ircode','KEY_PAUSE'],['&#x23E9;','ircode','KEY_FASTFORWARD']],
  [['&#x23EE;','ircode','KEY_PREVIOUS'],[],['&#x23ED;','ircode','KEY_NEXT']],
  [['&#x23FA;','ircode','KEY_RECORD'],[],['&#x23F9;','ircode','KEY_STOP']]
 ],
 'needed':['KEY_FASTREWIND','KEY_FASTFORWARD','KEY_PAUSE'],
 'skip':true
 };
 data['modules']['channels']={'editable':false,'in':'channels','buttons':
 [[['Ch+','ircode','KEY_CHANNELUP']],
  [['Ch']],
  [['Ch-','ircode','KEY_CHANNELDOWN']],
  [['Ch&#x21BA;','ircode','KEY_CHANNELPREVIOUS']]
 ],
 'needed':['KEY_CHANNELUP','KEY_CHANNELDOWN'],
 'skip':true
 };
 data['modules']['volume']={'editable':false,'in':'volume','buttons':
 [[['&#x1F50A;+','ircode','KEY_VOLUMEUP']],
  [['&#x1F50A;Vol']],
  [['&#x1F50A;-','ircode','KEY_VOLUMEDOWN']],
  [['&#x1F507;','ircode','KEY_MUTE']]
 ],
 'needed':['KEY_VOLUMEUP','KEY_VOLUMEDOWN'],
 'skip':true
 };
 data['modules']['common']={'editable':false,'in':'common','buttons':
 [[['Home','ircode','KEY_HOME'],['List','ircode','KEY_LIST'],['Exit','ircode','KEY_EXIT'],
  ['Menu','ircode','KEY_MENU'],['Guide','ircode','KEY_GUIDE'],['Info','ircode','KEY_INFO']]
 ],
 'needed':[],
 'skip':true
 };
 data['modules']['colors']={'editable':false,'in':'colors','buttons':
 [[['<font color="red">&#x25A0;</font>','ircode','KEY_RED']
  ,['<font color="green">&#x25A0;</font>','ircode','KEY_GREEN']
  ,['<font color="yellow">&#x25A0;</font>','ircode','KEY_YELLOW']
  ,['<font color="#0000FF">&#x25A0;</font>','ircode','KEY_BLUE']]],
 'needed':[],
 'skip':true
 };
 data['modules']['power']={'editable':false,'in':'power','buttons':
 [[['Power','ircode','KEY_POWER'],['On','ircode','KEY_POWERON'],['Off','ircode','KEY_POWEROFF']]],'needed':[],skip:true};
 data['modules']['catchall']={'editable':false,'name':'catchall','in':'catchall','buttons':'REST','needed':[],'skip':false};
}

window.onload=Module_init();
