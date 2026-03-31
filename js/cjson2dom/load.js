function loadScriptsSequentially(files, callback) {
    function loadNext(i) {
        if (i >= files.length) return callback();
        const s = document.createElement("script");
        s.src = files[i];
        s.onload = () => loadNext(i + 1);
        document.head.appendChild(s);
    }
    loadNext(0);
}

loadScriptsSequentially([
    "js/cjson2dom/cjson2dom.js",
    "js/cjson2dom/shapes/linka.js",
    "js/cjson2dom/shapes/sel.js",
    "js/cjson2dom/shapes/section.js",
    "js/cjson2dom/shapes/text.js"
], () => {
    cjson2dom_ready();
});
