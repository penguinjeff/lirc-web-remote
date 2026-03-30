/* js/cjson2dom.js */

const CJSON2DOM = {
    shapes: {}
};

function registerShape(name, fn) {
    CJSON2DOM.shapes[name] = fn;
    console.log("Shape registered:", name);
}

function cjson2dom(obj) {
    return make(obj);
}

function make(obj) {
    if (obj == null) return null;

    // Text nodes
    if (typeof obj === "string" || typeof obj === "number") {
        return document.createTextNode(String(obj));
    }

    // Arrays
    if (Array.isArray(obj)) {
        // ["tag", {attrs}, children...]
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

        // Array of items → fragment
        const frag = document.createDocumentFragment();
        obj.forEach(item => {
            const node = make(item);
            if (node) frag.appendChild(node);
        });
        return frag;
    }

    // Shape objects
    if (typeof obj === "object") {
        for (const key in obj) {
            const fn = CJSON2DOM.shapes[key];
            if (fn) {
                const expanded = fn(obj);
                return make(expanded);
            }
        }
    }

    // Fallback
    return document.createTextNode(String(obj));
}

/* Make global */
window.cjson2dom = cjson2dom;
window.CJSON2DOM = CJSON2DOM;
window.registerCjsonShape = registerShape;
