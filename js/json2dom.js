function json2dom({ data, template }) {

    // 1. Render to iHTML (html + events + triggers)
    const ihtml = json2html.render(data, template, { output: "ihtml" });

    // 2. Convert HTML → DOM
    const wrapper = document.createElement("div");
    wrapper.innerHTML = ihtml.html;

    // 3. Hydrate events + triggers
    json2html.hydrate(wrapper, ihtml.events, ihtml.triggers);

    // 4. Return the DOM node
    return wrapper.firstElementChild;
}
