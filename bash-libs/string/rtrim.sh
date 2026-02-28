declare -F string-rtrim > /dev/null && return
function string-rtrim()
{
 regex=".*[^[:space:]]"
 declare -n __string="$1"
 [[ "$__string" =~ $regex ]] && __string="${BASH_REMATCH[0]}"
}
