// js/get_setup.js
// Returns declarative JSON describing the setup instructions

function get_setup() {
    return {
        section: {
            title: "Setup Instructions",
            items: [
                {
                    linka: {
                        label: "Follow the setup instructions on GitHub Readme({url})"
                        url: "https://github.com/penguinjeff/lirc-web-remote",
                    }
                },
                {
                    text: "Ensure the backend service is installed and running before using the UI."
                }
            ]
        }
    };
}
