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
