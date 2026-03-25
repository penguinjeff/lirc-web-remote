#!/bin/bash
# Written by: Jeff Sadowski
# this program simply runs irsend and outputs a JSON with any errors
# If you give it no arguments like the first example
# it will update $PWD/remotes/remotes.json
# defined in your lirc files
#                                           name of the remote listed in irsend list EX: samsungTVremote
#                                           |        the ircode that would you want sent from that remote EX: key_power
#                                           |        |      delay in miliseconds 0
#                                           |        |      |   loops minimum 1
#                                           V        V      V   V
#example: ./irsend_mult.sh 'mode=macro&id=10&json=[["remote","ircode","0","1"]]'
#example: ./irsend_mult.sh 'mode=status&json=["10"]'
#example: ./irsend_mult.sh 'mode=list'


location="${0%/*}"
liblocation="${location}/bash-libs"
datalocation="${location}/data"
idlocation="${location}/data/ids"

return_value=""

# for string-trim
. "${liblocation}/string/trim.sh"

# for time-realtime and time-microseconds
. "${liblocation}/time/microseconds.sh"

#for url-encode and url-decode urr-parse-get-post
. "${liblocation}/url/encode.sh"
. "${liblocation}/url/decode.sh"
. "${liblocation}/url/parse-get-post.sh"

#for json-list2array and json-listOfLists2arrayOfLists
. "${liblocation}/json/list2array.sh"

errors="false"

#last time since we want to kill any existing ones when we end new ones.
time_start_file=/tmp/${USER}_irsend_started_time.txt
time-realtime time_start


process(){
  remote="$1"
  ircode="$2"
  delay="$3"
  loops="$4"
  idfile="$5"
  local both
  #echo "irsend \"send_once\" \"$remote\" \"$ircode\""
  ( [ -n "$remote" ] && [ -n "$ircode" ] )&& both=$(irsend send_once "$remote" "$ircode" 2>&1)
  remove_newlines both
  printf '["%s","%s","%s","%s","%s"]\n' "$remote" "$ircode" "$delay" "$loops" "${both%%.}" >> "$idfile"
}

wait_delay()
{
  delay="$(($1*1000))"
  status_file="$2"
  local start=""
  time-realtime start
  local interval=0
  local diff=0
  local now
  echo 0 > /tmp/${USER}_irsend_sleep
  local message="$start sleeping $delay microseconds"
  write_data_msg message >> "$status_file"
  while [ "$((delay-diff))" -gt "0" ];do
    time-microseconds $start now diff
    [ "${interval}" -gt 1000 ] && interval=0 && \
      echo "$((delay-diff)))" > /tmp/${USER}_irsend_sleep
    [ "$(cat ${time_start_file})" != "${time_start}" ] && \
      echo '["interupted"]' >> "$status_file" && exit;
    sleep .0001
    ((interval++))
  done
  echo "[\"$now woke up\"]" >> "$status_file"
}

macro() {
  local id="$1"
  local json="$2"
  [ -z "$id" ] && id="$time_start"

  header
  # Send response to client immediately
  echo "[\"$id\"]"
  echo "$json"
  printf '%q %q %q\n' "${location}/macro_helper.sh" "$id" "$json" | at now >/dev/null 2>&1
}

header()
{
 printf "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"
}

status(){
  header
  local array=()
  json-list2array "$1" array 3
  local id="${array[0]}"
  local start="${array[1]}"
  local end="${array[2]}"
  ([ -z "$id" ] || [ "$id" = "null" ]) && echo '["finished"]' && return 0
  ([ -z "$start" ] || [ "$start" = "null" ]) && start=0;
  ([ -z "$end" ] || [ "$end" = "null" ] )&& end=-1;
  file="${location}/data/ids/${id}.jsonl"
  [ ! -f ${file} ] && echo '["finished"]' && return 0
  [ "$end" = "-1" ] && {
    message=$(dd if="$file" bs=1 skip="$start" status=none)
  } || {
    local count=$(( end - start + 1 ))
    message=$(dd if="$file" bs=1 skip="$start" count="$count" status=none)
  }
  echo -e "$message"

  local lastlinedata="${message##*$'\n'}"
  local array
  json-list2array "$lastlinedata" array
  case "${array[0]}" in
   "finished"|"interupted") rm -f "$file";;
  esac
}

remove_newlines() {
  declare -n __string="$1"
  __string="${__string//$'\n'/\\\\n}"
}

write_data_msg(){
  declare -n __message="$1";
  [[  -z "${__message}" ]] && \
  echo "[\"successfully written ${datalocation}/get_${extension}.js\"]" && return 0;
  remove_newlines __message;
  echo "[\"$__message\"]";
}

write(){
  extension=$1
  declare -n __json=$2
  header
  case "${extension}" in
    "activities"|"displays"|"macros"|"modules"|"remotes")
      string-trim __json
      message=$(
        echo "function get_${extension}(){ return ${__json};}" \
        > "${datalocation}/get_${extension}.js" 2>&1)
      write_data_msg message
    ;;
    *)
      message="invalid type ${extension} to mode write"
      write_data_msg message
    ;;
  esac
}

list()
{
  local del=""
  local all_buttons="{"
  local remote buttons first_button line button

  # Loop over all remotes
  while IFS= read -r remote; do
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
  readinto data
  sanitize data "${data}"
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
      echo "${time_start}" > "${time_start_file}"
      [ "${mode}" = "stop" ] &&  header && echo '["stopping"]' && return 0
      macro "$id" "$json"
    ;;

    'write_'* )
      extension="${mode##*_}"
      write "${extension}" json
    ;;

    *)
      header
      message="invalid mode ${extension}"
      write_data_msg message
    ;;
  esac
}

main "$*"
