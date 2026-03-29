// js/build_remote.js
export function build_remote(variables_extended, config) {
    console.log("build_remote called with:", { variables_extended, config });

    // Build a JSON2DOM model showing the data
    return {
        section: {
            title: "build_remote() placeholder",
            items: [
                ["Message:", "This is what would have been rendered"],
                ["Config:", JSON.stringify(config, null, 2)],
                ["Variables:", JSON.stringify(variables_extended, null, 2)]
            ]
        }
    };
}
