//function to create an object from a list where that list item becomes a key with its index being the value
//useful for converting the name to an index
function reverse_index(list)
{var myobject={};
 list.forEach((value, index) => myobject[value] = index);
 return myobject;
}

//I wanted a way to pass more into a createElement to simplify my code
//since I am using class names because html do no provide searchbyname on subelements
//I add name to classname 
function createElement(items)
{var item;
 if(items['options'])
 {item=document.createElement('select');
  for(var x=0;x<items['options'].length;x++)
  {var option=document.createElement('option');
   if(items['namevalues']){option.value=items['options'][x];}
   else{option.value=x;}
   option.text=items['options'][x];
   item.appendChild(option);
 }}
 else if(items['tag'])
 {item=document.createElement(items['tag']);
 }
 else
 {alert('need either options or tag')
  return null;
 }
 if(items['name'])
 {
  if(items['class'])
  {items['class']+=' '+items['name'];
  }
  else
  {items['class']=items['name'];
 }}
 keys=Object.keys(items);
 for(var x=0;x<keys.length;x++)
 {if(keys[x]=='options'||keys[x]=='namevalues'||keys[x]=='tag'){continue;}
  if(keys[x]=='innerHTML')
  {item.innerHTML=items[keys[x]];
  }
  else if(keys[x]=='value')
  {item.value=items[keys[x]];
  }
  else
  {item.setAttribute(keys[x],items[keys[x]])
 }}
 return item;
}

