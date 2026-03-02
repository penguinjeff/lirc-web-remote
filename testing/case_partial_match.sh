#!/usr/bin/env bash

mode="$1"
echo "given [$mode]"

case "$mode" in
  'mode.'*)
    extension="${mode##*.}"
    echo "mode type ${extension}"
  ;;
  *)
    echo "unknown"
esac

