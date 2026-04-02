jsonl-window() {
  p='^[0-9]+$'
  declare -n __readinto="$1"

  [[ ! -f "$2" ]] && echo "$2 is not a valid file" && return 1
  [[ -n "$3" && $3 =~ $p ]] && BYTES_TO_SKIP="$3" || BYTES_TO_SKIP=0
  [[ -n "$4" && $4 =~ $p ]] && BYTES_TO_READ="$4" || BYTES_TO_READ=-1

  exec 3<"$2"

  # Skip bytes
  (( BYTES_TO_SKIP > 0 )) && read -r -N "$BYTES_TO_SKIP" <&3

  # Read window directly into the nameref
  if (( BYTES_TO_READ >= 0 )); then
    read -r -N "$BYTES_TO_READ" __readinto <&3
  else
    IFS= read -r -d '' __readinto <&3
    # Trim the extra newline read leaves behind
    [[ $__readinto == *$'\n' ]] && __readinto="${__readinto%$'\n'}"
  fi

  exec 3<&-
}