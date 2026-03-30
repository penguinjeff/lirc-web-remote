/* js/cjson2dom/load.js */

// Load the engine first
document.write(`<script src="js/cjson2dom/cjson2dom.js"></script>`);

// List of shape files
const shapeFiles = [
    "linka.js",
    "sel.js",
    "section.js",
    "text.js"
];

// Load each shape
shapeFiles.forEach(file => {
    document.write(`<script src="js/cjson2dom/shapes/${file}"></script>`);
});
