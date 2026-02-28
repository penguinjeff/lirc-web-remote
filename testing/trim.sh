test="   Spaces   and tabs and newlines be gone!   "
regex="[^[:space:]].*[^[:space:]]"
if [[ "$test" =~ $regex ]]; then
    trimmed="${BASH_REMATCH[0]}"
    echo "Trimmed: $trimmed"
fi
