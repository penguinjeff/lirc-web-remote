var Displays=
{display(displayname)
 {if(typeof(displayname)=='undefined')
  {alert('Displays Edit');
  }
  else
  {var displayin=document.getElementById('remote');
   var color,count,width,middle,leftover,itemwidth;
   displayin.innerHTML='';
   for(var x=0;x<data['displays'][displayname]['modules'].length;x++)
   {//rows
    box=createElement(
    {'tag':'div',
     'class':'container-1'
    });
    count=data['displays'][displayname]['modules'][x].length;
    width=Math.floor((1/count)*100);
    middle=Math.floor(count/2)+1;
    leftover=100-(width*count);
    for(var y=0;y<data['displays'][displayname]['modules'][x].length;y++)
    {if(x%2){if(y%2){color='green';}else{color='red';}}
     else{if(y%2){color='blue';}else{color='orange';}}
     itemwidth=width;
     if(y==middle){itemwidth+=leftover;}
     box.appendChild(createElement(
     {'tag':'div',
      'id':data['displays'][displayname]['modules'][x][y][0],
      'name':data['displays'][displayname]['modules'][x][y][0]
     }));
    }
    displayin.appendChild(box);
 }}},
 load()
 {var x=0;
  while(x<data['displays'].length)
  {if(data['displays'][x]['editable'])
   {data['displays'].splice(x,1);
   }
   else
   {x++;
  }}
  for(x=0;x<data_load['displays'].length;x++)
  {data['displays'].push(data_load['displays'][x])
  }
 },
 save()
 {alert('Saving Displays')
  var temp=[];
  for(var x=0;x<data['displays'];x++)
  {if(data['displays'][x]['editable'])
   {temp.push(JSON.parse(JSON.stringify(data['displays'][x])));
  }}
  savedata['displays']=temp;
 }
 //###### End Displays Class ###########
}


function Display_init()
{
data['displays']={};
data['displays']['Default']={'editable':false,'modules':[
 [['remotename']],
 [['power']],
 [['catchall']],
 [['common']],
 [['colors']],
 [['volume'],['directions'],['channels']],
 [['navigatorpads'],['navigator'],['navigatorpads']],
 [['numberpads'],['numbers'],['numberpads']]
]};
}

window.onload=Display_init();
