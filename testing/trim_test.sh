function trim()
{
 regex="[^[:space:]].*[^[:space:]]"
 declare -n __string="$1"
 [[ "$__string" =~ $regex ]] && __string="${BASH_REMATCH[0]}"
}

function rtrim()
{
 regex=".*[^[:space:]]"
 declare -n __string="$1"
 [[ "$__string" =~ $regex ]] && __string="${BASH_REMATCH[0]}"
}

function ltrim()
{
 regex="[^[:space:]].*"
 declare -n __string="$1"
 [[ "$__string" =~ $regex ]] && __string="${BASH_REMATCH[0]}"
}

printf -v test "   Spaces   and tabs and newlines be gone!   \n\n"
echo -e "before [$test]"
trim test
echo -e "after [$test]"
