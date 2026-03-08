let activeMacros = {};   // macro_id → { skip, polling }

function execute(mode, json_obj = []) {
  const ts = Math.round(Date.now() / 1000);
  const json = encodeURIComponent(JSON.stringify(json_obj));

  return fetch('irsend_mult.php?ts=' + ts, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'mode=' + encodeURIComponent(mode) + '&json=' + json,
    signal: AbortSignal.timeout(5000)
  })
  .then(r => r.text())
  .then(text => {

    // ---------------------------
    // MACRO MODE: ["10"]
    // ---------------------------
    if (mode === "macro") {
      const data = JSON.parse(text);
      const macro_id = data[0];

      console.log("macro_id:", macro_id);
      startMacro(macro_id);

      return data;
    }

    // ---------------------------
    // STATUS MODE: JSONL
    // ---------------------------
    if (mode === "status") {
      const bytes = new TextEncoder().encode(text).length;

      const lines = text
        .trim()
        .split("\n")
        .map(line => JSON.parse(line));

      // Log each parsed JSON line
      lines.forEach(line => console.log("STATUS:", line));

      return { lines, bytes };
    }

    return text;
  })
  .catch(err => {
    console.error("execute() failed:", err);
    return { error: err.message };
  });
}

function startMacro(macro_id) {
  activeMacros[macro_id] = { skip: 0 };
  startPolling(macro_id);
}

function startPolling(macro_id) {

  function poll() {
    const entry = activeMacros[macro_id];
    if (!entry) return;

    execute("status", [macro_id, entry.skip])
      .then(result => {

        if (!result || !result.lines) return;

        const { lines, bytes } = result;

        // Increment skip_to_byte by number of bytes read
        entry.skip += bytes;

        const last = lines[lines.length - 1];

        if (last[0] === "finished" || last[0] === "interupted") {
          console.log("Macro", macro_id, "ended with:", last[0]);
          delete activeMacros[macro_id];
          return;
        }

        setTimeout(poll, 500);
      });
  }

  poll();
}
