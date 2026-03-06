export function buildRadio(items) {
   if(name==''){name='radio'+(radioinc++);}
   item=document.createElement('div');
   for(let x=0;x<items['radio'].length;x++)
   {let option=document.createElement('div');
    let optionval=document.createElement('input');
    optionval.setAttribute('type', 'radio');
    optionval.setAttribute('name', name);
    optionval.setAttribute('value',items['radio'][x]);
    let optionlabel=document.createElement('label');
    optionlabel.setAttribute('onclick', "relativeFor('pf')");
    optionlabel.setAttribute('name', items['radio']);
    optionlabel.textContent = items['radio'][x];
    option.appendChild(optionval);
    option.appendChild(optionlabel);
    item.appendChild(option);
