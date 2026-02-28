declare -F string-ltrim > /dev/null && return
function string-ltrim()
{
 regex="[^[:space:]].*"
 declare -n __string="$1"
 [[ "$__string" =~ $regex ]] && __string="${BASH_REMATCH[0]}"
}
