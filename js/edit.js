var version=2;
const Edit=
{
 savings:{},
 modes: ["Activities","Macros","Modules","Displays","Devices"],
 display()
 {var html='<select id="EditSeclect" onchange="Edit.selected()">';
  var selectedmsg='';
  var x;
  for(x=0;x<this.modes.length;x++)
  {if(this.modes[x]==this.mode){selectedmsg=' selected="selected"'}else{selectedmsg=''}
   html+='<option value="'+this.modes[x]+'"'+selectedmsg+'>'+this.modes[x]+'</option>';
  }
  html+='</select>';
  html+='<button onclick="Edit.save()">Save</button>'
  html+='<div id="EditItemDisplay"></div>';
  html+='<div id="EditDisplay"></div>';
  html+='<div id="data"></div>';
  document.getElementById('Display').innerHTML=html;
  this.selected()
 },
 load()
 {
 },
 save()
 {var data={};
  for(x=0;x<this.modes.length;x++)
  {data[this.modes[x]]=eval(this.modes[x]+'.save()')
  }
  document.getElementById('data').innerHTML='<pre>'+JSON.stringify(data,null,2)+'</pre>';
  var request = new Request('save.php?version='+version,
  {method: 'POST',
   mode: "same-origin",
   credentials: "same-origin",
   headers: { 'Content-Type': 'application/json'},
   body: JSON.stringify(data)
  });
  fetch(request)
   .then(response => {
     if (!response.ok) {
       throw new Error("Network response was not ok");
     }
     return response.text();
   })
   .then(data => {
     // console.log(data); // Log the JSON response
    // Process the data
  })
   .catch(error => {
    // console.error("Fetch error:", error);
  });
 },
 selected()
 {editmode=document.getElementById('EditSeclect').value;
  var x;
  for(x=0;x<this.modes.length;x++)
  {if(editmode==this.modes[x])
   {eval(this.modes[x]+'.display()');
}}}}
