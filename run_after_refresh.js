function run_after_refresh(list_of_variables,variables) {
    run_after_refresh();   // updates variables
    let variables_extended=JONS.parse(JSON.stringify(variabes);
    variables_extended["activities_list"]=Object.keys(variables["activities"]);
    variables_extended["remotes_list"]=Object.keys(variables["remotes"]);
    variables_extended["default_modules"]=get_default_modules;

    /*selected_remote is global need to varify if it still exists if not pick the first remote*/
    /*selected_activity is global need to varify if it still exists if not pick the first activity*/
    /*need to build None option for activities-select and remotes-serlect if there are none*/
    let remotes_activity=""
    if(selected_remote!=""){remotes_activity={"remotes":[selcted_remote],"display":get_default_display()};}
    let activities_activity=""
    if(selected_activity!=""){activities_activity=variables["activities"][selected_activity];

    rebuildDisplay("activities-select", build_remote(variables,activitiess_activity);
    rebuildDisplay("remotes-select", build_remote(variables,remote_activity);

    rebuildDisplay("activities-display", /*cjson2dom logic to build selectbox using Object.keys(variables["activities"]*/ );
    rebuildDisplay("remotes-display", /*cjson2dom logic to build selectbox using Object.keys(variables["remotes"]*/);
    rebuildDisplay("edit-options-display", build_edit(selected_edit));
}
