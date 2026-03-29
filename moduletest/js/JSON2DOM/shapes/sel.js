// js/JSON2DOM/shapes/sel.js
import { registerShape } from "../../JSON2DOM.js";

registerShape("sel", function (obj) {
    const options = obj.sel || [];

    return [
        "select",
        obj.attrs || {},
        ...options.map(opt => ["option", { value: opt }, opt])
    ];
});
