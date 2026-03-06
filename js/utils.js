const UI = (() => {

    // PRIVATE helpers
    function buildSelect(items) { /* ... */ }
    function buildMultiple(items) { /* ... */ }
    function buildRadio(items) { /* ... */ }
    function buildTag(items) { /* ... */ }
    function detectType(items) { /* ... */ }
    function applyCommonAttributes(el, items) { /* ... */ }
    function wrapWithLabelIfNeeded(el, items) { /* ... */ }

    // PUBLIC API
    function createElement(items) {
        const type = detectType(items);

        switch (type) {
            case 'select': return wrapWithLabelIfNeeded(applyCommonAttributes(buildSelect(items), items), items);
            case 'multiple': return wrapWithLabelIfNeeded(applyCommonAttributes(buildMultiple(items), items), items);
            case 'radio': return wrapWithLabelIfNeeded(applyCommonAttributes(buildRadio(items), items), items);
            case 'tag': return wrapWithLabelIfNeeded(applyCommonAttributes(buildTag(items), items), items);
        }
    }

    return { createElement };
})();
