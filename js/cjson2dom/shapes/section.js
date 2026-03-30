/* js/cjson2dom/shapes/section.js */

registerCjsonShape("section", (obj) => {
    const { title, content } = obj.section;

    return [
        "section",
        {},
        ["h2", {}, title],
        content
    ];
});
