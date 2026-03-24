declare -F json-listOfLists2arrayOfLists > /dev/null && return
json-listOfLists2arrayOfLists() {
  local temp="${1#[[}"
  temp="${temp%]]}"
  declare -n __ref=$2

  # Replace literal "],[" with a delimiter
  temp="${temp//],[/|}"
  local local_array
  local item
  # Split on the delimiter
  IFS='|' read -ra local_array <<< "$temp"
  __ref=()
  for item in "${local_array[@]}"; do
    __ref+=("[$item]")
  done
}
