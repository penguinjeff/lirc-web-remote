subprocess() { irsend "send_once" "$1" "$2" 2>&1; }

test=$(subprocess "Logitech_Samsung" "KEY_POWERON")
echo "[$test]"
