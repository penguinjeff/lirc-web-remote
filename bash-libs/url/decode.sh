function url-decode()
{
	# urldecode <string to decode> <varable to place it in>
	[ "$2" = "" ] && local retval=""
	[ "$2" != "" ] && local -n retval="$2"
	local url_encoded="${1//+/ }"
	printf -v retval '%b' "${url_encoded//%/\\x}"
	[ "$2" = "" ] && echo "${retval}"
}
