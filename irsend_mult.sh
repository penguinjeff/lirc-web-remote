#!/bin/bash
# Written by: Jeff Sadowski
# this program simply runs irsend and outputs a JSON with any errors
# If you give it no arguments like the first example
# it will update $PWD/remotes/remotes.json
# defined in your lirc files
#                                              name of the remote listed in irsend list EX: samsungTVremote
#                                              |           the ircode that would you want sent from that remote EX: key_power
#                                              |            |         delay in miliseconds 0
#                                              |            |          |       loops minimum 1
#                                              V            V          V       V
#example: echo GET "json={%22ircodes%22:[[%22remote%22,%22ircode%22,%220%22,%221%22]]}" | ./irsend_mult.sh

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


sleepvar=0

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

subprocess() { irsend "send_once" "$1" "$2" 2>&1&&echo .true-||echo .false; }

process(){
	remote="$1"
	ircode="$2"
	delay="$3"
	loops="$4"
	idfile="$5"
	# echo "irsend \"send_once\" \"$remote\" \"$ircode\""
	local both=$(subprocess $1 $2)
	[ "${both##*.}" = 'false' ] && echo "{\"status\":[\"$remote\",\"$ircode\",\"$delay\",\"$loops\",\"${both%%.}\"" > "$idfile"
}

declare -a ran

wait()
{
  delay="$1"
  local start=""
  time-realtime start
  local interval=0
  local diff=0
  echo 0 > /tmp/${USER}_irsend_sleep
  while [ "$((delay-diff))" -gt "0" ];do
    time-microseconds $start now diff
    [ "${interval}" -gt 1000 ] && interval=0 && echo "$((delay-diff)))" > /tmp/${USER}_irsend_sleep
    [ "$(cat ${time_start_file})" != "${time_start}" ] && broke="true" && break;
    sleep .0001
    ((interval++))
  done
}

end(){
  id=$1
  message=$1
}

macro_helper()
{
	id="$1"
	json="$2"
	#time-realtime current
	#printf '%s' ${json} >> /tmp/irsend_mult-${current}.txt

	#error checking if json is bad it will give check something otherwise it will be empty
	check=$(printf '%s' "${json}" | jq -Mc '.ircodes[]' 2>&1 1>/dev/null)


	[ "$check" != "" ] &&
		ran+=("$(jq -n --arg stderr "Not given a proper json" '$ARGS.named')") &&
		errors="true bad json" &&
		return 1;
	[ "$(printf '%s' "${json}" | jq -Mc '.ircodes[]')" = "" ] && list && exit 0
	while read row; do
		[ "$(cat ${time_start_file})" != "${time_start}" ] && broke="true" && break;
		count=$(echo "$row" | jq length)
		[ "${count}" != "4" ] &&
			message="Wrong number of arguments" >> "${idlocation}/${id}.jsonl"
			errors="true bad json" &&
			return 1;
		#time-realtime current
		#  echo "${current} $row" >> /tmp/activity.txt
		remote=$(echo "$row" | jq -r '.[0]')
		ircode=$(echo "$row" | jq -r '.[1]')
		delay=$(echo "$row" | jq -r '.[2]'|sed "s/^0*[^0-9]*//")
		loops=$(echo "$row" | jq -r '.[3]'|sed "s/^0*[^0-9]*//")
		#time-realtime current
		[ "${delay}" = "" ] && delay=0;
		[ "${loops}" = "" ] && loops=1;
		wait "${delay}"
		while [ "${loops}" -gt "0" ];do
			process "${remote}" "${ircode}" "${delay}" "${loops}" "${idlocation}/${id}.jsonl"
			$((loops--))
			[ "$(cat ${time_start_file})" != "${time_start}" ] && end "$id" "interupted" && exit;
		done
	done <<< $(printf '%s' "${json}" | jq -Mc '.ircodes[]');
	[ "broke" = "true" ] && echo '{"status":"interrupted"}'
	echo '{"status":"finnished"}'
}

macro()
{
	id="$1"
	json="$2"
	header
	["$"]
	macro_helper "$1" "$2" &
	disown %1
}

header()
{
 printf "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"
}

stop()
{
 header
 printf '{"status":"stopping"}'
}

status(){
  id="$1"
  json="$2"
}

wrap_element(){
  declare -n __element="$2"
  printf -v __element '{"%s":"%s"}' "$1" "${__element}"
}

write_data_msg(){
  declare -n __message="$1"
  [ "${__message}" = "" ] && __message="successfully written ${datalocation}/get_${extension}"
  wrap_element "data" __message
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
      message=$(echo "function get_${extension}(){ return ${__json};}" > "${datalocation}/get_${extension}" 2>&1)
      write_data_msg message
    ;;
    *)
      message="invalid type ${extension} to mode write"
      write_data_msg message
    ;;
  esac
}


function list()
{
	location=$(dirname $0)
	local del=""
	remote_buttons() {
		while read remote; do
			buttons=$(irsend list "${remote}" ''|awk '{print $2}'|sed 's/^/"/' | sed 's/$/",/'|sed -z 's/\n//g')
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
      [ "${mode}" = "stop" ] && stop
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
