var catchallbuttons={}

var Modules=
{
 usedircodes:{},
 unused:[],
 current:0,
 per:0,
 //with just remote it uses best fit to find modules
 add()
 {
  if(!data['modules'])
  {data['modules']=[];
  }
  data['modules'].push({'name':'Module'+(data['modules'].length+1),'editable':true,'rows':[]});
  this.update_list(data['modules'].length-1);
 },
 update_list(item)
 {
 },
 display(remote,module,buttons,rows,columns)
 {if(typeof(remote)=='undefined')
  {alert('Modules Edit Mode');
   var editarea=document.getElementById('EditDisplay');
   editarea.appendChild(createElement(
   {'tag':'button',
    'innerHTML':'Add Module',
    'onclick':'Modules.add()'
   }));
   editarea.appendChild(createElement(
   {'tag':'div',
    'id':'module_selector_parent'
   }));
   var temp=[]
   for(x=0;x<data['modules'].length;x++)
   {if(data['modules'][x]['editable'])
    {temp.push(data['modules'][x]['name'])
   }}
   return;
  }

/*
############### End Module Edit Section #####################
*/
  var catchall=0;
  if(typeof(module)=='undefined')
  {var modules=Modules.bestfit(data['remotes'][remote])
   Displays.display('Default');
   this.usedircodes={};
   this.usedircodes[remote]={};
   for(var x=0;x<modules.length;x++)
   {if(data['modules'][modules[x]]['name']!='catchall')
    {Modules.display(remote,modules[x]);
    }
    else
    {catchall=modules[x];
    }
   }
   var unused=[];
   for(var x=0;x<data['remotes'][remote].length;x++)
   {if(!this.usedircodes[remote][data['remotes'][remote][x]])
    {if(data['remotes'][remote][x]!='')
     {unused.push(data['remotes'][remote][x])
   }}}
   this.unused=unused.sort();
   Modules.display(remote,catchall,unused,3,5);
   this.usedircodes={};

   return;
  }
  if(typeof(buttons)=='undefined'){buttons=[];}
  if(typeof(rows)=='undefined'){rows=3}
  if(typeof(colums)=='undefined'){columns=5}
  var drawin=document.getElementById(data['modules'][module]['in']);


/*
#################  CatchAll Module  ###################
*/
  if(data['modules'][module]['name']=='catchall')
  {var pad=this.unused.length%rows;
   if(pad!=0){pad=rows-pad}
   var x,y;
   for(var x=0;x<pad;x++){this.unused.push('')}
   this.current=0;
   this.per=(rows*columns);
/*
   y0 y1
x0 0  2
x1 1  3
*/
   for(var x=0;x<rows;x++)
   {var box=createElement(
    {'tag':'div',
     'class':'container-2'
    });
    for(var y=0;y<columns;y++)
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
   if(this.unused.length>rows*columns)
   {var box=createElement(
    {'tag':'div',
     'class':'container-2'
    });
    box.appendChild(createElement(
    {'tag':'button',
     'class':'button',
     'onclick':'Modules.CatchAllAdvanceRewind(\''+remote+'\','+columns+','+rows+',-'+rows+',this,event)',
     'innerHTML':'&lt'
    }));
    for(var x=0;x<(columns-2);x++)
    {box.appendChild(createElement(
     {'tag':'div',
      'class':'empty'
     }));
    }
    box.appendChild(createElement(
    {'tag':'button',
     'class':'button',
     'onclick':'Modules.CatchAllAdvanceRewind(\''+remote+'\','+columns+','+rows+','+rows+',this,event)',
     'innerHTML':'&gt'
    }));
    if(drawin){drawin.appendChild(box);}
    else{alert('Could not find module id:'+module)}
   }
   Modules.CatchAllAdvanceRewind(remote,columns,rows,0);
   return;
  }
  else
  {
/*
#################  End CatchAll  ########################
*/
   var drawin=document.getElementById(data['modules'][module]['in']);
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
       {'tag':'button',
        'class':'button',
        'onpointerdown':'Devices.presshold(\''+remote+'\',\''+button+'\',this,event)',
        'onpointerup':'Devices.release(\''+remote+'\',\''+button+'\',this,event)',
        'onpointerleave':'Devices.release(\''+remote+'\',\''+button+'\',this,event)',
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
       'onpointerdown':'Macros.execute('+macro+',this,event)'
      }));
    }}
    if(drawin)
    {drawin.appendChild(box);
    }
    else{alert('could not find id:'+module)}
 }}},

 CatchAllAdvanceRewind(remote,columns,rows,advance,item,event)
 {console.log(event);
  var item;
  this.current+=advance;
  var end=this.current+this.per;
  if((this.unused.length-1)>this.per)
  {if(this.current>this.unused.length){this.current=0;}
   if(this.current<0){this.current=this.unused.length-(rows)}
  }
  else
  {this.current=0;
   this.per=this.unused.length;
  }
  for(var x=0;x<this.per;x++)
  {item=this.current+x;
   var button;
   if(this.current+x>(this.unused.length-1)){item=this.current+x-this.unused.length}
   if(this.unused[item]!='')
   {button=createElement(
    {'tag':'button',
     'class':'button',
     'onpointerdown':'Devices.presshold(\''+remote+'\',\''+this.unused[item]+'\',this,event)',
     'onpointerup':'Devices.release(\''+remote+'\',\''+this.unused[item]+'\',this,event)',
     'onpointerleave':'Devices.release(\''+remote+'\',\''+this.unused[item]+'\',this,event)',
     'innerHTML':this.unused[item].replace('KEY_','').replaceAll('_',' ')
    })
   }
   else
   {button=createElement(
    {'tag':'div',
     'class':'empty'
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
  for(x=0;x<data['modules'].length;x++)
  {var module_buttons=data['modules'][x]['needed'];
   include=0
   for(y=0;y<module_buttons.length;y++)
   {for(z=0;z<buttons.length;z++)
    {if(buttons[z]==module_buttons[y]){include++;}
   }}
   if(include==module_buttons.length)
   {hasmodules.push(x)
  }}
  return hasmodules;
 },


 save()
 {alert('Saving Modules')
  var temp=[];
  for(var x=0;x<data['modules'].length;x++)
  {if(data['modules'][x]['editable'])
   {temp.push(JSON.parse(JSON.stringify(data['modules'][x])));
  }}
  savedata['modules']=temp;
 }
 //close out Modules
}


function Module_init()
{data['modules']=[];
 data['modules'].push({'name':'numbers','editable':false,'in':'numbers','buttons':
 [[['1','ircode','KEY_1'],['2','ircode','KEY_2'],['3','ircode','KEY_3']],
  [['4','ircode','KEY_4'],['5','ircode','KEY_5'],['6','ircode','KEY_6']],
  [['7','ircode','KEY_7'],['8','ircode','KEY_8'],['9','ircode','KEY_9']],
  [['-','ircode','KEY_MINUS'],['0','ircode','KEY_0'],['E','ircode','KEY_OK']]
 ],
 'needed':['KEY_1','KEY_2','KEY_3','KEY_4','KEY_5','KEY_6','KEY_7','KEY_8','KEY_9','KEY_0'],
 'skip':false
 });
 data['modules'].push({'name':'directions','editable':false,'in':'directions','buttons':
 [[[],['&#9652;','ircode','KEY_UP'],[]],
  [['&#9666;','ircode','KEY_LEFT'],['OK','ircode','KEY_OK'],['&#9656;','ircode','KEY_RIGHT']],
  [[],['&#9662;','ircode','KEY_DOWN'],[]]
 ],
 'needed':['KEY_UP','KEY_DOWN','KEY_LEFT','KEY_RIGHT'],
 'skip':false
 });
 data['modules'].push({'name':'navigator1','editable':false,'in':'navigator','buttons':
 [[['&#x23EA;','ircode','KEY_FASTREWIND'],['&#9654;','ircode','KEY_PLAY'],['&#x23E9;','ircode','KEY_FASTFORWARD']],
  [['&#x23EE;','ircode','ircode','KEY_PREVIOUS'],[],['&#x23ED;','ircode','KEY_NEXT']],
  [['&#x23FA;','ircode','KEY_RECORD'],['&#x23F8;','ircode','KEY_PAUSE'],['&#x23F9;','ircode','KEY_STOP']]
 ],
 'needed':['KEY_PLAY','KEY_FASTREWIND','KEY_FASTFORWARD','KEY_PREVIOUS','KEY_NEXT','KEY_PAUSE'],
 'skip':false
 });
 data['modules'].push({'name':'navigator2','editable':false,'in':'navigator','buttons':
 [[['&#x23EA;','ircode','KEY_FASTREWIND'],['&#x23ef;','ircode','KEY_PAUSE'],['&#x23E9;','ircode','KEY_FASTFORWARD']],
  [['&#x23EE;','ircode','KEY_PREVIOUS'],[],['&#x23ED;','ircode','KEY_NEXT']],
  [['&#x23FA;','ircode','KEY_RECORD'],[],['&#x23F9;','ircode','KEY_STOP']]
 ],
 'needed':['KEY_FASTREWIND','KEY_FASTFORWARD','KEY_PAUSE'],
 'skip':true
 });
 data['modules'].push({'name':'channels','editable':false,'in':'channels','buttons':
 [[['Ch+','ircode','KEY_CHANNELUP']],
  [['Ch']],
  [['Ch-','ircode','KEY_CHANNELDOWN']],
  [['Ch&#x21BA;','ircode','KEY_CHANNELPREVIOUS']]
 ],
 'needed':['KEY_CHANNELUP','KEY_CHANNELDOWN'],
 'skip':true
 });
 data['modules'].push({'name':'volume','editable':false,'in':'volume','buttons':
 [[['&#x1F50A;+','ircode','KEY_VOLUMEUP']],
  [['&#x1F50A;Vol']],
  [['&#x1F50A;-','ircode','KEY_VOLUMEDOWN']],
  [['&#x1F507;','ircode','KEY_MUTE']]
 ],
 'needed':['KEY_VOLUMEUP','KEY_VOLUMEDOWN'],
 'skip':true
 });
 data['modules'].push({'name':'common','editable':false,'in':'common','buttons':
 [[['Home','ircode','KEY_HOME'],['List','ircode','KEY_LIST'],['Exit','ircode','KEY_EXIT'],
  ['Menu','ircode','KEY_MENU'],['Guide','ircode','KEY_GUIDE'],['Info','ircode','KEY_INFO']]
 ],
 'needed':[],
 'skip':true
 });
 data['modules'].push({'name':'colors','editable':false,'in':'colors','buttons':
 [[['<font color="red">&#x25A0;</font>','ircode','KEY_RED']
  ,['<font color="green">&#x25A0;</font>','ircode','KEY_GREEN']
  ,['<font color="yellow">&#x25A0;</font>','ircode','KEY_YELLOW']
  ,['<font color="#0000FF">&#x25A0;</font>','ircode','KEY_BLUE']]],
 'needed':[],
 'skip':true
 });
 data['modules'].push({'name:':'power','editable':false,'in':'power','buttons':
 [[['Power','ircode','KEY_POWER'],['On','ircode','KEY_POWERON'],['Off','ircode','KEY_POWEROFF']]],'needed':[],skip:true});
 data['modules'].push({'name':'catchall','editable':false,'name':'catchall','in':'catchall','buttons':'REST','needed':[],'skip':false});
}

window.onload=Module_init();
