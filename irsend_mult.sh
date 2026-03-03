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
#example: ./irsend_mult.sh 'mode=status&id=10'
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

errors="false"

broke='false'
current=""
#last time since we want to kill any existing ones when we end new ones.
time_start_file=/tmp/${USER}_irsend_started_time.txt
time_start=""
time-realtime time_start


# THIS IS WRONG somehow reading a file takes less time than using ps
# I'll leave this here commented out so I can use it as reference
# I thought reading from a file would take longer than checking if a background process is running
# I created this process to run in the background to check the file
#function watch_startfile()
#{
# while true;do
#  if [ "$(cat ${time_start_file})" != "${time_start}" ];then
#   break;
#  fi
#  sleep .01
# done
#}
#watch_startfile &
#pid=$!


# extract function
# get a specified variable name from input
# example:
# if sanatize="arg1=test"
# "extract arg1" should return test
sanatized=""

lines() {  echo -ne "$1"|jq -c -M -R -s 'split("\n")'; }

subrestart(){
        local stdout=$(systemctl restart irsend_mult.sh);
        urlencode "${stdout}" return_value
        jq -n --arg stdout "${return_value}" '$ARGS.named'
}

subprocess() { irsend "send_once" "$1" "$2" 2>&1; }

process(){
  remote="$1"
  ircode="$2"
  delay="$3"
  loops="$4"
  idfile="$5"
  local both
  #echo "irsend \"send_once\" \"$remote\" \"$ircode\""
  [ -z "remote" ] && both=$(subprocess "$remote" "$ircode")
  message="[\"$remote\",\"$ircode\",\"$delay\",\"$loops\",\"${both%%.}\"]" && \
  write_unquoted_data_msg message >> "$idfile"
}

wait()
{
  delay="$1"
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
      message="interupted" && write_data_msg message >> "$status_file" && exit;
    sleep .0001
    ((interval++))
  done
  message="$now woke up"
  write_data_msg message >> "$status_file"
}

macro_helper()
{
  id="$1"
  json="$2"
  local message=""
  #time-realtime current
  #printf '%s' ${json} >> /tmp/irsend_mult-${current}.txt

  while read row; do
    [ "$(cat ${time_start_file})" != "${time_start}" ] && broke="true" && break;
    remote=$(echo "$row" | jq -r '.[0]' 2>/dev/null)
    ircode=$(echo "$row" | jq -r '.[1]' 2>/dev/null)
    delay=$(echo "$row" | jq -r '.[2]' 2>/dev/null|sed "s/^0*[^0-9]*//")
    loops=$(echo "$row" | jq -r '.[3]' 2>/dev/null|sed "s/^0*[^0-9]*//")
    [ -z "$delay" ] && delay=0
    [ -z "$loops" ] && loops=1
    #time-realtime current
    while [ "${loops}" -gt "0" ];do
      wait "${delay}" "${idlocation}/${id}.jsonl"
      process "${remote}" "${ircode}" "${delay}" "${loops}" "${idlocation}/${id}.jsonl"
      echo $((loops--)) > /dev/null
      [ "$(cat ${time_start_file})" != "${time_start}" ] && \
        message="interupted" && \
        write_data_msg message >> "${idlocation}/${id}.jsonl" && exit;
    done
  done <<< $(printf '%s' "${json}" | jq -Mc .[] 2>/dev/null);
  message="finnished"
  write_data_msg message >> "${idlocation}/${id}.jsonl"
}

macro()
{
  local id="$1"
  local json="$2"
  [ -z "$id" ] && id="$time_start"
  header
  macro_helper "$id" "$json" &
  disown %1
  local message="$id"
  wrap_element "id" message
  write_data_msg message
}

header()
{
 printf "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"
}

stop()
{
 header
 printf '{"status":"stopping"}\n'
}

status(){
  local id="$1"
  local json="$2"
  local start=$(echo "$json"|jq -r .'start' 2>/dev/null)
  local end=$(echo "$json"|jq -r .'end' 2>/dev/null)
  ([ -z "$start" ] || [ "$start" = "null" ]) && start=0;
  ([ -z "$end" ] || [ "$end" = "null" ] )&& end=-1;
  file="${location}/data/ids/${id}.jsonl"
  [ "$end" = "-1" ] && {
    message=$(dd if="$file" bs=1 skip="$start" status=none)
  } || {
    local count=$(( end - start + 1 ))
    message=$(dd if="$file" bs=1 skip="$start" count="$count" status=none)
  }
  header
  echo -e "$message"
  lastlinedata=$(echo -e "$message" | tail -n 1 | jq -r .'data')
  case "$lastlinedata" in
   "finnished"|"interupted") rm "$file";;
  esac
}

remove_newlines()
{
 declare -n __string="$1"
 __string="${__string//$'\n'/}"
}

wrap_element(){
  declare -n __element="$2"
  remove_newlines __element
  printf -v __element '{"%s":"%s"}' "$1" "${__element}"
}

wrap_unquoted_element(){
  declare -n __element="$2"
  remove_newlines __element
  printf -v __element '{"%s":%s}' "$1" "${__element}"
}

write_data_msg(){
  declare -n __message="$1"
  [ "${__message}" = "" ] && \
    __message="successfully written ${datalocation}/get_${extension}"
  wrap_element "data" __message
  echo "${__message}"
}

write_unquoted_data_msg(){
  declare -n __message="$1"
  [ "${__message}" = "" ] && \
    __message="successfully written ${datalocation}/get_${extension}"
  wrap_unquoted_element "data" __message
  echo "${__message}"
}

write(){
  extension=$1
  declare -n __json=$2
  header
#  echo "json:$__json"
  case "${extension}" in
    "activities"|"displays"|"macros"|"modules"|"remotes")
      string-trim __json
      message=$(
        echo "function get_${extension}(){ return ${__json};}" \
        > "${datalocation}/get_${extension}" 2>&1)
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
  location=$(dirname $0)
  local del=""
  remote_buttons() {
    while read remote; do
      buttons=$(
        irsend list "${remote}" '' | awk '{print $2}' | \
        sed 's/^/"/' | sed 's/$/",/'|sed -z 's/\n//g' 2>&1)
      printf '%s"%s":[%s]' "${del}" "${remote}" "${buttons::-4}"
      del=","
    done <<< "$(irsend list '' ''||printf '';)"
  }
  all_buttons="{$(remote_buttons 2>&1)}"
  write "remotes" all_buttons
}

main()
{
  #get input from user and sanatize it.
  while read -t .01 line;do
    sanatized=$(echo "${line}" | \
    sed 's/[^A-Za-z0-9\_\.\-\+\=\&\{\}\%\[\] ]//g' | sed 's/%22/\"/g' \
      | sed 's/%5B/\[/g' | sed 's/%5D/\]/g' )
    [ "${sanatized:0:3}" != "GET " ] && break
    [ "${line}" = "" ] && break
  done
  [ -n "$1" ] && sanatized="$1"

  declare -A my_params
    url-parse-get-post "${sanatized}" '' output my_params

  local mode="${my_params["mode"]}"
  local json="${my_params["json"]}"
  local id="${my_params["id"]}"
  case "${mode}" in
    "list") list; return 0;;

    "status") status "$id" "$json";;

    "macro"|"stop")
      echo "${time_start}" > "${time_start_file}"
      [ "${mode}" = "stop" ] && stop && return 0
      macro "$id" "$json"
    ;;


    'write.'* )
      extension="${mode##*.}"
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
