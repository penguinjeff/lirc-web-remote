#!/bin/bash
function replace()
{
 local out=$1
 shift
 while [ -n "$1" ];do
  out=${out//$1/$2}
  shift 2
 done
 printf '%s\n' "$out"
}

bad()
{
 echo "error:$1"
 exit
}

x=0
line='something'
prev='something'
start='false'
accum=''
while [ -n "$prev" ] || [ -n "$line" ];do
prev=$line
read -t .01 line
[ "$prev" = "$(echo -e "\r")" ] && start=""
[ -z "$start" ] && [ -n "$line" ] && accum+="$line"
done
#sed 's/[^A-Za-z0-9\_\.\-\+\=\&\{\}\%\[\] ]//g'
steralized=$(replace "$accum" '[^A-Za-z0-9_.\-+=&\{\}%\[\] :,\"]' '' %5B \[ %5D \] %22 \")
printf "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"
#echo -e "$accum"
[ "${steralized:0:1}" != '{' ] && bad "missing { at beginning"
[ "${steralized:0-1}" != '}' ] && bad "missing } at end"
unwrapped="${steralized:1:$((${#steralized}-2))}"
#echo -e "$unwrapped"
[ "${unwrapped:0:11}" != "\"ircodes\":[" ] && bad "missing ircodes"
ircodes=${unwrapped:10}
#echo -e "${ircodes}"
[ "${ircodes:0:1}" != '[' ] && bad "malformed ircodes outer [ missing"
[ "${ircodes:0-1}" != ']' ] && bad "malformed ircodes outer ] missing"
unwrapped="${ircodes:1:$((${#ircodes}-2))}"
while [ -n "${unwrapped}" ];do
 [ "${unwrapped:0:1}" != '[' ] && bad "malformed ircodes inner [ missing"
 [ "${unwrapped:0-1}" != ']' ] && bad "malformed ircodes inner ] missing"
 ircode_wrapped=${unwrapped%%\]*}
 ircode="${ircode_wrapped:1:$((${#ircode_wrapped}-2))}"
 echo -e "$unwrapped"
 echo -e "ircode:$ircode"
 unwrapped=${unwrapped:$((${#ircode_wrapped}+2))}
done
