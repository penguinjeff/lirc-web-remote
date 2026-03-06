// createElement.js
import { buildSelect } from './createElement/buildSelect.js';
import { buildMultiple } from './createElement/buildMultiple.js';
import { buildRadio } from './createElement/buildRadio.js';
import { buildTag } from './createElement/buildTag.js';

const builders = {
    select: buildSelect,
    multiple: buildMultiple,
    radio: buildRadio,
    tag: buildTag
};

export function createElement(items) {
    const type = detectType(items);
    const element = builders[type](items);

    applyCommonAttributes(element, items);

    return wrapWithLabelIfNeeded(element, items);
}

function detectType(items) {
    const types = ['multiple', 'select', 'tag', 'radio'];
    for (let t of types) {
        if (items[t]) return t;
    }
    return 'tag';
}

function applyCommonAttributes(el, items) {
    if (items.class) el.className = items.class;
    if (items.name) el.classList.add(items.name);

    for (let key in items) {
        if (['select','multiple','radio','tag','label','holddiv'].includes(key)) continue;
        if (key === 'innerHTML') el.innerHTML = items[key];
        else if (key === 'value') el.value = items[key];
        else el.setAttribute(key, items[key]);
    }
}

function wrapWithLabelIfNeeded(el, items) {
    if (!items.label && !items.holddiv) return el;

    const container = document.createElement('div');

    if (items.label) {
        const label = document.createElement('label');
        label.textContent = items.label;
        container.appendChild(label);
    }

    container.appendChild(el);
    return container;
}
