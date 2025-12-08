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


function finddepth(item)
{var ref=item.parentNode;
 var max=ref.childNodes.length;
 ref=ref.firstChild;
 var x=1;
 while(ref!=item&&x<max){x++;ref=ref.nextElementSibling;}
 return x;
}

function select(item)
{
 if(!item){item=event.target;}
 var parent=item.parentNode;
 var selected=item.options[item.selectedIndex];
 var data=selected.getAttribute('data');
 var onchange=selected.getAttribute('onchange');
 var noneOptions=selected.getAttribute('noneoptions');
 var depth=finddepth(item);
 while(parent.childNodes.length>depth)
 {parent.removeChild(parent.lastChild);
 }
 if(selected.value!='')
 {
 var newselectproperties={};
  newselectproperties['select']=JSON.parse(data);
  newselectproperties['onchange']=onchange;
  newselectproperties['noneoptions']=noneOptions;
//  newselectproperties['holddiv']=true;
  var newselect=createElement(newselectproperties);
  parent.appendChild(newselect);
//  select(parent.lastChild);
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
{var onchange='';
 var name='';
 var type='unknown';
 var hassubs=false;
 if(items['name']){name=items['name']}
 if(items['onchange']){onchange=items[onchange];}
 var item;
 var types=['multiple','select','tag','radio'];
 var ItemsKeys=new Set(Object.keys(items));
 for(var x=0;x<types.length;x++)
 {if(ItemsKeys.has(types[x])){type=types[x];}
 }
 var keytags=new Set(types.concat(['noneoptions','namevalues','labels','label','holddiv']));
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
   var noneOptions=false;
   if(items['noneoptions'])
   {if(items['noneoptions']==true||items['noneoptions']=='true')
    {noneOptions=true;
   }}
   if(noneOptions)
   {var option=document.createElement('option');
    option.text="None"
    option.value='';
    item.appendChild(option);
   }
   var keys=[];
   if(Array.isArray(items['select'])){keys=items['select'];}
   else
   {var subkeys=Object.keys(items['select']);
    for(var x=0;x<subkeys.length;x++)
    {var object={};
     object[subkeys[x]]=items['select'][subkeys[x]];
     keys.push(object);
   }}
   for(var x=0;x<keys.length;x++)
   {var option=document.createElement('option');
    var optionshow='';
    if(typeof(keys[x])=='string'){optionshow=keys[x]}
    else
    {optionshow=Object.keys(keys[x])[0];
     hassubs=true;
     var onchange='';
     if(items['onchange']){onchange=items['onchange'];}
     option.setAttribute('data',JSON.stringify(keys[x][optionshow]));
     option.setAttribute('onchange',onchange);
     option.setAttribute('noneoptions',noneOptions);
    }
    if(items['indexvalues']){option.value=x;}
    else{option.value=optionshow;}
    option.text=optionshow;
    item.appendChild(option);
   }
   if(hassubs)
   {keytags.add('onchange');
    item.setAttribute('onchange','select()');
   }
  break;
  case 'tag':
   item=document.createElement(items['tag']);
  break;
  default:
   console.log('need either select, multiple, options or tag');
   console.log(JSON.stringify(items));
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
 if(!items['holddiv'])
 {if(items['label'])
  {if(typeof(items['label'])=='string' && items['label']!=''){name=items['label'];}
   var container=document.createElement('div');
   var label=document.createElement('label');
   label.textContent = name;
   label.setAttribute('onclick', "relativeFor('pll')");
   container.appendChild(label);
   container.appendChild(item);
   if(hassubs){select(item);}
   return container;
  }
  if(hassubs)
  {var container=document.createElement('div');
   container.appendChild(item);
   select(item);
   return container;
 }}
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


