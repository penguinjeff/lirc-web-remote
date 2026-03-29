// js/JSON2DOM/shapes/text.js
import { registerShape } from "../../JSON2DOM.js";

registerShape("text", function (obj) {
    return ["span", {}, obj.text];
});
