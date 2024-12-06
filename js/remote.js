var displayed_buttons=[];

function RemoteButton()
{this.myid=displayed_buttons.length;
 this.display="Edit"
 this.remote="";
 this.button="";
 this.width="5%";
 this.height="5%";
 this.divclass=""
 displayed_buttons.push(this);
}

RemoteButton.prototype.display_buttons=function(parentid)
{var html='';
 for(id=0;id<displayed_buttons.length;id++)
 {html+='<div id="button_'+id+'">'+button.display+'</div>'
 }
 document.getElementById(parentid).innerHTML+='<div id='+id+'>'
 id=0;
 for(id=0;id<displayed_buttons.length;id++)
 {button.set(id);
}}

RemoteButton.prototype.edit=function(parentid)
{var html="";
 for(id=0;id<displayed_buttons.length;id++)
 {html+='<div id="button_'+id+'">'+button.display+'</div>'
 }
 document.getElementById(parentid).innerHTML+='<div id='+id+'>'
 for(id=0;id<displayed_buttons.length;id++)
 {button.set(id);
}}

const Remotes=
{
 remote_index: [],
 remotes: [],
 init()
 {var id = Math.round(+new Date()/1000);
  fetch("irsend.php?arg1=list&arg2=&arg3=&id="+id)
  .then(response =>
  {if(!response.ok)
   {throw new Error("Network response was not ok");
   }
   return response.json();
  })
  .then(data =>
  {
    // console.log(data); // Log the JSON response
    // Process the data
   this.remotes=data;
   this.remote_index=[];
   for(key in getdata["remotes"]){remote_index.push(key);}
  })
  .catch(error =>
  {
    // console.error("Fetch error:", error);
  });
},
 updateSelected()
 {for(x=0;x<remote_selectors.length;x++)
  {remote_selectors[x].update();
}}}

var remote_selectors=[];
function RemoteSelector(){
this.myid=remote_selectors.length;
this.remote="";
this.button="";
this.timeout=300;
this.myid=remote_selectors.length;
remote_selectors.push(this);
}

RemoteSelector.prototype.displayButton=function()
{
 var html='';
 html+='<div id="buttondiv_'+this.myid+'">';
 html+=this.redrawButtonHelper();
 html+='</div>'
 return html;
}

RemoteSelector.prototype.redrawButton=function()
{if(document.getElementById('buttondiv_'+this.myid))
 {document.getElementById('buttondiv_'+this.myid).innerHTML=this.redrawButtonHelper();
}}

RemoteSelector.prototype.redrawButtonHelper=function()
{var selected='';
 var html='<select id="key_'+this.myid+'" onchange="Remotes.updateSelected()>';
 html+='<option value="-1">none</option>';
 if(Remotes.remotes[this.remote])
 {for(x=0;x<Remotes.remotes[this.remote].lenght;x++)
  {if(Remotes.remotes[this.remote][x]==this.button){selected=' selected="selected"';}else{selected='';}
   html+='<option value="'+x+'"'+selected+'>'+Remotes.remote_index[x]+'</option>';
 }}
 html+='</select>';
 return html;
}

RemoteSelector.prototype.displayTimeout=function()
{
 var html='';
 html+='<div id="timeoutdiv_'+this.myid+'">';
 html+=this.redrawTimeoutHelper();
 html+='</div>'
 return html;
}

RemoteSelector.prototype.redrawTimeoutHelper=function()
{var html='<input id="timeout_'+this.myid+'" type="number" value="'+this.timeout+'" onchange="Remotes.updateSelected()">';
 return html;
}

RemoteSelector.prototype.redrawTimeout=function()
{if(document.getElementById('timeoutdiv_'+this.myid))
 {document.getElementById('timeoutdiv_'+this.myid).innerHTML=this.redrawTimeoutHelper();}
}

RemoteSelector.prototype.displayRemote=function()
{var html='<div id="remotediv_'+this.myid+'">';
 html+=this.updateRemoteHelper();
 html+='</div>'
 return html;
}

RemoteSelector.prototype.updateRemote=function()
{if(document.getElementById('remotediv_'+this.myid))
 {document.getElementById('remotediv_'+this.myid).innerHTML=this.redrawButtonHelper();
}}

RemoteSelector.prototype.updateRemoteHelper=function()
{var selected='';
 var html='<select id="remote_'+this.myid+'" onchange="Remotes.updateSelected()">';
 html+='<option value="-1">none</option>';
 for(x=0;x<Remotes.remote_index.lenght;x++)
 {if(Remotes.remote_index[x]==this.remote){selected=' elected="selected"';}else{selected='';}
  html+='<option value="'+x+'"'+selected+'>'+Remotes.remote_index[x]+'</option>';
 }
 html+='</select>';
}

RemoteSelector.prototype.updateSelected=function()
{
}

window.onload=Remotes.init();
