var macro_id = null;   // global

function execute(mode, json_obj = []) {
  var ts = Math.round(Date.now() / 1000);

  // Accept either a JS object or a JSON string
  var json = (typeof json_obj === "string")
    ? json_obj
    : JSON.stringify(json_obj);

  json = encodeURIComponent(json);

  return fetch('irsend_mult.php?ts=' + ts, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'mode=' + encodeURIComponent(mode) + '&json=' + json,
    signal: AbortSignal.timeout(5000)
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {

    // ---------------------------
    // MACRO MODE: store macro_id
    // ---------------------------
    if (mode === "macro") {
      if (Array.isArray(data) && data.length > 0) {
        macro_id = data[0];
        console.log("macro_id set to:", macro_id);

        // Start polling
        startPolling();
      }
    }

    // ---------------------------
    // STATUS MODE: check for stop
    // ---------------------------
    if (mode === "status") {
      if (Array.isArray(data) && data.length > 0) {
        var status = data[0];

        if (status === "finished" || status === "interrupted") {
          console.log("Macro ended with:", status);
          polling = false;   // stop polling
        }
      }
    }

    return data;
  })
  .catch(function(err) {
    console.error("execute() failed:", err);
    return { error: err.message };
  });
}

function startPolling() {
  if (polling) return;   // already polling

  polling = true;

  function poll() {
    if (!polling) return;   // stop condition

    execute("status", '["' + macro_id + '","' + skip_to_byte + '"]')
      .then(function() {
        if (polling) {
          setTimeout(poll, 500);   // poll every 500ms
        }
      });
  }

  poll();
}
