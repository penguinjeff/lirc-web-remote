#!/bin/bash

OUT="js/version.js"
TMP="/tmp/version.js.$$"

# Find newest modification time of ANY file except version.js
NEWEST_TS=$(find . -type f \
    ! -path "./js/version.js" \
    -printf "%T@\n" | sort -n | tail -1 | cut -d. -f1)

echo "window.SITE_VERSION = $NEWEST_TS;" > "$TMP"

if ! cmp -s "$TMP" "$OUT"; then
    mv "$TMP" "$OUT"
else
    rm "$TMP"
fi
