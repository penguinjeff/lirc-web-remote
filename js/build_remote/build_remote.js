/*js/build_remote/build_remote.js*/

function build_remote(db, activity) {
  /*
   * activity[0] = remote_list
   * activity[1] = display layout (rows → columns → module pairs)
   */

  const remote_list = activity["remotes"];
  const display = db["displays"][activity["display"]]||get_default_display();

  if(remote_list.length===0){
    let dom=document.createElement("div");
    dom.innerHTML=JSON.stringify(activity)
    return dom;
  }
  const used_buttons = remote_list.map(() => []); // one array per remote

  const remote_dom = document.createElement("div");
  remote_dom.className = "container";

  for (const row of display) {
    const row_dom = document.createElement("div");
    row_dom.className = "container-1";

    for (const column of row) {
      const column_dom = document.createElement("div");
      column_dom.className = "container-2";

      for (const module_pair of column) {
        const state = {
          module_name: module_pair[0],
          remote_list: remote_list,
          remote_index: module_pair[1],
          used_buttons: used_buttons[module_pair[1]],
          dom: document.createElement("div"),
        };

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

  return remote_dom;
}
