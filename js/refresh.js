
function refresh(refresh_list, fun2run, targetObj) {

    // If no object is provided, default to window (global)
    const target = (typeof targetObj === "object" && targetObj !== null)
        ? targetObj
        : window;

    // Track which modules are still loading
    const refreshing = {};
    refresh_list.forEach(name => refreshing[name] = true);

    function loadOne(name) {
        // Remove old script
        const old = document.getElementById(name+'_id');
        if (old) old.remove();

        // Create new script
        const script = document.createElement("script");
        script.id = name+'_id';
        script.src = `data/get_${name}.js?ts=${Date.now()}`;

        script.onload = () => {
            const fn = window["get_" + name];
            target[name] = fn();   // <-- store in target object
            console.log(name, "loaded:", target[name]);

            refreshing[name] = false;

            // Check if all modules are done
            const allDone = Object.values(refreshing).every(v => v === false);
            if (allDone) {
                fun2run(refresh_list, target);
            }
        };

        document.head.appendChild(script);
    }

    // Kick off all loads
    refresh_list.forEach(loadOne);
}
