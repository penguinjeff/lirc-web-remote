function createSelectorUI(container, data, options = {}, saved = []) {
  const { allowNone = true } = options;

  container.innerHTML = "";

  function buildLevel(list, level = 0) {
    const select = document.createElement("select");
    select.dataset.level = level;

    // Add "None" option if allowed
    if (allowNone) {
      const noneOpt = document.createElement("option");
      noneOpt.value = "";
      noneOpt.textContent = "-- None --";
      select.appendChild(noneOpt);
    }

    // Add all options (strings + object keys)
    list.forEach(item => {
      if (typeof item === "string") {
        const opt = document.createElement("option");
        opt.value = item;
        opt.textContent = item;
        select.appendChild(opt);
      } else {
        const key = Object.keys(item)[0];
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = key;
        select.appendChild(opt);
      }
    });

    container.appendChild(select);

    const realOptions = [...select.options].filter(o => o.value !== "");

    // Load saved selection if provided
    if (saved[level]) {
      select.value = saved[level];
    } else if (realOptions.length === 1) {
      // Auto-select the single option
      select.value = realOptions[0].value;
    }

    // Build next level if needed
    handleSelection(select, list, level);

    select.addEventListener("change", () => {
      handleSelection(select, list, level);
    });
  }

  function handleSelection(select, list, level) {
    // Remove deeper levels
    [...container.querySelectorAll("select")]
      .filter(s => Number(s.dataset.level) > level)
      .forEach(s => s.remove());

    const selected = select.value;
    if (!selected) return;

    // Find next list if selected is an object key
    const nextObj = list.find(
      item => typeof item === "object" && Object.keys(item)[0] === selected
    );

    if (!nextObj) return;

    const nextList = nextObj[selected];
    buildLevel(nextList, level + 1);
  }

  // Convert top-level object into list of {key: list}
  const topList = Object.keys(data).map(k => ({ [k]: data[k] }));
  buildLevel(topList);
}
