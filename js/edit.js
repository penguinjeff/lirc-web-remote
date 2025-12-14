var version=3;
var savedata={};
const Edit=
{
 load_data:{},
 savings:{},
 modes: ["Activities","Macros","Modules","Displays"],
 display()
 {var box;
  box=document.getElementById('choose');
  box.innerHTML='';
  box.appendChild(createElement(
  {'select':this.modes,
   'value':0,
   'onchange':'Edit.update(this)',
   'id':'EditSeclect'
  }));
  box=document.getElementById('Display');
  box.appendChild(createElement(
  {'tag':'button',
   'onclick':'Edit.save()',
   'innerHTML':'Save'
  }));
  box.appendChild(createElement(
  {'tag':'div',
   'id':'EditDisplay'
  }));
  box.appendChild(createElement(
  {'tag':'div',
   'id':'EditItemDisplay'
  }));
  box.appendChild(createElement(
  {'tag':'div',
   'id':'data'
  }));
  this.update(document.getElementById('EditSeclect'))
 },

 load(localdata)
 {this.load_data=JSON.parse(JSON.stringify(localdata));
  for(var x=0;x<this.modes.length;x++)
  {if(this.modes[x]=='Macros')
   {data[this.modes[x].toLowerCase()]=JSON.parse(JSON.stringify(this.load_data[this.modes[x].toLowerCase()]));
   }
   else
   {var y=0;
    while(y<data[this.modes[x].toLowerCase()].length)
    {if(data[this.modes[x].toLowerCase()][y]['editable'])
     {data[this.modes[x].toLowerCase()].splice(y,1);
     }
     else
     {y++;
    }}
    for(y=0;y<this.load_data[this.modes[x].toLowerCase()].length;y++)
    {data[this.modes[x].toLowerCase()].push(this.load_data[this.modes[x].toLowerCase()][y])
  }}}
 },

 save()
 {var localdata={};
  savedata={};
  for(var x=0;x<this.modes.length;x++)
  {localdata[this.modes[x]]=eval(this.modes[x]+'.save()')
  }
  document.getElementById('data').innerHTML='<pre>'+JSON.stringify(savedata,null,2)+'</pre>';
  var request = new Request('save.php?version='+version,
  {method: 'POST',
   mode: "same-origin",
   credentials: "same-origin",
   headers: { 'Content-Type': 'application/json'},
   body: JSON.stringify(savedata)
  });
  fetch(relativepath+request)
   .then(response => {
     if (!response.ok) {
       throw new Error("Network response was not ok");
     }
     return response.text();
   })
   .then(localdata => {
     // console.log(data); // Log the JSON response
    // Process the data
  })
   .catch(error => {
    // console.error("Fetch error:", error);
  });
 },
 update(item)
 {document.getElementById('EditItemDisplay').innerHTML='';
  document.getElementById('EditDisplay').innerHTML='';
  eval(this.modes[item.value]+'.display()');
 }
}

function Edit_init()
{var id = Math.round(+new Date()/1000);
 fetch(relativepath+'load.php?version='+version)
 .then(response =>
 {if (!response.ok) 
  {throw new Error("Network response was not ok");
  }
  return response.json();
 })
 .then(localdata => 
 {
  Edit.load(JSON.parse(JSON.stringify(localdata)));
 })
 .catch(error => {});
}

window.onload=Edit_init();
