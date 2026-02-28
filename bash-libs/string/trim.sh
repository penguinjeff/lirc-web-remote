declare -F string-trim > /dev/null && return
function string-trim()
{
 regex="[^[:space:]].*[^[:space:]]"
 declare -n __string="$1"
 [[ "$__string" =~ $regex ]] && __string="${BASH_REMATCH[0]}"
}
