data['activities']={'none':['none']}

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
  into.appendChild(createElement(
  {'options':Object.keys(data['activities']),
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
  {display(item.value)
  }
  else
  {document.getElementById('remote').innerHTML=''
 }},
 load()
 {if(Edit.data_load['activites'])
  {
   data['activities']=JSON.parse(JSON.stringify(Edit.data_load['activites']));
  }
  return true;
 },
 save()
 {alert('Saving Activities')
  var temp=JSON.parse(JSON.stringify(data['activities']));
  delete temp['none'];
  savedata['activities']=temp;
}}

