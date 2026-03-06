// builders/buildSelect.js
export function buildSelect(items) {
    const select = document.createElement('select');

    if (items.noneoptions) {
        const opt = document.createElement('option');
        opt.text = "None";
        opt.value = "";
        select.appendChild(opt);
    }

    const keys = Array.isArray(items.select)
        ? items.select
        : Object.keys(items.select);

    for (let key of keys) {
        const option = document.createElement('option');
        const label = typeof key === 'string' ? key : Object.keys(key)[0];

        option.textContent = label;
        option.value = items.indexvalues ? keys.indexOf(key) : label;

        if (typeof key === 'object') {
            option.dataset.sub = JSON.stringify(key[label]);
        }

        select.appendChild(option);
    }

    return select;
}
