/*js/build_remote/build_remote.js*/

function build_remote(db, activity) {

function build_module(db,state) {

function build_macro_button(button_name,button_display) {
    // Empty placeholder cell
    if (button_name === "") {
        const dom = document.createElement("div");
        dom.className = "empty";
        return dom;
    }

    const dom = document.createElement("button");
    dom.className = "button";
    dom.innerHTML = button_display;

    // Inline HTML event attribute (exactly as you requested)
    dom.setAttribute("onpointerdown", "macro_press('"+button_name+"')");

    return dom;
}

function build_button(remote_name = "", button_name = "", button_display = "") {
    // Empty placeholder cell
    if (button_name === "") {
        const dom = document.createElement("div");
        dom.className = "empty";
        return dom;
    }

    const dom = document.createElement("button");
    dom.className = "button";
    dom.innerHTML = button_display;

    const common="('"+remote_name+"','"+button_name+"',this,event)"
    const presshold="presshold"+common;
    const release="release"+common;
    // Inline HTML event attributes (exactly as you requested)
    dom.setAttribute("onpointerdown", presshold);
    dom.setAttribute("onpointerup", release);
    dom.setAttribute("onpointerleave", release);

    return dom;
}


  console.log(state)
  const remote_buttons = db.remotes[state.remote_name] || [];
  const module = db.modules[state.module_name] || get_default_modules()[state.module_name];
  if (!module) return false;

  // Must have all needed buttons
  if (!module.needed.every(item => remote_buttons.includes(item))) {
    return false;
  }

  // Clear the container
  state.dom.innerHTML = "";

  // Build rows
  for (const row of module.buttons) {
    const itemrow = document.createElement("div");
	itemrow.className="container-2";

    for (const column of row) {
      const [button_display, button_type, button_name] = column;

      switch (button_type) {
        case "ircode":
          if (remote_buttons.includes(button_name)) {
            const index=state.unused_buttons.indexOf(button_name);
            if (index !== -1) {
              state.unused_buttons.splice(index, 1);
            }
            itemrow.appendChild(
              build_button(state.remote_name, button_name, button_display)
            );
          } else if (!module.skip) {
            itemrow.appendChild(build_button());
          }
          break;

        case "macro":
          if (db["macros"][button_name]) {
            itemrow.appendChild(
              build_macro_button(button_name, button_display)
            );
          } else if (!module.skip) {
            itemrow.appendChild(build_button());
          }
          break;
      }
    }

    state.dom.appendChild(itemrow);
  }
  return true;
}

function build_catchall(remote_name,unused_buttons,state)
{
  console.log(state)
  console.log(remote_name)
  console.log(unused_buttons)
  state.dom.innerHTML="CATCHALL"
  return;
  // console.log("display_catchall");
  const {dom,button_rows,button_columns}=state;
  let sorted=unused_buttons.sort();
  const multiple_of_rows=Math.ceil(sorted.length/button_rows)*nutton_rows;
  const padding=multiple_of_rows-sorted.length;
  sorted=sorted.concat(Array(padding).fill(""));
  if(sorted.length<=(rows*columns)){index=0}
  if(index<0){index=((sorted.length/rows)-1);}
  if(index+1>(sorted.length/rows)){index=0;}
  const start_index=index;

  let itemrows=[];
  Array.from({ "length": (button_rows+1) }, () => itemrows.push(createElement({"tag":"div","class":"container-2"})));
  let z=0;
  for(let x=0;x<button_columns;x++)
  {
    for(let y=0;y<button_rows;y++)
    {
      let button_name=sorted[(index*rows+y)];
      itemrows[y].appendChild(build_button(remote_name,button_name,button_name));
      z++;
    }
    index++;
    if(z>=sorted.length){break;}
    if(index+1>(sorted.length/button_rows)){index=0;}
    // console.log("index:"+index);
  }
  if(sorted.length>(button_rows*button_columns))
  {

    itemrows[button_rows].appendChild(createElement({"tag":"button","class":"button","onclick":"display_catchall('"+idtag+"',"+instance+","+(start_index-1)+")","innerHTML":"&lt;"}));
    for(let y=0;y<columns-2;y++){itemrows[rows].appendChild(create_button(remote,"",""));}
    itemrows[rows].appendChild(createElement({"tag":"button","class":"button","onclick":"display_catchall('"+idtag+"',"+instance+","+(start_index+1)+")","innerHTML":"&gt;"}))
  }
  let common=createElement({"tag":"div","class":"common"});
  for(itemrow of itemrows){common.appendChild(itemrow);}
  const base=document.getElementById(idtag);
  base.innerHTML="";
  base.appendChild(common);
}

  /*
   * activity[0] = remote_list
   * activity[1] = display layout (rows → columns → module pairs)
   */
  console.log(activity)
  const remote_list = [...activity["remotes"],""]
  const display = db["displays"][activity["display"]]||get_default_display();

  if(remote_list.length===0){
    let dom=document.createElement("div");
    dom.innerHTML=JSON.stringify(activity)
    return dom;
  }
  const unused_buttons = remote_list.map(remote_name =>
  [...(db.remotes[remote_name] || [])]
  );
  const catch_alls = remote_list.map(() => []);

  const remote_dom = document.createElement("div");
  remote_dom.className = "container";

  for (const row of display) {
    const row_dom = document.createElement("div");
    row_dom.className = "container-1";

    for (const column of row) {
      const column_dom = document.createElement("div");
      column_dom.className = "container-2";

      for (const module_pair of column) {
		let [module_name,remote_index=(remote_list.length-1)]=module_pair;

        const state = {
          module_name: module_pair[0],
          remote_name: remote_list[remote_index],
          unused_buttons: unused_buttons[remote_index],
          dom: document.createElement("div"),
        };
        if (module_name === "catchall") {
          catch_alls[remote_index].push({
            dom: state.dom,
            ...(module_pair[2] || {})
          });
          column_dom.appendChild(state.dom);
          continue;
        }
        // If module builds successfully, append and stop trying other modules
        if (build_module(db, state)) {
          column_dom.appendChild(state.dom);
          break;
        }
      }

      row_dom.appendChild(column_dom);
    }

    remote_dom.appendChild(row_dom);
  }
  for (let i = 0; i < remote_list.length; i++) {
    catch_alls[i].forEach((entry) => {
      build_catchall(remote_list[i], unused_buttons[i], entry);
    });
  }
  return remote_dom;
}
