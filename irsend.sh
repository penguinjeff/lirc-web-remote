#!/bin/bash
# Written by: Jeff Sadowski
# this program simply runs irsend and outputs a JSON with any errors
# If you give it the list argument like the first example
# it will return a JSON with the remotes with thier understood irsignals
# defined in your lirc files

#example: echo GET "arg1=list&arg2=&arg3=" | ./irsend.sh
echo -e "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"

#get input from user and sanatize it.
while read -t .01 line;do sanatized=$(echo "${line}"| sed 's/[^A-Za-z0-9\_\.\-\+\=\& ]//g')
[ "$(echo $sanatized|awk '{print $1}')" = "GET" ] && break
[ "${line}" = "" ] && break
done

# extract function
# get a specified variable name from input
# example:
# if sanatize="arg1=test"
# "extract arg1" should return test
function extract() { echo -n "${sanatized}"|awk '{print $2 "&"}'|sed -n "s/.*$1=\([^&]*\).*/\1/p"; }

stdout="";stderr="";arg1="$(extract arg1)";arg2="$(extract arg2)";arg3="$(extract arg3)";

# keys function
# for the lirc remote specified print the key names that that lirc remote understand
function keys() {
 for key in $(irsend list $1 "" 2>>${stderrfile}|awk '{print $2}'); do echo -n '"'${key}'",';done;
}

# remotes function
# print all the lirc remotes and thier keys
function remotes() { for remote in $1; do echo -n '"'${remote}'":[';keys ${remote}|sed "s/,$//";echo ']';done; }

#json function
#wrap the input to make it fit a json
function json() { echo -n "{$2,\"remotes\":{";remotes "$1"|sed -z "s/\n/,/g" | sed "s/,$//"; echo '}}'; }

function text2list()
{
echo -e "$1" | sed "s/\"/\&quot;/g" | sed -z "s/\n/\",\"/g" | sed "s/^/\[\"/" | sed "s/$/\"\]/"
}

stderrfile="/tmp/stderr-$(date +%s)"
stdout=$(irsend "${arg1}" "${arg2}" "${arg3}" 2>>${stderrfile})
stderr=$(cat ${stderrfile})
rm -f ${stderrfile}
stdmsg="\"arg1\":\"${arg1}\",\"arg2\":\"${arg2}\",\"arg3\":\"$arg3\",\"stdout\":$(text2list "${stdout}"),\"stderr\":$(text2list "${stderr}")"
[ "$(echo $sanatized|awk '{print $1}')" = "GET" ] && \
[ "${arg1}" = "list" ] && [ "${arg2}" = "" ] && [ "${arg3}" = "" ] && \
json "$(echo ${stdout})" "${stdmsg}" | jq . ||
echo "{${stdmsg}}" | jq .
