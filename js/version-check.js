(function () {
    function check() {
        // Wait until version.js has loaded
        if (typeof window.SITE_VERSION === "undefined") {
            return setTimeout(check, 50);
        }

        const current = window.SITE_VERSION;
        const previous = Number(localStorage.getItem("site_version")) || 0;

        if (current > previous) {
            localStorage.setItem("site_version", current);
            console.log("Site updated → reloading");
            window.location.reload(true);
        }
    }

    check();
})();
