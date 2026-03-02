location="${0%/*}"
liblocation="${location}/bash-libs"
. "${liblocation}/url/decode.sh"
function url-parse-get-post() {
        [ "$3" = "" ] && declare retval="" || declare -n retval="$3"
        local input="$1"
        local method="${2:-GET}"  # Default to GET if not specified
	#[[ "${4@a}" == "A" ]]  &&
        declare -n params="$4"
        #|| echo "4th argument should be an assoiciative array"
        # Extract based on method
        case "$method" in
                GET)
                        url-decode "$input" input
                        input="${input#GET }"  # Remove leading 'GET '
			#echo "input:$input"
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

