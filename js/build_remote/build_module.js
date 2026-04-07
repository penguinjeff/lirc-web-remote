import { build_button } from "./build_buttom.js";
import { build_macro_button } from "./build_macro_button.js";

export function build_module(db,state) {
  const module = db["modules"][state["module_name"]] ||
  db["default_modules"][state["module_name"]];

  if (!module || !module.needed) return false;

  const remote = db.remote;
  const remote_buttons = db.remote_buttons;

  // Must have all needed buttons
  if (!module.needed.every(item => remote_buttons.includes(item))) {
    return false;
  }

  let used_buttons = [];

  // Clear the container
  state.dom.innerHTML = "";

  // Build rows
  for (const row of module.buttons) {
    const itemrow = createElement({ tag: "div", class: "container-2" });

    for (const column of row) {
      const [button_name, button_type, type_item] = column;

      switch (button_type) {
        case "ircode":
          if (remote_buttons.includes(type_item)) {
            used_buttons.push(type_item);
            itemrow.appendChild(
              build_button(remote, button_name, type_item)
            );
          } else if (!module.skip) {
            itemrow.appendChild(build_button());
          }
          break;

        case "macro":
          if (db["macros"][type_item]) {
            itemrow.appendChild(
              build_macro_button(type_item, button_name)
            );
          } else if (!module.skip) {
            itemrow.appendChild(build_button());
          }
          break;
      }
    }

    state.dom.appendChild(itemrow);
  }

  // Merge used buttons into state
  state.used_buttons = [...state.used_buttons, ...used_buttons];

  return true;
}
