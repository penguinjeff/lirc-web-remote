function json2css(json) {
  return JSON.stringify(json, null, 2)
    .replace(/^\{\s*/, '  ')                        // remove leading {
    .replace(/\s*\}\s*$/, '')                     // remove trailing }
    .replace(/"([^"]+)": \{/g, '.$1 {')           // selector: "name": {  →  .name {
    .replace(/"([^"]+)": "([^"]+)"/g, '$1: $2;')  // properties: "prop": "value"  →  prop: value;
    .replace(/,/g, '')                            // remove commas (JSON uses them, CSS doesn't)
    .replace(/"/g, '');                           // remove remaining quotes
}
