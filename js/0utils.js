//function to create an object from a list where that list item becomes a key with its index being the value
//useful for converting the name to an index
function reverse_index(list)
{var myobject={};
 list.forEach((value, index) => myobject[value] = index);
 return myobject;
}

function index(list)
{var myobject={};
 list.forEach((value, index) => myobject[index] = value);
 return myobject;
}


function optionsOptions(json,onchange,noneOptions,item)
{
 if(!item){item=event.target;}
 if(item.parentNode.childNodes.length>1)
 {item.parentNode.removeChild(item.parentNode.lastChild);
 }
 if(item.value!='')
 {var keys=Object.keys(json);
  item.parentNode.appendChild(createElement({'options':json[keys[item.value]],'onchange':onchange,'noneOptions':noneOptions}));
 }
 if(onchange)
 {setTimeout(onchange,0);
 }
}

function relativeFor(relation)
{// relation is a string of the following represented letters
 // b before/previous
 // n next
 // p parent
 // f first
 // l last
 
 var item=event.target;
 var relativeitem=item;
 var x=0;
 for(x=0;x<relation.length;x++)
 {switch(relation[x])
  {case 'b': relativeitem=relativeitem.previousElementSibling;	break;
   case 'n': relativeitem=relativeitem.nextElementSibling;		break;
   case 'p': relativeitem=relativeitem.parentElement;			break;
   case 'f': relativeitem=relativeitem.firstChild;				break;
   case 'l': relativeitem=relativeitem.lastChild;				break;
 }}
 console.log("TagName:"+relativeitem.tagName);
 console.log("name:"+relativeitem.getAttribute('name'));
 if(relativeitem.type)
 {
  console.log("type:"+relativeitem.type);
  relativeitem.click();
  if(!relativeitem.checked){relativeitem.select();}
}}


//I wanted a way to pass more into a createElement to simplify my code
//since I am using class names because html do no provide searchbyname on subelements
//I add name to classname 
function createElement(items)
{var onchange=''
 if(items[onchange]){onchange=items[onchange];}
 var item;
 var keytags=new Set(['optionsOptions','options','tag','noneOptions','namevalues']);
 if(onchange==''){keytags.add('onchange');}
 if(items['optionsOptions'])
 {item=document.createElement('div');
  subitem=document.createElement('select');
  keytags.add('onchange');
  if(items['noneOptions'])
  {var option=document.createElement('option');
   option.text="None"
   option.value='';
   subitem.appendChild(option);
  }
  var keys=Object.keys(items['optionsOptions']);
  for(var x=0;x<keys.length;x++)
  {var option=document.createElement('option');
   if(items['namevalues']){option.value=keys[x];}
   else{option.value=x;}
   option.text=keys[x];
   subitem.appendChild(option);
  }
  subitem.setAttribute('onchange','optionsOptions('+JSON.stringify(items['optionsOptions'])+',\''+onchange+'\','+items['noneOptions']+')');
  item.appendChild(subitem);
  if(!items['noneOptions'])
  {
   optionsOptions(items['optionsOptions'],onchange,items['noneOptions'],item.firstChild);
  }
 }
 else if(items['options'])
 {item=document.createElement('select');
  if(items['noneOptions'])
  {var option=document.createElement('option');
   option.text="None"
   option.value='';
   item.appendChild(option);
  }
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
 {
  console.log('need either optionsOptions options or tag')
  console.log(JSON.stringify(items))
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
 var keys=Object.keys(items);
 for(var x=0;x<keys.length;x++)
 {if(keytags.has(keys[x])){continue;}
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
