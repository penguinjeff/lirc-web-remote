import { build_module } from "./build_module.js"

function build_remote(db,activity)
{
/*
 * previously known as build activity
 * but from a user perspective this is a remote
 * a display has modules
 * modules go with a remote
 * a remote has remote codes for a particular device
 *
 */
let remote_list=activity[0];
let display=activity[1];

let remote_dom=document.createElement("div");
remote_dom.className="container"
for (row in display){
  row_dom=document.createElement("div")
  row_dom.className="container-1";
  for (column in row){
    column_dom=document.createElement("div")
    column_dom.className="container-2"
    for (module_pair in colum){
      let state={
        module_name:module_pair[0],
        remote_index:module_pair[1],
        used_buttons:used_buttons[module_pair[1]],
        dom: document.createElement("div"),
      }
      if(build_module(db,state)){column.appendChild(state.dom);break;}
    }
    row_dom.appendChild();
  }
  remote_dom.appendChild(row_dom);
}

/*
will replace:
used_buttons=[...used_buttons, ...build_module(remote,remote_buttons,module,idtag,modules)];

with:
const state = {
  used_buttons: [],
  dom: document.createElement("div")
};
build_module(db, module_name, state);

*/


  function populate_modules(activity_remotes,activity_modules)
  {
    function build_catchall(remote,remote_buttons,used_buttons,idtag,module_options)
    {
      const i=catch_all_instances.length
      catch_all_instances.push({});
      if(used_buttons.length>0)
      {
        build_catchall(
          remote,
          //remove all used buttons from what we send to make it easier
          remote_buttons.filter(item => !used_buttons.includes(item)),
                       [],
                       idtag,
                       module_options);
        return;
      }
      let {button_columns=5,button_rows=3,alldef="unused"}=module_options;
      catch_all_instances[i]["remote"]=remote;
      catch_all_instances[i]["button_map"]={};
      catch_all_instances[i]["rows"]=button_rows;
      catch_all_instances[i]["columns"]=button_columns;
      catch_all_instances[i]["button_map"][""]="";
      for(const button of remote_buttons)
      {
        let remote_buttons_name=button.replace(new RegExp("^KEY_","i"), "").replace(new RegExp("^BTN_","i"), "");
        catch_all_instances[i]["button_map"][remote_buttons_name]=button;
      }
      display_catchall(idtag,i,0);
    }
    //----------------- Internalizing specialized function
    console.log("populate_modules");
    let location='custom';
    // console.log(activity_modules);
    for(const remote of activity_remotes)
    {
      let remote_buttons=remotes[remote];
      let catchall_instances=[];
      // console.log(remote_buttons)
      let remote_custom_modules=activity_modules["remotes"][remote]["modules"];
      let used_buttons=[];
      for(const remote_custom_module of remote_custom_modules)
      {
        let module=remote_custom_module[0];
        let idtag=remote_custom_module[1];
        used_buttons=[...used_buttons, ...build_module(remote,remote_buttons,module,idtag,modules)];
      }
      let remote_default_modules=activity_modules["remotes"][remote]["default_modules"];
      for(const remote_default_module of remote_default_modules)
      {
        let module=remote_default_module[0];
        let idtag=remote_default_module[1];
        if(module==="catchall"){catchall_instances.push([...remote_default_module]);continue;}
        used_buttons=[...used_buttons, ...build_module(remote,remote_buttons,module,idtag,default_modules)];
      }
      // console.log("used_buttons:");
      // console.log(used_buttons);
        for(const catchall_instance of catchall_instances)
        {
          let module_options=catchall_instance[2];
          let idtag=catchall_instance[1];
          build_catchall(remote,remote_buttons,used_buttons,idtag,module_options)
        }
      }
      module_types=["modules","default_modules"];
      for(const module_type of module_types)
      {
        for(const activity_module of activity_modules["other"][0]["modules"])
        {
          //function build_module(remote_buttons,module,idtag,modules_obj)
          let module=activity_module[0];
          let idtag=activity_module[1];
          build_module([],module,idtag,modules);
        }
      }
    }
    //-----------internalizing function
    //console.log("activity_display");
    let remote_location=createElement({"tag":"div","class":"container"});
    var activity_modules={"remotes":[],"other":[{"default_modules":[],"modules":[]}]};
    const {remotes:activity_remotes,display}=activity;
    // console.log(default_modules_list);
    for(const remote of activity_remotes)
    {
      activity_modules["remotes"][remote]={"default_modules":[],"modules":[]};
    }
    let module_rows=display["modules"];
    let module_counter={}
    for(const module_column of module_rows)
    {
      let module_row_location=createElement({"tag":"div","class":"container-1"});
      for(const module_item of module_column)
      {
        let module_index=-1
        let location="other";
        let location_index=0;
        let module="";
        let module_options={};
        let module_type="other"
        if(module_item.length<1)
        {module="None";
        }
        else
        {
          module=module_item[0];
          if(!module_counter[module]){module_counter[module]=1;}else{module_counter[module]++;}
          if(module_item.length>1 && typeof(module_item[1]==="number") && module_item[1] < activity_remotes.length)
          {
            location="remotes";
            location_index=activity_remotes[module_item[1]];
            if(module_item.length>2){module_options=module_item[2];}
          }
          // console.log(location+":"+location_index+":"+module);
          module_index=default_modules_list.indexOf(module);
          if(!(module_index===-1)){module_type="default_modules";}
          module_index=modules_list.indexOf(module);
          if(!(module_index===-1)){module_type="modules";}
        }
        let idtag=module+":"+module_counter[module]+":"+location+":"+location_index;
        if(module_type==="default_modules"||module_type==="modules")
        {
          activity_modules[location][location_index][module_type].push([module,idtag,module_options]);
        }
        activity_modules[location][location_index]["default_modules"]
        let theclass=module;
        // console.log("module:"+module);
        if(module_type==="default_modules")
        {
          theclass=default_modules[module]["class"];
          //  console.log(default_modules[module])
        }
        if(module_type==="modules")
        {
          theclass=modules[module]["class"];
          // console.log(modules[module])
        }
        let module_location=createElement({"tag":"div","id":idtag,"class":theclass});
        // add module_location to row
        module_row_location.appendChild(module_location);
      }
      // add row to remote_location
      remote_location.appendChild(module_row_location);
    }
    let base=document.getElementById("remote_location");
    base.innerHTML=""
    base.appendChild(createElement({"tag":"div","class":"container"}).appendChild(remote_location))
    // console.log(module_counter);
    populate_modules(activity_remotes,activity_modules);
















  return state.dom;
}
