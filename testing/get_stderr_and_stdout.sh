#!/bin/bash
#Filename: get_stderr_and_stdout.sh
#These will get replaced when something overwrites them.
both="both"
stdout="stdout"
stderr="stderr"

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

function get_stdout()
{
 #Because this function is 2 deep any variable in it goes away with the subshell anyways so make it local.
 # replace irsend with any command you wish to get stdout and stderr from.
 # irsend was the one I was working with but this should work with almost any command.
 local stdout=$(irsend list garbage "")
 #Make stdout easy to recognize so we can pull it out. Change % to %25 so we can use % to represent " as %22
 jq -n --arg stdout "$(urlencode "${stdout}")" '$ARGS.named'
}
function get_stderr()
{
 #If you fear the stdout message will be in stderr you could use some more sed's to work them out but I did not do this here.
 both=$(get_stdout 2>&1)
 #Pullout stdout from both so we have stderr on it's own.
 stderr=$(echo -e "${both}"|sed -z 's/{[^{]*$//')
 #Reform stdout back to it's original form
 stdout=$(urldecode "$(echo -e "${both}"|sed -z 's/.*\({[^{]*\)$/\1/'|jq -r .stdout)")
}
get_stderr
echo "both:${both}"
echo
#echo "stdoutjson:${stdoutjson}"
#echo "stdoutencoded:${stdoutencoded}"
echo "stdout:${stdout}"
echo "stderr:${stderr}"
