subprocess() { irsend "send_once" "$1" "$2" 2>&1; }

subprocess "Logitech_Samsung" "KEY_POWERON"
