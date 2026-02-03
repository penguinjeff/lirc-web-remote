
#from search.brave.com
# bash extract an html arguments from 'GET json={valid:"json"}&id="timestamp"'
# followup question
#I'd like to use just bash and have it as a function that builds one or two indexed arrays if you can index an array with the key words like json and id that would be prefferable but if you can only have number indexes then it would be better for a second array for the keys values and I can loop throught the keys and find each key value pair


parse_http_data() {
    local input="$1"
    local method="${2:-GET}"  # Default to GET if not specified
    declare -A params

    # Extract based on method
    case "$method" in
        GET)
            input="${input#GET }"  # Remove leading 'GET '
            ;;
        POST)
            :  # Input is already raw POST body
            ;;
        *)
            echo "Error: Method must be GET or POST" >&2
            return 1
            ;;
    esac

    # Parse key=value pairs separated by &
    while IFS='=' read -r -d '&' key value; do
        [[ -n "$key" ]] && params["$key"]="$value"
    done <<<"${input}&"

    # Output as eval-safe declarations
    for k in "${!params[@]}"; do
        printf '%s=%s\n' "$k" "${params[$k]}"
    done
}
