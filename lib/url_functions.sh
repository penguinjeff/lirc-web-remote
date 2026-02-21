function urlencode()
{
	# urlencode <string to encode> <varable to place it in>
	local length="${#1}"
	[ "$2" = "" ] && local retval=""
	[ "$2" != "" ] && local -n retval="$2"
        retval=""
        local temp=""
	for (( i = 0; i < length; i++ )); do
		local c="${1:i:1}"
		case $c in
			[a-zA-Z0-9.~_-]) printf -v temp "$c" ;;
			*) printf -v temp '%%%02X' "'$c" ;;
		esac
		retval+="${temp}"
	done
	[ "$2" = "" ] && echo "${retval}"
}

function urldecode()
{
	# urldecode <string to decode> <varable to place it in>
	[ "$2" = "" ] && local retval=""
	[ "$2" != "" ] && local -n retval="$2"
	local url_encoded="${1//+/ }"
	printf -v retval '%b' "${url_encoded//%/\\x}"
	[ "$2" = "" ] && echo "${retval}"
}

parse_http_data() {
        [ "$3" = "" ] && local retval=""
        [ "$3" != "" ] && local -n retval="$3"
        local input="$1"
        local method="${2:-GET}"  # Default to GET if not specified
        declare -gA params

        # Extract based on method
        case "$method" in
                GET)
                        urldecode "$input" input
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
                local tmp="";
                printf -v tmp '[%s=%s]\n' "$k" "${params[$k]}"
                retval+="$tmp"
        done
        [ "$3" = "" ] && echo -en "$retval"
}

