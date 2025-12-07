
var Devices=
{holdtimer:'',
 altholdtimer:'',
 held:false,
 mousedown:false,
 display()
 {alert('displays edit mode')
 },
 remotes()
 {var into
  into=document.getElementById('choose');
  into.innerHTML='';
  into.appendChild(createElement(
  {'select':Object.keys(data['remotes']),
   'onchange':'Devices.select(this)',
   'namevalues':true
  }));
  into=document.getElementById('Display')
  into.appendChild(createElement(
  {'tag':'div',
   'class':'container',
   'id':'remote'
  }));
 },
 select(item)
 {if(item.value!='none')
  {Modules.display(item.value)
  }
  else
  {document.getElementById('remote').innerHTML='';
 }},
 save()
 {alert('Saving Devices')
 },

 presshold(remote,button,item,event)
 {if(!event['button'])
  {
   item.setAttribute('class','button_clicked')
   this.mousedown=true;
   this.holding=true;
   this.held=false;
   this.holdtimer=setTimeout(function(){ Devices.hold(remote,button); }, 700);
   navigator.vibrate(700);
   Macros.execute([[remote,button,0,1]])
 }},

 hold(remote,button)
 {
  if(this.holding)
  {
   this.held=true
   // loop an unresanable amount of times 1000 is unreasonable and should be cut off long before reached
   Macros.execute([[remote,button,0,1000]])
  }
 },


 release(remote,button,item,event)
 {if(!event['button'])
  {
   this.holding=false;
   clearTimeout(this.holdtimer);
   if(this.held){Macros.execute([]);}
   this.altholdtimer=setTimeout(function(){ Devices.delayed_release(item); }, 100);
   this.mousedown=false;
   this.held=false;
 }},
 delayed_release(item)
 {item.setAttribute('class','button')
 }

}








function Device_init()
{Macros.remote_refresh()
}
window.onload=Device_init();
