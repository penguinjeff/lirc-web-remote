data['activities']={'none':['none']}

var Activities=
{
 display(activity)
 {if(typeof(activity)=='undefined')
  {alert('Activities Edit Mode')
  }
 },
 remotes()
 {into=document.getElementById('Display')
  into.appendChild(createElement(
  {'options':Object.keys(data['activities']),
   'onchange':'activities.select(this)',
   'namevalues':true
  }));
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
 }}
}

