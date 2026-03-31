
////////////////////////////////////////////////////////////
// PART 1 (BEGIN)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// HIERARCHY SELECTOR MODULE (BEGIN)
// Creates a multi-level cascading selector UI from nested data.
////////////////////////////////////////////////////////////
const hierarchySelector = (input, onLeaf, userConfig = {}) => {

	const levels = [];   // <-- MUST come before clearLevels

////////////////////////////////////////////////////////////
// UTILITY SUBSECTION: CLEAR LEVELS (BEGIN)
////////////////////////////////////////////////////////////
function clearLevels(fromDepth) {
    // Remove all selects deeper than the given depth
    for (let i = levels.length - 1; i > fromDepth; i--) {
        const level = levels[i];
        if (level && level.parentNode) {
            level.parentNode.removeChild(level);
        }
        levels.pop();
    }
}
////////////////////////////////////////////////////////////
// UTILITY SUBSECTION: CLEAR LEVELS (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// CONFIG SECTION (BEGIN)
// Merge user config with defaults.
////////////////////////////////////////////////////////////
const config = {
    className: "hierarchy",
    allowNone: false,
    showPlaceholders: false,
    showBasePlaceholder: true,
    debug: false,
    onLeaf,            // ⭐ REQUIRED: wire the callback into config
    ...userConfig,
};
////////////////////////////////////////////////////////////
// CONFIG SECTION (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// UTILITIES SECTION (BEGIN)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// UTILITIES SUBSECTION: ADVANCED DEBUG LOGGER (BEGIN)
////////////////////////////////////////////////////////////
const debugEnabled = (category) => {
    if (!config.debug) return false;

    if (config.debug === true) return true;
    if (config.debug.all) return true;

    return !!config.debug[category];
};

const dlog = (category, ...args) => {
    if (debugEnabled(category)) {
        console.log(`[hierarchySelector][${category}]`, ...args);
    }
};
////////////////////////////////////////////////////////////
// UTILITIES SUBSECTION: ADVANCED DEBUG LOGGER (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// UTILITIES SUBSECTION: LEGACY LOG WRAPPER (BEGIN)
////////////////////////////////////////////////////////////
const log = (...args) => dlog("misc", ...args);
////////////////////////////////////////////////////////////
// UTILITIES SUBSECTION: LEGACY LOG WRAPPER (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// UTILITIES SUBSECTION: TYPE CHECKS (BEGIN)
////////////////////////////////////////////////////////////
const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);
const isArray = (v) => Array.isArray(v);
////////////////////////////////////////////////////////////
// UTILITIES SUBSECTION: TYPE CHECKS (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// UTILITIES SECTION (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// PART 1 (END)
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// PART 2 (BEGIN)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// NORMALIZE SECTION (BEGIN)
// Converts input data into a uniform tree structure:
// { key: string, children: [...] }
////////////////////////////////////////////////////////////
const normalize = (node) => {
    if (isArray(node)) {
        return node.map((item) => ({
            key: item,
            children: [],
        }));
    }

    if (isObject(node)) {
        return Object.entries(node).map(([key, value]) => ({
            key,
            children: normalize(value),
        }));
    }

    return [{
        key: String(node),
        children: [],
    }];
};

const normalized = normalizeStructure(input);
dlog("structure", "Normalized structure:", normalized);
////////////////////////////////////////////////////////////
// NORMALIZE SECTION (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// NORMALIZATION SECTION (BEGIN)
// Ensures every item has key, label, and normalized children.
////////////////////////////////////////////////////////////

function normalizeStructure(structure) {
    const result = [];

    for (const [key, value] of Object.entries(structure)) {

        // If no label provided, default to key
        const label = (value && value.label) ? value.label : key;

        const item = {
            key,
            label,
            children: null
        };

        // Case 1: children are an array of leaf strings
        if (Array.isArray(value)) {
            item.children = value.map(childKey => ({
                key: childKey,
                label: childKey,
                children: null
            }));
        }

        // Case 2: children are nested objects
        else if (typeof value === "object" && value !== null) {
            item.children = normalizeStructure(value);
        }

        result.push(item);
    }

    return result;
}

////////////////////////////////////////////////////////////
// NORMALIZATION SECTION (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// BUILD LEVEL SECTION (BEGIN)
// Creates one <select> for a given depth and item list.
////////////////////////////////////////////////////////////

const buildLevel = (items, container, depth) => {
    dlog("render", "Building level", depth, items);

    // Remove deeper levels when rebuilding
    while (container.children.length > depth) {
        container.removeChild(container.lastChild);
    }

////////////////////////////////////////////////////////////
// BUILD LEVEL SUBSECTION: CREATE SELECT ELEMENT (BEGIN)
////////////////////////////////////////////////////////////

const select = document.createElement("select");
select.name=config.name;
select.className = config.selectClass;

// ⭐ ATTACH HANDLER RIGHT HERE — ALWAYS
select.addEventListener("change", (event) => {
    const selectedKey = event.target.value;

////////////////////////////////////////////////////////////
// FIX: PREVENT PLACEHOLDER AT DEPTH 0 FROM TRIGGERING
////////////////////////////////////////////////////////////
    if (depth === 0 && selectedKey === "") {
        while (container.children.length > 1) {
            container.removeChild(container.lastChild);
        }
        return;
    }

////////////////////////////////////////////////////////////
// SUBSUBSECTION: DEBUG HANDLER FIRED (BEGIN)
////////////////////////////////////////////////////////////
if (config.debug) {
    console.log(`[${config.name}][handler-fired]`, {
        depth,
        selectedKey,
        item: items.find(i => i.key === selectedKey),
        children: items.find(i => i.key === selectedKey)?.children
    });
}
////////////////////////////////////////////////////////////
// SUBSUBSECTION: DEBUG HANDLER FIRED (END)
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// FIX: CLEAR DEEPER LEVELS WHEN SELECTEDKEY IS EMPTY
////////////////////////////////////////////////////////////
    if (!selectedKey) {
        while (container.children.length > depth + 1) {
            container.removeChild(container.lastChild);
        }
        return;
    }

    const item = items.find(i => i.key === selectedKey);
    if (!item) return;


////////////////////////////////////////////////////////////
// SUBSUBSECTION: LEAF DETECTION (BEGIN)
////////////////////////////////////////////////////////////

const isLeaf =
    item.children === null ||
    item.children === undefined ||
    (Array.isArray(item.children) && item.children.length === 0);

if (isLeaf) {

    // ⭐ Collect all <select> elements in order
    const selects = Array.from(container.querySelectorAll("select"));

    // ⭐ Collect all selected values
    const selectedValues = selects.map(s => s.value);

    // ⭐ Call user leaf function with the two arguments they expect
    if (config.onLeaf) config.onLeaf(selects, selectedValues);

    return;
}

////////////////////////////////////////////////////////////
// SUBSUBSECTION: LEAF DETECTION (END)
////////////////////////////////////////////////////////////

    buildLevel(item.children, container, depth + 1);
});

////////////////////////////////////////////////////////////
// BUILD LEVEL SUBSECTION: CREATE SELECT ELEMENT (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// BUILD LEVEL SUBSECTION: POPULATE OPTIONS (BEGIN)
////////////////////////////////////////////////////////////

if (config.debug) {
    console.log(`[populate-options] depth=${depth}`, "items:", items);
}

// DEPTH 0 placeholder
if (depth === 0 && (config.showBasePlaceholder || config.showPlaceholders)) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "--select--";
    select.appendChild(opt);
}

// DEPTH > 0 placeholders
if (depth > 0 && config.showPlaceholders) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "--select--";
    select.appendChild(opt);
}

// Now add the real options
for (const item of items) {
    const opt = document.createElement("option");
    opt.value = item.key;
    opt.textContent = item.label;
    select.appendChild(opt);

    if (config.debug) {
        console.log("[option-added]", {
            depth,
            key: item.key,
            label: item.label,
            domText: opt.textContent
        });
    }
}

////////////////////////////////////////////////////////////
// BUILD LEVEL SUBSECTION: POPULATE OPTIONS (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// BUILD LEVEL SUBSECTION: APPEND SELECT (BEGIN)
////////////////////////////////////////////////////////////

container.appendChild(select);

////////////////////////////////////////////////////////////
// BUILD LEVEL SUBSECTION: AUTO-SELECT FIRST OPTION (BEGIN)
////////////////////////////////////////////////////////////
if (!config.showBasePlaceholder && depth === 0) {
    const firstKey = select.options[0]?.value;
    if (firstKey) {
        // ⭐ Delay auto-select until after DOM insertion
        setTimeout(() => {
            select.value = firstKey;
            select.dispatchEvent(new Event("change"));
        }, 0);
    }
}
////////////////////////////////////////////////////////////
// BUILD LEVEL SUBSECTION: AUTO-SELECT FIRST OPTION (END)
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// BUILD LEVEL SUBSECTION: APPEND SELECT (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// BUILD LEVEL SUBSECTION: AUTOSELECT LOGIC (BEGIN)
////////////////////////////////////////////////////////////

let firstReal = null;
for (const opt of select.options) {
    if (opt.value !== "") {
        firstReal = opt;
        break;
    }
}

// ⭐ Prevent auto-select at depth 0
if (firstReal && depth > 0) {
    select.value = firstReal.value;
    select.dispatchEvent(new Event("change"));
}

if (config.debug) {
    console.log("[after-autoselect]", {
        depth,
        selectedValue: select.value,
        selectedText: select.options[select.selectedIndex]?.textContent
    });
}

////////////////////////////////////////////////////////////
// BUILD LEVEL SUBSECTION: AUTOSELECT LOGIC (END)
////////////////////////////////////////////////////////////



};
////////////////////////////////////////////////////////////
// BUILD LEVEL SECTION (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// PART 2 (END)
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// PART 3 (BEGIN)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// ROOT TEMPLATE SECTION (BEGIN)
// Creates the root container and starts the first level.
////////////////////////////////////////////////////////////
const root = document.createElement("div");
root.className = config.className;

buildLevel(normalized, root, 0);

return root;
////////////////////////////////////////////////////////////
// ROOT TEMPLATE SECTION (END)
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// HIERARCHY SELECTOR MODULE (END)
////////////////////////////////////////////////////////////

};
////////////////////////////////////////////////////////////
// PART 3 (END)
////////////////////////////////////////////////////////////
