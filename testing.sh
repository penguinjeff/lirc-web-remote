#!/usr/bin/env bash

remove_newlines()
{
 declare -n __string="$1"
 __string="${__string//$'\n'/\\n}"
}

wrap_element(){
  declare -n __element="$2"
  remove_newlines __element
  printf -v __element '{"%s":"%s"}' "$1" "${__element}"
}

write_data_msg(){
  declare -n __message="$1"
  [ "${__message}" = "" ] && \
    __message="successfully written ${datalocation}/get_${extension}"
  wrap_element "data" __message
  echo "${__message}"
}


function url-decode()
{
        # urldecode <string to decode> <varable to place it in>
        local -n retval="$2"
        local url_encoded="${1//+/ }"
        printf -v retval '%b' "${url_encoded//%/\\x}"
}

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

header(){ printf "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"; }
sanatized=""

readinto() {
    declare -n __out="$1"

    local request_line method path header content_length=0 body=""

    # Read request line with timeout
    if ! IFS= read -r -t 0.05 request_line; then
        __out=""
        return
    fi

    method="${request_line%% *}"
    path="${request_line#* }"
    path="${path%% *}"

    # Read headers with timeout
    while IFS= read -r -t 0.01 header; do
        [ "$header" = $'\r' ] && break
        if [[ "$header" =~ Content-Length:\ ([0-9]+) ]]; then
            content_length="${BASH_REMATCH[1]}"
        fi
    done

    # Read POST body with timeout
    if [ "$method" = "POST" ] && [ "$content_length" -gt 0 ]; then
        IFS= read -r -n "$content_length" -t 0.05 body
    fi

    # Return path or body
    if [ "$method" = "GET" ]; then
        __out="$path"
    else
        __out="$body"
    fi
}

sanitize() {
    declare -n __out="$1"
    local in="$2"
    local tmp=""
    local c
    local i

    for ((i=0; i<${#in}; i++)); do
        c="${in:i:1}"

        case "$c" in
            [A-Za-z0-9] ) tmp+="$c" ;;
            "_" ) tmp+="$c" ;;
            "." ) tmp+="$c" ;;
            "-" ) tmp+="$c" ;;
            "+" ) tmp+="$c" ;;
            "=" ) tmp+="$c" ;;
            "&" ) tmp+="$c" ;;
            "{" ) tmp+="$c" ;;
            "}" ) tmp+="$c" ;;
            "%" ) tmp+="$c" ;;
            "[" ) tmp+="$c" ;;
            "]" ) tmp+="$c" ;;
            " " ) tmp+="$c" ;;
        esac
    done
    __out="$tmp"
}


main()
{
  #get input from user and sanatize it.
  readinto data
  sanitize data
  [ -n "$1" ] && data="$1"

  declare -A my_params
  url-parse-get-post "${data}" '' output my_params
  local mode="${my_params["mode"]}"
  local json="${my_params["json"]}"
  local id="${my_params["id"]}"
  case "${mode}" in
    *)
      header
      message="invalid mode ${extension}"
      write_data_msg message
    ;;
  esac
}

main "$*"

