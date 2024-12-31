#!/bin/bash
# Written by: Jeff Sadowski
# this program simply runs irsend and outputs a JSON with any errors
# If you give it the list argument like the first example
# it will return a JSON with the remotes with thier understood irsignals
# defined in your lirc files

urlencode()
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

urldecode()
{
 # urldecode <string>
 local url_encoded="${1//+/ }"
 printf '%b' "${url_encoded//%/\\x}"
}


#example: echo GET "json={%22ircodes%22:[[%22list%22,%22%22,%22%22,%220%22,%221%22]]" | ./irsend_mult.sh
echo -e "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"
errors="false"


#last time since we want to kill any existing ones when we end new ones.
time_start_file=/tmp/${USER}_irsent_started_time.txt
time_start=$(date +%s)-$RANDOM
echo ${time_start} > ${time_start_file}

#get input from user and sanatize it.
while read -t .01 line;do sanatized=$(echo "${line}" | \
sed 's/[^A-Za-z0-9\_\.\-\+\=\&\{\}\%\[\] ]//g' | sed 's/%22/\"/g' \
 | sed 's/%5B/\[/g' | sed 's/%5D/\]/g' )
[ "$(echo $sanatized|awk '{print $1}')" = "GET" ] && break
[ "${line}" = "" ] && break
done

# extract function
# get a specified variable name from input
# example:
# if sanatize="arg1=test"
# "extract arg1" should return test
function extract() { echo -n "${sanatized}"|awk '{print $2 "&"}'|sed -n "s/.*$1=\([^&]*\).*/\1/p"; }

function lines() {  echo -ne "$1"|jq -c -M -R -s 'split("\n")'; }

declare -a ran
function add2ran()
{
 ran+=("$(jq -c -n \
                  --argjson args "$(lines "$1\n$2\n$3")" \
                  --arg delay "$4" \
                  --arg loops "$5" \
                  --argjson stdout "$(lines "$(echo -e "$6" | grep -v "^$" | sed 's/\"/%22/g')")" \
                  --argjson stderr "$(lines "$(echo -e "$7" | grep -v "^$" | sed 's/\"/%22/g')")" \
                  '$ARGS.named' \
             )")
 if [ "$(echo -e "$7" | grep -v "^$")" != "" ];then
  errors="true from ran"
 fi
}

function subprocess()
{
 local stdout=$(irsend "$1" "$2" "$3");
 jq -n --arg stdout "$(urlencode "${stdout}")" '$ARGS.named'
}

function process()
{
# echo "irsend \"$1\" \"$2\" \"$3\""
 local both=$(subprocess $1 $2 $3 2>&1)
 stderr=$(echo -e "${both}"|sed -z 's/{[^{]*$//')
 #Reform stdout back to it's original form
 stdout=$(urldecode "$(echo -e "${both}"|sed -z 's/.*\({[^{]*\)$/\1/'|jq -r .stdout)")
 add2ran "$1" "$2" "$3" "$4" "$5" "${stdout}" "${stderr}"
}

json=$(extract json)

#echo ${json}
declare -a remotes_json
broke="false";

check=$(echo "${json}" | jq -c '.ircodes[]' 2>&1 1>/dev/null)

if [ "$check" = "" ];then
for row in $(echo "${json}" | jq -c '.ircodes[]'); do
 if [ "$(cat ${time_start_file})" != "${time_start}" ];then
  broke="true";
  break;
 fi
 count=$(echo "$row" | jq length)
 if [ "${count}" -gt "4" ];then
  arg1=$(echo "$row" | jq -r '.[0]')
  arg2=$(echo "$row" | jq -r '.[1]')
  arg3=$(echo "$row" | jq -r '.[2]')
  delay=$(echo "$row" | jq -r '.[3]'|sed "s/[^0-9]*//g")
  loops=$(echo "$row" | jq -r '.[4]'|sed "s/[^0-9]*//g")
  if [ "${delay}" = "" ];then delay=0; fi
  if [ "${loops}" = "" ];then loops=1; fi
  while [ "${loops}" -gt "0" ];do
   process "${arg1}" "${arg2}" "${arg3}" "${delay}" "${loops}"
   loops=$((${loops}-1))
   if [ "$(cat ${time_start_file})" != "${time_start}" ];then
    broke="true";
    break;
   fi
  done
  while [ "${delay}" -gt "0" ];do
   if [ "$(cat ${time_start_file})" != "${time_start}" ];then
    broke="true";
    break;
   fi
   delay=$((${delay}-1))
   sleep 0.001
  done
  if [ "${arg1}" = "list" ] && [ "${arg2}" = "" ] && [ "${arg3}" = "" ];then
 #  echo "remotes"
   remotes=$(echo -e "${stdout}"|grep -v "^$")
   while read remote;do
#    echo "remote:${remote}"
    process "list" "${remote}" ""
    remotes_json+=("$(jq -c -n --argjson ${remote} $(lines "$(echo -e "${stdout}" |awk '{print $2}')") '$ARGS.named')")
   done <<< "$(echo -e "${remotes}")"
  fi
 else
  ran+=("$(jq -n \
    --arg stderr \
    "only ${count} of 5 args irsend expects list|send_once|send_start|send_stop remote|BLANK ircode_name|BLANK then I need the delay and how many loops." \
    '$ARGS.named')")
  errors="true bad count"
 fi
done
else
 ran+=("$(jq -n --arg stderr "Not given a proper json" '$ARGS.named')")
 errors="true bad json"
fi

if [ "${remotes}" != "" ] && [ "${broke}" = "false" ];then
 jq -n \
 --argjson remotes "$(echo -e  "$(for item in "${remotes_json[@]}"; do echo "$item";done)" | jq -s add)" \
 --argjson ran "$(echo -e "$(for item in "${ran[@]}"; do echo "$item";done)" | jq -s .)" \
 --arg broke "${broke}" \
 --arg errors "${errors}" \
 '$ARGS.named'
else
 jq -n \
 --argjson ran "$(echo -e "$(for item in "${ran[@]}"; do echo "$item";done)" | jq -s .)" \
 --arg broke "${broke}" \
 --arg errors "${errors}" \
 '$ARGS.named'
fi
