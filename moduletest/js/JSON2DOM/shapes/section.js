// js/JSON2DOM/shapes/section.js
import { registerShape } from "../../JSON2DOM.js";

registerShape("section", function (obj) {
    const sec = obj.section;

    return [
        "div",
        { class: "section" },
        ["h2", {}, sec.title || ""],
        [
            "ul",
            {},
            ...(sec.items || []).map(item => ["li", {}, item])
        ]
    ];
});
