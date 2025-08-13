#!/bin/bash
# Written by: Jeff Sadowski
# this program simply runs irsend and outputs a JSON with any errors
# If you give it the list argument like the first example
# it will return a JSON with the remotes with thier understood irsignals
# defined in your lirc files
#                                              name of the remote listed in irsend list EX: samsungTVremote
#                                              |           the ircode that would you want sent from that remote EX: key_power
#                                              |            |         delay in miliseconds
#                                              |            |         |        loops minimum 1
#                                              V            V         V        V
#example: echo GET "json={%22ircodes%22:[[%22remote%22,%22ircode%22,%220%22,%221%22]]" | ./irsend_mult.sh
printf "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"
errors="false"

broke='false'
#last time since we want to kill any existing ones when we end new ones.
time_start_file=/tmp/${USER}_irsend_started_time.txt
time_start=$(date +%s)-$RANDOM
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

function urlencode()
{
 # urlencode <string>
 local length="${#1}"
 for (( i = 0; i < length; i++ )); do
  local c="${1:i:1}"
   case $c in
    [a-zA-Z0-9.~_-]) printf "$c" ;;
    *) printf '%%%02X' "'$c" ;;
   esac
 done
}

function urldecode()
{
 # urldecode <string>
 local url_encoded="${1//+/ }"
 printf '%b' "${url_encoded//%/\\x}"
}

sleepvar=0

function sleepfor()
{
 local start=$(echo "$(date +%s.%N)*1000/1"|bc)
 local current=${start};
 local delay=${sleepvar};
 local interval=0
 while [ "$(echo "${delay}-(${current}-${start})"|bc)" -gt "0" ];do
  sleep .0001
  interval=$((${interval}+1))
  current=$(echo "$(date +%s.%N)*1000/1"|bc)
  [ "${interval}" -gt 1000 ] && interval=0 && echo "${sleepvar}-(${current}-${start})" | bc > /tmp/${USER}_irsend_sleep
 done
 sleepvar=0
 echo 0 > /tmp/${USER}_irsend_sleep
}

# extract function
# get a specified variable name from input
# example:
# if sanatize="arg1=test"
# "extract arg1" should return test
function extract() { echo -n "${sanatized}"|awk '{print $2 "&"}'|sed -n "s/.*$1=\([^&]*\).*/\1/p"; }

function lines() {  echo -ne "$1"|jq -c -M -R -s 'split("\n")'; }

function add2ran()
{
 ran+=("$(jq -c -n \
                  --argjson args "$(lines "$1\n$2")" \
                  --arg delay "$3" \
                  --arg loops "$4" \
                  --argjson stdout "$(lines "$(echo -e "$5" | grep -v "^$" | sed 's/\"/%22/g')")" \
                  --argjson stderr "$(lines "$(echo -e "$6" | grep -v "^$" | sed 's/\"/%22/g')")" \
                  '$ARGS.named' \
             )")
 if [ "$(echo -e "$7" | grep -v "^$")" != "" ];then
  errors="true from ran"
 fi
}

function subrestart
{
 local stdout=$(systemctl restart irsend_mult.sh);
 jq -n --arg stdout "$(urlencode "${stdout}")" '$ARGS.named'
}

function subprocess()
{
 local stdout=$(irsend "send_once" "$1" "$2");
 jq -n --arg stdout "$(urlencode "${stdout}")" '$ARGS.named'
}

function process()
{
# echo "irsend \"send_once\" \"$1\" \"$2\""
 local both=$(subprocess $1 $2 2>&1)
 stderr=$(echo -e "${both}"|sed -z 's/{[^{]*$//')
 #Reform stdout back to it's original form
 stdout=$(urldecode "$(echo -e "${both}"|sed -z 's/.*\({[^{]*\)$/\1/'|jq -r .stdout)")
 add2ran "$1" "$2" "$3" "$4" "${stdout}" "${stderr}"
}

#get input from user and sanatize it.
while read -t .01 line;do sanatized=$(echo "${line}" | \
sed 's/[^A-Za-z0-9\_\.\-\+\=\&\{\}\%\[\] ]//g' | sed 's/%22/\"/g' \
 | sed 's/%5B/\[/g' | sed 's/%5D/\]/g' )
[ "$(echo $sanatized|awk '{print $1}')" = "GET" ] && break
[ "${line}" = "" ] && break
done

declare -a ran

json=$(extract json)

#printf '%s' ${json} >> /tmp/irsend_mult-$(date +%s).txt

#error checking if json is bad it will give check something otherwise it will be empty
check=$(printf '%s' "${json}" | jq -Mc '.ircodes[]' 2>&1 1>/dev/null)

if [ "$check" = "" ];then
while read row; do
 if [ "$(cat ${time_start_file})" != "${time_start}" ];then
  broke="true";
  break;
 fi
 count=$(printf '%s' "$row" | jq length)
 if [ "${count}" -gt "4" ];then
  arg1=$(printf '%s' "$row" | jq -r '.[0]')
  arg2=$(printf '%s' "$row" | jq -r '.[1]')
  delay=$(printf '%s' "$row" | jq -r '.[3]'|sed "s/[^0-9]*//g")
  loops=$(printf '%s' "$row" | jq -r '.[4]'|sed "s/[^0-9]*//g")
  if [ "${delay}" = "" ];then delay=0; fi
  if [ "${loops}" = "" ];then loops=1; fi
  while [ "${loops}" -gt "0" ];do
   process "${arg1}" "${arg2}" "${delay}" "${loops}"
   loops=$((${loops}-1))
   if [ "$(cat ${time_start_file})" != "${time_start}" ];then
    broke="true";break;
   fi
  done
  start=$(echo "$(date +%s.%N)*1000/1"|bc)
  current=${start};
  interval=0
  while [ "$(echo "${delay}-(${current}-${start})"|bc)" -gt "0" ];do
   if [ "$(cat ${time_start_file})" != "${time_start}" ];then
    broke="true";break;
   fi
   sleep .0001
   interval=$((${interval}+1))
   current=$(echo "$(date +%s.%N)*1000/1"|bc)
   [ "${interval}" -gt 1000 ] && interval=0 && echo "${delay}-(${current}-${start})" | bc > /tmp/${USER}_irsend_sleep
  done
  echo 0 > /tmp/${USER}_irsend_sleep
 fi
done <<< $(printf '%s' "${json}" | jq -Mc '.ircodes[]');
else
 ran+=("$(jq -n --arg stderr "Not given a proper json" '$ARGS.named')")
 errors="true bad json"
fi

jq -n \
 --argjson ran "$(echo -e "$(for item in "${ran[@]}"; do echo "$item";done)" | jq -s .)" \
 --arg broke "${broke}" \
 --arg errors "${errors}" \
 '$ARGS.named'
