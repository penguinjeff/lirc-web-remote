#!/usr/bin/env bash
#example: ./irsend_mult.sh 'mode=macro&id=10&json=[["remote","ircode","0","1"]]'
#example: ./irsend_mult.sh 'mode=status&json=["10"]'
#example: ./irsend_mult.sh 'mode=list'
#
# Written by: Jeff Sadowski
# this program simply runs irsend and outputs a JSON with any errors
#                                                      name of the remote listed in irsend list EX: samsungTVremote
#                                                      |        the ircode that would you want sent from that remote EX: key_power
#                                                      |        |      delay in miliseconds 0
#                                                      |        |      |   loops minimum 1
#                                                      V        V      V   V

location="${0%/*}"
. "${location}/common.sh"

# for string-trim
. "${liblocation}/string/trim.sh"

# for time-realtime
. "${liblocation}/time/realtime.sh"

#for url-parse-get-post
. "${liblocation}/url/parse-get-post.sh"

#for jsonl-winow
. "${liblocation}/jsonl/window.sh"

header(){ printf "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"; }

status(){
  header
  local message=""
  local array=()
  json-list2array "$1" array 3
  local file="${idlocation}/${array[0]}.jsonl"
  [[ -z "${array[0]}" ]] || [[ ! -f "${file}" ]] && { msg e "missing" "$file"; msg f; return 0; }
  jsonl-window message "${file}" "${array[1]}" "${array[2]}"
  printf "%s\n" "$message"
  #check last line of message and remove file if appropriate
  json-list2array "${message##*$'\n'}" array 1
  [[ "${array[0]}" = "finished" ]] && rm -f "$file"
}

write(){
  local extension=$1
  local status="s"
  local msglist=()
  declare -n __json=$2
  header

  case "${extension}" in
    "remotes")
      string-trim __json
      time-realtime ts
      message=$(
        {
          printf 'window.remotests=%s\n' "$ts"
          printf 'function get_%s(){ return %s; }' "$extension" "$__json"
        } > "${datalocation}/get_${extension}.js" 2>&1
      )      [ -n "${message}" ] && status="e" && msglist+=("${message}")
      msglist+=("writing"); msglist+=("data/get_${extension}.js")
    ;;

    "activities"|"displays"|"macros"|"modules")
      string-trim __json
      message=$(
        printf 'function get_%s(){ return %s; }' "$extension" "$__json" \
        > "${datalocation}/get_${extension}.js" 2>&1
      )
      [ -n "${message}" ] && status="e" && msglist+=("${message}")
      msglist+=("writing"); msglist+=("data/get_${extension}.js")
    ;;

    *)
      status="e"
      msglist+=("invalid type ${extension} to mode write")
    ;;
  esac
  chmod 664 "data/get_${extension}.js"
  msg "${status}" "${msglist[@]}"
}


list()
{
  local del=""
  local all_buttons="{"
  local remote buttons first_button line button comma

  command_exists irsend || { header; msg e "missing irsend" "list"; return 0; }

  # Loop over all remotes
  while IFS="" read -r remote; do
    [ -z "$remote" ] && continue

    buttons=""
    comma=""

    # Get all buttons for this remote
    while IFS= read -r line; do
      set -- $line
      button="$2"
      [ -z "$button" ] && continue
      buttons+="$comma\"$button\""
      comma=','
    done < <(irsend list "$remote" '' 2>/dev/null)

    all_buttons+="${del}\"${remote}\":[${buttons}]"
    del=","
  done < <(irsend list '' '' 2>/dev/null)

  all_buttons+="}"

  write "remotes" all_buttons
}

readinto() {
  declare -n __out="$1"

  local request_line method path header content_length=0 body=""

  # Read request line with timeout
  if ! IFS="" read -r -t 0.05 request_line; then
    __out=""
    return
  fi

  method="${request_line%% *}"
  path="${request_line#* }"
  path="${path%% *}"

  # Read headers with timeout
  while IFS="" read -r -t 0.01 header; do
    [ "$header" = $'\r' ] && break
    [[ "$header" =~ Content-Length:\ ([0-9]+) ]] && \
      content_length="${BASH_REMATCH[1]}"
  done

  # Read POST body with timeout
  [ "$method" = "POST" ] && [ "$content_length" -gt 0 ] && \
    IFS="" read -r -n "$content_length" -t 0.05 body

  # Return path or body
  [ "$method" = "GET" ] && __out="$path" || __out="$body"
}

sanitize() {
  declare -n __out="$1"
  local in="$__out"
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
  readinto data
  raw_data="$data"
  sanitize data


  [ -n "$1" ] && data="$1"

  declare -A my_params
  url-parse-get-post "${data}" '' output my_params

  local mode="${my_params["mode"]}"
  local json="${my_params["json"]}"
  local id="${my_params["id"]}"
  case "${mode}" in
    "list") list; return 0;;

    "status") status "$json";;

    "macro"|"stop")
      header
      echo "${time_start}" > "${time_start_file}"
      [ "${mode}" = "stop" ] &&  header && echo '["stopping"]' && return 0
      echo "$json" > "${json_pass}"
      [ -z "$id" ] && id="${time_start}"
      msg n "$id"
      printf '%q %q\n' "${location}/macro.sh" "$id" | at now >/dev/null 2>&1
    ;;

    'write_'* )
      raw_json="${raw_data#*json=}"
      extension="${mode##*_}"
      msg "$raw_json"
      write "${extension}" raw_json
    ;;

    *)
      header
      msg e "invalid mode ${extension}"
    ;;
  esac
}

main "$*"
