#!/bin/bash
# Written by: Jeff Sadowski
# this program simply runs irsend and outputs a JSON with any errors
# If you give it the list argument like the first example
# it will return a JSON with the remotes with thier understood irsignals
# defined in your lirc files

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

function lines() {  echo -ne "$1"|jq -M -R -s -c 'split("\n")'; }

ran=""
function add2ran()
{
 if [ "${ran}" != "" ];then ran="${ran},"; fi
 ran="${ran}{\n"
 ran="${ran}\"args\":[\"$1\",\"$2\",\"$3\"],\n"
 ran="${ran}\"delay\":\"$4\",\n"
 ran="${ran}\"loops\":\"$5\",\n"
 ran="${ran}\"stdout\":$(lines "$(echo -e "$6" | grep -v "^$" | sed 's/\"/%22/g')"),\n"
 ran="${ran}\"stderr\":$(lines "$(echo -e "$7" | grep -v "^$" | sed 's/\"/%22/g')")\n"
 ran="${ran}}\n"
 if [ "$(echo -e "$7" | grep -v "^$")" != "" ];then
  errors="true from ran"
 fi
}

function subprocess()
{
 local subvar=$(irsend "$1" "$2" "$3");
 echo "stdout:\"$(echo -e "${subvar}"| sed 's/%/%25/g' | sed 's/\"/%22/g')\""
}

function process()
{
# echo "irsend \"$1\" \"$2\" \"$3\""
 local both=$(subprocess $1 $2 $3 2>&1)
 stderr=$(echo -e "${both}"|sed -z 's/stdout:\".*\"//')
 stdout=$(echo -e "${both}"|sed -z 's/.*stdout:\"\(.*\)\"/\1/')
 add2ran "$1" "$2" "$3" "$4" "$5" "${stdout}" "${stderr}"
}

json=$(extract json)

#echo ${json}
remotes_json=""
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
 #   echo "remote:${remote}"
    process "list" "${remote}" ""
    if [ "${remotes_json}" != "" ];then remotes_json=$(echo -e "${remotes_json},\n"); fi
    remotes_json="${remotes_json}\"${remote}\":$(lines "$(echo -e "${stdout}" |awk '{print $2}')")"
   done <<< "$(echo -e "${remotes}")"
  fi
 else
 if [ "${ran}" != "" ];then ran="${ran},"; fi
  ran="${ran}{\"error\":\"only ${count} of 5 args irsend expects list|send_once|send_start|send_stop remote|BLANK ircode_name|BLANK then I need the delay and how many loops.\"}"
  errors="true bad count"
 fi
done
else
 if [ "${ran}" != "" ];then ran="${ran},"; fi
 ran="${ran}{\"error\":\"Not given a proper json\"}"
 errors="true bad json"
fi

if [ "${remotes}" != "" ] && [ "${broke}" = "false" ];then
 echo -e "{\"remotes\":{${remotes_json}}\n,\"ran\":[${ran}]\n,\"broke\":\"${broke}\",\"errors\":\"${errors}\"}"|jq . 2>&1 || \
 echo -e "{\"remotes\":{${remotes_json}}\n,\"ran\":[${ran}]\n,\"broke\":\"${broke}\",\"errors\":\"${errors}\"}"
else
 echo -e "{\"ran\":[${ran}]\n,\"broke\":\"${broke}\",\"errors\":\"${errors}\"}"|jq . 2>&1 || \
 echo -e "{\"ran\":[${ran}]\n,\"broke\":\"${broke}\",\"errors\":\"${errors}\"}"
fi

