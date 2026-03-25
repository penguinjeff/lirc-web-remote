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
#example: ./macro_helper.sh "10" '[["remote","ircode","0","1"]]'


location="${0%/*}"
liblocation="${location}/bash-libs"
datalocation="${location}/data"
idlocation="${location}/data/ids"

return_value=""

# for time-realtime and time-microseconds
. "${liblocation}/time/microseconds.sh"

#for json-list2array and listOfLists2arrayOfLists
. "${liblocation}/json/list2array.sh"
. "${liblocation}/json/listOfLists2arrayOfLists.sh"

errors="false"

#last time since we want to kill any existing ones when we end new ones.
time_start_file=/tmp/${USER}_irsend_started_time.txt
time-realtime time_start

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


macro_helper()
{
  echo "${time_start}" > "${time_start_file}"
  id="$1"
  json="$2"
  local message=""
  local array=()
  json-listOfLists2arrayOfLists "${json}" arrayOfLists
  for row in "${arrayOfLists[@]}"; do
    [ "$(cat ${time_start_file})" != "${time_start}" ] && \
      echo '["interupted"]' >> "${idlocation}/${id}.jsonl" && exit;
    json-list2array "$row" array 4
    remote="${array[0]}"
    ircode="${array[1]}"
    delay="${array[2]}"
    loops="${array[3]}"
    [ -z "$delay" ] && delay=0
    [ -z "$loops" ] && loops=1
    #time-realtime current
    while [ "${loops}" -gt "0" ];do
      wait_delay "${delay}" "${idlocation}/${id}.jsonl"
      process "${remote}" "${ircode}" "${delay}" "${loops}" "${idlocation}/${id}.jsonl"
      ((loops--))
      [ "$(cat ${time_start_file})" != "${time_start}" ] && \
        echo '["interupted"]' >> "${idlocation}/${id}.jsonl" && exit;
    done
  done
  echo '["finished"]' >> "${idlocation}/${id}.jsonl"
}

json=$(< "${location}/data/macro.json")
rm -rf "${location}/data/macro.json"
macro_helper "$1" "$json"
