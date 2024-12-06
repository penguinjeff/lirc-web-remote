//example selectbox({'parentid':'Displaydiv','onchange':functionname_to_pass_value to})
function selectbox(data)
{var list=data['list'];
 if(typeof(data['selected'])=='undefined'){data['selected']=-1;}
 if(typeof(data['onchangemore'])=='undefined'){data['onchangemore']='';}
 var selected=data['selected'];
 var parentid=data['parentid'];
 var html='<select onchange="'+data['onchange']+'(this.value,'+JSON.stringify(data).replaceAll('"',"'")+')'+data['onchangemore']+'"><option value="-1">None</option>';
 var x,selectmsg;
 for(x=0;x<list.length;x++)
 {selectmsg='';
  if(x==selected){selectmsg=' selected="selected"'}
  html+='<option value="'+x+'"'+selectmsg+'>'+list[x]+'</option>';
 }
 html+='</select>';
 document.getElementById(parentid).innerHTML=html;
}
