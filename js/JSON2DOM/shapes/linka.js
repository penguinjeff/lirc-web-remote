// js/JSON2DOM/shapes/linka.js
import { registerShape } from "../../JSON2DOM.js";

registerShape("linka", function (obj) {
    const link = obj.linka;

    let label = link.label || link.url;
    if (label.includes("{url}")) {
        label = label.replace("{url}", link.url);
    }

    return [
        "a",
        {
            href: link.url,
            target: "_blank",
            rel: "noopener"
        },
        label
    ];
});
