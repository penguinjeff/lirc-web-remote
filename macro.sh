#!/bin/bash
# Written by: Jeff Sadowski
# this program simply runs irsend and outputs a JSON with any errors
#                                      name of the remote listed in irsend list EX: samsungTVremote
#                                      |        the ircode that would you want sent from that remote EX: key_power
#                                      |        |      delay in miliseconds 0
#                                      |        |      |   loops minimum 1
#                                      V        V      V   V
#example: ./macro.sh "10" '[["remote","ircode","0","1"]]'


location="${0%/*}"
. "${location}/common.sh"

# for time-realtime and time-microseconds
. "${liblocation}/time/microseconds.sh"

#for listOfLists2arrayOfLists
. "${liblocation}/json/listOfLists2arrayOfLists.sh"
mkdir -p "${idlocation}"

wait_delay()
{
  delay="$(($1*1000))"
  idfile="$2"
  local start=""
  time-realtime start
  local diff=0
  local now="$start"
  msg o "$now" "sleeping $delay microseconds" >> "$idfile"
  while [ "$((delay-diff))" -gt "0" ];do
    time-microseconds $start now diff
    read file_time <"${time_start_file}"
    if [ "${file_time}" != "${time_start}" ];then msg i >> "$idfile"; return 1; fi
    sleep .0001
  done
  msg o "$now" "woke up" >> "$idfile"
  return 0
}

process(){
  remote="$1"
  ircode="$2"
  delay="$3"
  loops="$4"
  idfile="$5"
  local both
  command_exists irsend || { header; msg e "missing irsend" "$1" "$2" >> "$idfile"; return 0; }
  #echo "irsend \"send_once\" \"$remote\" \"$ircode\""
  ( [ -n "$remote" ] && [ -n "$ircode" ] )&& both=$(irsend send_once "$remote" "$ircode" 2>&1)
  remove_newlines both
  [ -n "${both}" ] && msg e "${both}" "$remote" "$ircode" "$delay" "$loops" >> "$idfile" || \
  msg o "$remote" "$ircode" "$delay" "$loops" >> "$idfile"
}

macro()
{
  echo "${time_start}" > "${time_start_file}"
  id="$1"
  json="$2"
  local message=""
  local array=()
  json-listOfLists2arrayOfLists "${json}" arrayOfLists
  for row in "${arrayOfLists[@]}"; do
    read file_time <"${time_start_file}"
    if [ "${file_time}" != "${time_start}" ];then msg i >> "${idlocation}/${id}.jsonl"; return 1; fi
    json-list2array "$row" array 4
    remote="${array[0]}"
    ircode="${array[1]}"
    delay="${array[2]}"
    loops="${array[3]}"
    [ -z "$delay" ] && delay=0
    [ -z "$loops" ] && loops=1
    #time-realtime current
    while [ "${loops}" -gt "0" ];do
      wait_delay "${delay}" "${idlocation}/${id}.jsonl" || return 1;
      process "${remote}" "${ircode}" "${delay}" "${loops}" "${idlocation}/${id}.jsonl"
      ((loops--))
      read file_time <"${time_start_file}"
      if [ "${file_time}" != "${time_start}" ];then msg i >> "${idlocation}/${id}.jsonl" && return 1; fi
    done
  done
  msg f >> "${idlocation}/${id}.jsonl"
}
[ -n "$2" ] && json="$2" || json=$(< "${json_pass}")
echo "2=$2"
echo "json_pass=${json_pass}"
rm -rf "${json_pass}"
macro "$1" "$json"
sleep 10
rm -rf "${idlocation}/$1.jsonl"
