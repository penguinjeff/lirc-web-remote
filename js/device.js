
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
  {'options':Object.keys(data['remotes']),
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
   this.held=true;
   this.holdtimer=setTimeout(function(){ Devices.hold(remote,button); }, 500);
   navigator.vibrate(500);
   Macros.execute([[remote,button,0,1]],'send_once')
 }},

 hold(remote,button)
 {
  if(this.held)
  {
   // loop an unresanable amount of times 1000 is unreasonable and should be cut off long before reached
   Macros.execute([[remote,button,0,1000]],'send_once')
  }
 },


 release(remote,button,item,event)
 {if(!event['button'])
  {
   clearTimeout(this.holdtimer);
   Macros.execute([],'');
   this.altholdtimer=setTimeout(function(){ Devices.delayed_release(item); }, 100);
   this.mousedown=false;
   this.held=false;
 }},
 delayed_release(item)
 {item.setAttribute('class','button')
 }

}








function Device_init()
{Macros.execute([['','',0,1]],'list');
}
window.onload=Device_init();
