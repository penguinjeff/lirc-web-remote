#!/bin/bash
copy_array() {
    local -n source_array="$1"  # Declare a nameref to the source array
    local -n dest_array="$2"    # Declare a nameref to the destination variable name
    dest_array=("${source_array[@]}")  # Copy all elements
}

# Example usage:
declare -A original=( [apple]="keep doctor away" [banana]="for scale" [cherry]="on top" )
copy_array "original" "new_array"
printf '%s\n' "${new_array[@]}"  # Outputs: apple, banana, cherry
