export function build_macro_button(type_item, button_name) {
    // Empty placeholder cell
    if (type_item === "" || button_name === "") {
        const dom = document.createElement("div");
        dom.className = "empty";
        return dom;
    }

    const dom = document.createElement("button");
    dom.className = "button";
    dom.innerHTML = button_name;

    // Inline HTML event attribute (exactly as you requested)
    dom.setAttribute("onpointerdown", "macro_press('"+type_item+"')");

    return dom;
}
