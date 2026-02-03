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

return_value=""

# realtime is just a function wrapper for $EPOCHREALTIME if you have a latter bash version
# otherwise it uses date unfortunately it forks for date
# if given a variable as an argument it avoids a fork layer.

#this prevents mistakes for someone setting a varable EPOCHREALTIME
#a system that implements this should have a diffent time for both
#unless it is really really fast and in that case you are on your own
if [ "$EPOCHREALTIME" != "$EPOCHREALTIME" ];then
        function realtime(){
                # if we are not given a variable to send to write to local retval
                [ "$1" = "" ] && local retval=""
                [ "$1" != "" ] && local -n retval="$1"
                retval=$EPOCHREALTIME;
                # if we are not given a variable to send to echo to screen
                [ "$1" = "" ] && echo "$retval"
        }
else
        # echo "falling back and using date"
        function realtime(){
                # if we are not given a variable to send to write to local retval
                [ "$1" = "" ] && local retval=""
                [ "$1" != "" ] && local -n retval="$1"
                retval=$(date +%s.%6N);
                # if we are not given a variable to send to echo to screen
                [ "$1" = "" ] && echo "$retval"
        }
fi

# microseconds is a function that calculates the difference between 2 times
# given in $seconds.$nanosecond format to the nearest microsecond
# only the fist time is nessicary if a second time is not given or
# is an emtpty string (IE:"") it gets the current time as the
# second time if you give a 3rd option of a variabe to put it in
# you can eliminate a fork and it does not print to screen
function microseconds() {
        # if we are not given a variable write to local retval
        [ "$3" = "" ] && local retval=""
        [ "$3" != "" ] && local -n retval="$3"
        local current="$2"
        # if the second argument is blank get the current time to compare
        [ "${current}" = "" ] && realtime current
        # get the part after the decimal
        local dec1="${1##*.}"
        # get the part after the decimal
        local dec2="${current##*.}"
        # multiply the difference in sceonds times 1000000
        # add the difference in micro seconds
        retval=$(( (${current%%.*} - ${1%%.*})*1000000+(10#${dec2:0:6} - 10#${dec1:0:6})));
        # if we are not given a variable echo to screen
        [ "$3" = "" ] && echo "$retval"
}


printf "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"
errors="false"

broke='false'
current=""
#last time since we want to kill any existing ones when we end new ones.
time_start_file=/tmp/${USER}_irsend_started_time.txt
time_start=""
realtime time_start
echo ${time_start} > ${time_start_file}


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

function list()
{
	location=$(dirname $0)
	remote_buttons() {
		while read remote; do
			buttons=$(irsend list "${remote}" ''|awk '{print $2}'|sed 's/^/"/' | sed 's/$/",/'|sed -z 's/\n//g')
			printf '"%s":[%s],' "${remote}" "${buttons::-4}" 
		done <<< "$(irsend list '' ''||printf '';)"
	}
	all_buttons=$(remote_buttons)
	printf '{"remotes":{%s}}' "${all_buttons::-1}" > ${location}/remotes/remotes.js
	printf 'function get_remotes(){ return {%s};}' "${all_buttons::-1}" > ${location}/remotes/get_remotes.js
	chmod g+w ${location}/remotes/*
}

function urlencode()
{
	# urlencode <string>
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
	# urldecode <string>
	[ "$2" = "" ] && local retval=""
	[ "$2" != "" ] && local -n retval="$2"
	local url_encoded="${1//+/ }"
	printf -v retval '%b' "${url_encoded//%/\\x}"
	[ "$2" = "" ] && echo "${retval}"
}

sleepvar=0

# extract function
# get a specified variable name from input
# example:
# if sanatize="arg1=test"
# "extract arg1" should return test
sanatized=""
function extract() { echo -n "${sanatized}"|awk '{print $2 "&"}'|sed -n "s/.*$1=\([^&]*\).*/\1/p"; }

function lines() {  echo -ne "$1"|jq -c -M -R -s 'split("\n")'; }

function add2ran()
{
	ran+=("$(jq -c -n \
		--argjson args "$(lines "$1\n$2")" \
		--arg delay "$3" \
		--arg loops "$4" \
		--argjson stderr "$(lines "$(echo -e "$5" | grep -v "^$" | sed 's/\"/%22/g')")" \
		'$ARGS.named' \
	     )")
	[ "$(echo -e "$7" | grep -v "^$")" != "" ] && errors="true from ran"
}

function subrestart
{
	local stdout=$(systemctl restart irsend_mult.sh);
	urlencode "${stdout}" return_value
	jq -n --arg stdout "${return_value}" '$ARGS.named'
}

function subprocess() { irsend "send_once" "$1" "$2" 2>&1&&echo .true-||echo .false; }

function process()
{
	# echo "irsend \"send_once\" \"$1\" \"$2\""
	local both=$(subprocess $1 $2)
	[ "${both##*.}" = 'false' ] && add2ran "$1" "$2" "$3" "$4" "${both%%.}"
}

declare -a ran

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

	json=$(extract json)

	#realtime current
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
                [ "${count}" != "0" ] && break;
		[ "${count}" != "4" ] && 
			ran+=("$(jq -n --arg stderr "Wrong number of arguments" '$ARGS.named')") &&
			errors="true bad json" &&
			return 1;
		#realtime current
		#  echo "${current} $row" >> /tmp/activity.txt
		arg1=$(echo "$row" | jq -r '.[0]')
		arg2=$(echo "$row" | jq -r '.[1]')
		delay=$(echo "$row" | jq -r '.[2]'|sed "s/^0*[^0-9]*//")
		loops=$(echo "$row" | jq -r '.[3]'|sed "s/^0*[^0-9]*//")
		#realtime current
		#  echo "${current} $arg1 $arg2 $delay $loops" >> /tmp/activity.txt
		[ "${delay}" = "" ] && delay=0;
		[ "${loops}" = "" ] && loops=1;
		while [ "${loops}" -gt "0" ];do
			process "${arg1}" "${arg2}" "${delay}" "${loops}"
			loops=$((${loops}-1))
			[ "$(cat ${time_start_file})" != "${time_start}" ] && broke="true" && break;
		done
                local start=""
		realtime start
		interval=0
		microseconds $start "" ms_return_value
		while [ "$((delay-${ms_return_value}))" -gt "0" ];do
			[ "$(cat ${time_start_file})" != "${time_start}" ] && broke="true" && break;
			sleep .0001
			((interval++))
			realtime current
			microseconds $start $current ms_return_value
			[ "${interval}" -gt 1000 ] && interval=0 && echo "$((delay-$(microseconds $start $current)))" > /tmp/${USER}_irsend_sleep
		done
		echo 0 > /tmp/${USER}_irsend_sleep
	done <<< $(printf '%s' "${json}" | jq -Mc '.ircodes[]');
}

main "$*"
jq -n \
	--argjson ran "$(echo -e "$(for item in "${ran[@]}"; do echo "$item";done)" | jq -s .)" \
	--arg broke "${broke}" \
	--arg errors "${errors}" \
	'$ARGS.named'
