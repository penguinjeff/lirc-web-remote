// js/timestamp.js
(function () {
    const href = window.location.href;
    const now = Date.now();

    // Extract existing ts if present
    const match = href.match(/ts=(\d+)/);
    const oldTS = match ? parseInt(match[1], 10) : null;

    // If ts exists and is "recent", do NOT reload (prevents loops)
    if (oldTS && now - oldTS < 1000) {
        return; // too recent → don't reload
    }

    let newHref;

    if (match) {
        // Replace existing ts=whatever
        newHref = href.replace(/ts=\d+/g, "ts=" + now);
    } else if (href.includes("?")) {
        // Add ts to existing query string
        newHref = href + "&ts=" + now;
    } else {
        // Add ts as the first query parameter
        newHref = href + "?ts=" + now;
    }

    // Only reload if the URL actually changed
    if (newHref !== href) {
        window.location.replace(newHref);
    }
})();
