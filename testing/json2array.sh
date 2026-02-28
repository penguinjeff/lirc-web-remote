tmp=' [ [ "a" , "b" , "c"] , [ "d", "e" ]   ,   [ "f", "g" ] ] '
regex='\s*\[\s*[\s*(.*)\s*]\s*]\s*'
[[ "${tmp}" =~ $regex ]] echo "[$BASH_REMATCH]"
tmp="${tmp# *}"
tmp="${tmp#[[]}"
tmp="${tmp# *}"
tmp="${tmp#[[]}"
tmp="${tmp# *}"
tmp="${tmp%"${tmp##*[![[:space:]]}"}"
tmp="${tmp%]}"
tmp="${tmp%"${tmp##*[![[:space:]]}"}"
tmp="${tmp%]}"
tmp="${tmp%"${tmp##*[![[:space:]]}"}"
string="${tmp}"
echo $string

regex='\]\s*,\s*\['
parts=()
tmp="$string"

while [[ $tmp =~ $regex ]]; do
    # Extract text before the match
    part="${tmp%%$BASH_REMATCH*}"
    parts+=("$part")
    # Remove the matched part and prefix from tmp
    tmp="${tmp#*$BASH_REMATCH}"
done
# Add the last part
parts+=("$tmp")

# Output
for i in "${!parts[@]}"; do
    echo "$i => \"${parts[i]}\""
done   
