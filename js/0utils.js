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

function dependent(json,onchange,noneOptions,item)
{
 if(!item){item=event.target;}
 if(item.parentNode.childNodes.length>1)
 {item.parentNode.removeChild(item.parentNode.lastChild);
 }
 if(item.value!='')
 {var keys=Object.keys(json);
  console.log('depentand:'+typeof(json[keys[item.value]]));
  item.parentNode.appendChild(createElement({'select':json[keys[item.value]],'onchange':onchange,'noneOptions':noneOptions}));
 }
 if(onchange)
 {setTimeout(onchange,0);
 }
}


//I wanted a way to pass more into a createElement to simplify my code
//since I am using class names because html do no provide searchbyname on subelements
//I add name to classname 

var radioinc=0;
function createElement(items)
{var onchange=''
 var name='';
 var type='unknown';
 if(items['name']){name=items['name']}
 if(items[onchange]){onchange=items[onchange];}
 var item;
 var types=['multiple','dependent','select','tag','radio'];
 var ItemsKeys=new Set(Object.keys(items));
 for(var x=0;x<types.length;x++)
 {if(ItemsKeys.has(types[x])){type=types[x];}
 }
 var keytags=new Set(types.concat(['noneOptions','namevalues','labels','label']));
 if(onchange==''){keytags.add('onchange');}
 switch(type)
 {case 'multiple':
   var keys=Object.keys(items['multiple']);
   var item=document.createElement('div');
   for(var x=0;x<keys.length;x++)
   {var object=JSON.parse(JSON.stringify(items['multiple'][keys[x]]));
    if(items['labels'])
    {if(!object['label'])
     {object['label']=keys[x];
    }}
    if(items['onchange'])
    {object['onchange']=items['onchange'];
    }
    item.appendChild(createElement(object));
   }  
  break;
  case 'dependent':
   item=document.createElement('div');
   subitem=document.createElement('select');
   keytags.add('onchange');
   if(items['noneOptions'])
   {var option=document.createElement('option');
    option.text="None"
    option.value='';
    subitem.appendChild(option);
   }
   var keys=Object.keys(items['dependent']);
   for(var x=0;x<keys.length;x++)
   {var option=document.createElement('option');
    if(items['namevalues']){option.value=keys[x];}
    else{option.value=x;}
    option.text=keys[x];
    subitem.appendChild(option);
   }
   subitem.setAttribute('onchange','dependent('+JSON.stringify(items['dependent'])+',\''+onchange+'\','+items['noneOptions']+')');
   item.appendChild(subitem);
   if(!items['noneOptions'])
   {dependent(items['dependent'],onchange,items['noneOptions'],item.firstChild);
   }
  break;
  case 'radio':
   var name='radio'+radioinc;
   if(items['name'])
   {name=items['name'];
   }
   else
   {radioinc++;
   }
   item=document.createElement('div');
   for(var x=0;x<items['radio'].length;x++)
   {var option=document.createElement('div');
    var optionval=document.createElement('input');
    optionval.setAttribute('type', 'radio');
    optionval.setAttribute('name', name);
    optionval.setAttribute('value',items['radio'][x]);
    var optionlabel=document.createElement('label');
    optionlabel.setAttribute('onclick', "relativeFor('pf')");
    optionlabel.setAttribute('name', items['radio']);
    optionlabel.textContent = items['radio'][x];
    option.appendChild(optionval);
    option.appendChild(optionlabel);
    item.appendChild(option);
   }
  break;
  case 'select':
   item=document.createElement('select');
   if(items['noneOptions'])
   {var option=document.createElement('option');
    option.text="None"
    option.value='';
    item.appendChild(option);
   }
   for(var x=0;x<items['select'].length;x++)
   {var option=document.createElement('option');
    if(items['namevalues']){option.value=items['select'][x];}
    else{option.value=x;}
    option.text=items['select'][x];
    item.appendChild(option);
   }
  break;
  case 'tag':
   item=document.createElement(items['tag']);
  break;
  default:
   console.log('need either multiple, dependent, options or tag')
   console.log(JSON.stringify(items))
   return document.createElement('div');
  break;
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
 if(items['label'])
 {if(typeof(items['label'])=='string' && items['label']!=''){name=items['label'];}
  var container=document.createElement('div');
  var label=document.createElement('label');
  label.textContent = name;
  label.setAttribute('onclick', "relativeFor('pll')");
  container.appendChild(label);
  container.appendChild(item);
  return container;
 }
 return item;
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
  if(!relativeitem.checked){relativeitem.focus();}
}}


