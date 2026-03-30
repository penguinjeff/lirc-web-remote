/* js/cjson2dom/shapes/linka.js */

registerCjsonShape("linka", (obj) => {
    const { url, label } = obj.linka;
    return ["a", { href: url }, label.replace("{url}", url)];
});
