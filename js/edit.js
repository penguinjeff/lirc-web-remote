var version=2;
var savedata={};
const Edit=
{
 savings:{},
 modes: ["Activities","Macros","Modules","Displays"],
 display()
 {var box;
  box=document.getElementById('choose');
  box.innerHTML='';
  box.appendChild(createElement(
  {'options':this.modes,
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
 load()
 {
 },
 save()
 {var localdata={};
  savedata={};
  for(x=0;x<this.modes.length;x++)
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
  fetch(request)
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
