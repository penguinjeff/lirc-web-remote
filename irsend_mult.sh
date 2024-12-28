#!/bin/bash
# Written by: Jeff Sadowski
# this program simply runs irsend and outputs a JSON with any errors
# If you give it the list argument like the first example
# it will return a JSON with the remotes with thier understood irsignals
# defined in your lirc files

#example: echo GET "arg1=list&arg2=&arg3=" | ./irsend.sh
echo -e "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"


#last time since we want to kill any existing ones when we end new ones.
time_start_file=/tmp/${USER}_irsent_started_time.txt
time_start=$(date +%s)-$RANDOM
echo ${time_start} > ${time_start_file}

#get input from user and sanatize it.
while read -t .01 line;do sanatized=$(echo "${line}" | sed 's/[^A-Za-z0-9\_\.\-\+\=\&\{\}\%\[\] ]//g' | sed 's/%22/\"/g' )
[ "$(echo $sanatized|awk '{print $1}')" = "GET" ] && break
[ "${line}" = "" ] && break
done

# extract function
# get a specified variable name from input
# example:
# if sanatize="arg1=test"
# "extract arg1" should return test
function extract() { echo -n "${sanatized}"|awk '{print $2 "&"}'|sed -n "s/.*$1=\([^&]*\).*/\1/p"; }

stderr_file=/tmp/${USER}_irsend_mult.err
stdout_file=/tmp/${USER}_irsend_mult.out

function lines()
{
 local line="";
 local lines2strings="";
 while read line;do
  if [ "${lines2strings}" != "" ];then lines2strings=$(echo -e "${lines2strings}\n,");   fi;
  lines2strings="${lines2strings}\"${line}\"";
 done <<< "$(echo -e "$1")";  echo "[${lines2strings}]";
}


ran=""
function add2ran()
{
 if [ "${ran}" != "" ];then ran="${ran},"; fi
 ran="${ran}{\n"
 ran="${ran}\"args\":[\"$1\",\"$2\",\"$3\"],\n"
 ran="${ran}\"stdout\":$(lines "$(cat ${stdout_file} | grep -v "^$" | sed 's/\"/%22/g')"),\n"
 ran="${ran}\"stderr\":$(lines "$(cat ${stderr_file} | grep -v "^$" | sed 's/\"/%22/g')")\n"
 ran="${ran}}\n"
}

function process()
{
# echo "irsend \"$1\" \"$2\" \"$3\""
 irsend "$1" "$2" "$3" 2>${stderr_file} | grep -v "^$" > ${stdout_file}
 add2ran "$1" "$2" "$3"
}

json=$(extract json)

#echo ${json}
remotes_json=""
broke="false";

for row in $(echo "${json}" | jq -c '.ircodes[]'); do
 if [ "$(cat ${time_start_file})" != "${time_start}" ];then
  broke="true";
  break;
 fi
 if [ "$(echo "$row" | jq length)" -gt "4" ];then
  arg1=$(echo "$row" | jq -r '.[0]')
  arg2=$(echo "$row" | jq -r '.[1]')
  arg3=$(echo "$row" | jq -r '.[2]')
  delay=$(echo "$row" | jq -r '.[3]'|sed "s/[^0-9]*//g")
  loops=$(echo "$row" | jq -r '.[4]'|sed "s/[^0-9]*//g")
  if [ "${delay}" = "" ];then delay=0; fi
  if [ "${loops}" = "" ];then loops=1; fi
  while [ "${loops}" -gt "0" ];do
   process "${arg1}" "${arg2}" "${arg3}"
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
   remotes=$(echo -e "$(cat ${stdout_file}|grep -v "^$")")
   while read remote;do
 #   echo "remote:${remote}"
    process "list" "${remote}" ""
    if [ "${remotes_json}" != "" ];then remotes_json=$(echo -e "${remotes_json},\n"); fi
    remotes_json="${remotes_json}{\"${remote}\":$(lines "$(cat ${stdout_file}|awk '{print $2}')")}"
   done <<< "$(echo -e "${remotes}")"
  fi
 fi
done

if [ "${remotes}" != "" ] && [ "${broke}" = "false" ];then
 echo -e "{\"remotes\":[${remotes_json}]\n,\"ran\":[${ran}]\n,\"broke\":\"${broke}\"}"|jq . 2>&1
else
 echo -e "{\"ran\":[${ran}]\n,\"broke\":\"${broke}\"}"|jq . 2>&1
fi
