data['activities']=[{'name':'none','editable':false}]

var Activities=
{
 display(activity)
 {if(typeof(activity)=='undefined')
  {alert('Activities Edit Mode')
  }
 },
 remotes()
 {
  into=document.getElementById('choose')
  into.innerHTML='';
  var temp=[];
  for(var x=0;x<data['activities'].length;x++)
  {temp.push(data['activities'][x]['name'])
  }
  into.appendChild(createElement(
  {'options':temp,
   'onchange':'activities.select(this)',
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
 {if(item.value=='none')
  {document.getElementById('remote').innerHTML='';
  }
  else
  {document.getElementById('remote').innerHTML='';
   // do more when I get to this
 }},

 save()
 {alert('Saving Activities')
  var temp=[]
  for(var x=0;x<data['activities'].length;x++)
  {if(data['activities'][x]['editable'])
   {temp.push(data['activities'][x])
  }}
  savedata['activities']=temp;
}}

