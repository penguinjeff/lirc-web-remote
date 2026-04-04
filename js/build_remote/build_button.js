export function build_button(remote = "", button_name = "", button = "") {
    // Empty placeholder cell
    if (button_name === "") {
        const dom = document.createElement("div");
        dom.className = "empty";
        return dom;
    }

    const dom = document.createElement("button");
    dom.className = "button";
    dom.innerHTML = button_name;

    const common="('"+remote+"','"+button+"',this,event)"
    const presshold="presshold"+common;
    const release="release"+common;
    // Inline HTML event attributes (exactly as you requested)
    dom.setAttribute("onpointerdown", presshold);
    dom.setAttribute("onpointerup", release);
    dom.setAttribute("onpointerleave", release);

    return dom;
}
