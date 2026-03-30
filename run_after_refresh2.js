function run_after_refresh(list_of_variables, variables) {

    // Extract keys
    const activityKeys = Object.keys(variables.activities);
    const remoteKeys   = Object.keys(variables.remotes);

    // Selectability flags
    const activitiesSelectable = activityKeys.length > 0;
    const remotesSelectable    = remoteKeys.length > 0;

    // Validate selected activity
    if (!activitiesSelectable) {
        selected_activity = "";
    } else if (!activityKeys.includes(selected_activity)) {
        selected_activity = activityKeys[0];
    }

    // Validate selected remote
    if (!remotesSelectable) {
        selected_remote = "";
    } else if (!remoteKeys.includes(selected_remote)) {
        selected_remote = remoteKeys[0];
    }

    // Build activity objects
    const activities_activity =
        selected_activity !== "" ? variables.activities[selected_activity] : "";

    const remote_activity =
        selected_remote !== ""
            ? { remotes: [selected_remote], display: get_default_display() }
            : "";

    // Rebuild select boxes
    rebuildDisplay("activities-select", () => ({
        sel: {
            items: activitiesSelectable ? activityKeys : ["None"],
            disabled: !activitiesSelectable
        }
    }));

    rebuildDisplay("remotes-select", () => ({
        sel: {
            items: remotesSelectable ? remoteKeys : ["None"],
            disabled: !remotesSelectable
        }
    }));

    // Rebuild displays
    rebuildDisplay("activities-display", () =>
        build_remote(variables, activities_activity)
    );

    rebuildDisplay("remotes-display", () =>
        build_remote(variables, remote_activity)
    );

    // edit-options-display is static → built only at startup
}
