/* js/cjson2dom/shapes/sel.js */

registerCjsonShape("sel", (obj) => {
    const { items } = obj.sel;

    return [
        "select",
        {},
        ...items.map(i => ["option", { value: i }, i])
    ];
});
