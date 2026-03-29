// js/JSON2DOM.js
export const JSON2DOM = {
    shapes: {}
};

export function registerShape(name, fn) {
    JSON2DOM.shapes[name] = fn;
    console.log("Shape registered:", name);
}

export function json2dom(obj) {
    return make(obj);
}

function make(obj) {
    if (obj == null) return null;

    if (typeof obj === "string" || typeof obj === "number") {
        return document.createTextNode(String(obj));
    }

    if (Array.isArray(obj)) {
        if (typeof obj[0] === "string") {
            const [tag, maybeAttrs, ...rest] = obj;
            const el = document.createElement(tag);

            if (maybeAttrs && typeof maybeAttrs === "object" && !Array.isArray(maybeAttrs)) {
                for (const [k, v] of Object.entries(maybeAttrs)) {
                    el.setAttribute(k, v);
                }
                rest.forEach(child => {
                    const node = make(child);
                    if (node) el.appendChild(node);
                });
            } else {
                [maybeAttrs, ...rest].forEach(child => {
                    const node = make(child);
                    if (node) el.appendChild(node);
                });
            }

            return el;
        }

        const frag = document.createDocumentFragment();
        obj.forEach(item => {
            const node = make(item);
            if (node) frag.appendChild(node);
        });
        return frag;
    }

    if (typeof obj === "object") {
        for (const key in obj) {
            const fn = JSON2DOM.shapes[key];
            if (fn) {
                const expanded = fn(obj);
                return make(expanded);
            }
        }
    }

    return document.createTextNode(String(obj));
}
