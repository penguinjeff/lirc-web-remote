declare -F json-list2array > /dev/null && return
function json-list2array()
{
  local json=$1
  local length=$3
  local temp="${json#[}"
  temp="${temp%]}"
  IFS=',' read -ra items <<< "$temp"
  declare -n __array="$2"
  __array=()
  for item in "${items[@]}"; do
    # Remove leading/trailing quotes
    temp=("${item%\"}")
    temp="${temp#\"}"
    __array+=("${temp}")
  done
 [ "$length" = "" ] && return 1
 while (( ${#__array[@]} < length)); do
    __array+=("")
 done
}
