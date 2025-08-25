#!/bin/bash

printf "HTTP/1.1 200 OK\nContent-Type: application/json\n\n"
pidfile="/tmp/${USER}_irsend_POST"
echo "$$" > "$pidfile"
result=''
tmp="$EPOCHREALTIME"
sleep .1
if [ "$tmp" != "$EPOCHREALTIME" ];then
        function realtime(){ result="$EPOCHREALTIME"; }
else
        echo "using date"
        function realtime(){ result=$(date +%s.%6N); }
fi

microseconds() {
        #remove zero padding
        rzp() {
                local number="${1#${1%%[!0]*}}";
                [ -z $number ]&&number=0
                result=$number
        }
        rzp "${1##*.}"
        ms1="$result"
        rzp "${2##*.}"
        ms2="$result"
        result=$(( (${2%%.*} - ${1%%.*})*1000000 + ($ms2 - $ms1) ));
}

function urlencode()
{
 # urlencode <string>
 local length="${#1}"
 local add
 result=''
 for (( i = 0; i < length; i++ )); do
  local c="${1:i:1}"
   case $c in
    [a-zA-Z0-9.~_-]) printf -v add "$c" ;;
    *) printf -v add '%%%02X' "'$c" ;;
   esac
   result+="$add"
 done
}

function urldecode()
{
 # urldecode <string>
 local url_encoded="${1//+/ }"
 printf -v result '%b' "${url_encoded//%/\\x}"
}

ran=''
errors="false"
function add2ran() {
 urlencode "$5"
 ran+=',["'"$1"'","'"$2"'","'"$3"'","'"$4"'","'"$result"'"]'
 errors="true"
}

interupted="false"
function interuptchk() {
 read pid < "$pidfile"
 [ "$pid" != "$$" ] && interupted="true" && print_ran && exit
}

function print_ran() {
 printf '{"ran":%s,"errors":"%s","interupted":"%s"}\n' "${ran:1}" "$errors" "$interupted"
}

function process()
{
 urldecode $1
 remote=$result
 urldecode $2
 local out=$(irsend "send_once" "$remote" "$result" 2>&1&&echo ".true-"||echo ".false")
 urlencode "${out%%.}"
 [ "${out##*.}" = 'false' ] && add2ran "$1" "$2" "$3" "$4" "$result"
}

function replace()
{
 result=$1
 shift
 while [ -n "$1" ];do
  result=${result//$1/$2}
  shift 2
 done
}

bad()
{
 echo "error:$1"
 exit
}

line=''
accum=''
while true;do
read -t .001 line
[ -z "${line}" ] && break;
accum+="$line"
done
r=$'\r'
data="${accum//*$r$r/}"
#sed 's/[^A-Za-z0-9\_\.\-\+\=\&\{\}\%\[\] ]//g'
replace "$data" '[^A-Za-z0-9_.\-+=&\{\}%\[\] :,\"]' '' %5B \[ %5D \] %22 \"
steralized=$result
#echo -e "$accum"
#echo -e "$result"
[ "${steralized:0:1}" != '{' ] && bad "missing { at beginning"
[ "${steralized:0-1}" != '}' ] && bad "missing } at end"
unwrapped="${steralized:1:0-1}"
#echo -e "$unwrapped"
[ "${unwrapped:0:5}" != '"id":' ] && bad "missing id"
unwrapped="${unwrapped:5}"
#echo -e "$unwrapped"
id="${unwrapped%%,*}"
unwrapped="${unwrapped#*,}"
#echo -e "$unwrapped"
[ "${unwrapped:0:10}" != '"ircodes":' ] && bad "missing ircodes"
ircodes=${unwrapped:10}
#echo -e "${ircodes}"
[ "${ircodes:0:1}" != '[' ] && bad "malformed ircodes outer [ missing"
[ "${ircodes:0-1}" != ']' ] && bad "malformed ircodes outer ] missing"
unwrapped="${ircodes:1:0-1}"
x=0
y=0
quotelocation[$((x++))]='remote'
quotelocation[$((x++))]='signal'
quotelocation[$((x++))]='pause'
quotelocation[$((x++))]='loops'
ircode_array=''
x=0
while [ -n "${unwrapped}" ];do
 [ "${unwrapped:0:1}" != '[' ] && bad "malformed ircodes inner [ missing"
 [ "${unwrapped:0-1}" != ']' ] && bad "malformed ircodes inner ] missing"
 ircode_wrapped=${unwrapped%%\]*}
 ircode="${ircode_wrapped:1}"
 IFS=, read ircode_array[$((x++))] ircode_array[$((x++))] \
  ircode_array[$((x++))] ircode_array[$((x++))] <<< $ircode
#  echo "$ircode"
# echo -e "test:$x:$y:${ircode_array[$((0+y*4))]}:${ircode_array[$((1+y*4))]}:${ircode_array[$((2+y*4))]}:${ircode_array[$((3+y*4))]}"
 ((y++))||true
# echo -e "$unwrapped"
# echo -e "ircode:$ircode"
 unwrapped=${unwrapped:$((${#ircode_wrapped}+2))}
done
z=0


##recall
while [ "$z" -lt "$y" ];do
 interuptchk
 remote="${ircode_array[$((0+z*4))]}"
 code="${ircode_array[$((1+z*4))]}"
 re='^[0-9]+$'
 delay="${ircode_array[$((2+z*4))]}"
 [[ "$delay" =~ $re ]] || delay=0
 loops="${ircode_array[$((3+z*4))]}"
 [[ "$loops" =~ $re ]] || loops=1
 realtime
 start="$result"
 realtime
 microseconds "$start" "$result"
 cdelay="$result"
 echo "$cdelay < $delay"
 while [ "$cdelay" -lt "$delay" ]; do
  interuptchk
  sleep .1
  realtime
  echo "start=$start"
  echo "ctime=$result"
  microseconds "$start" "$result"
  cdelay="$result"
  echo "$cdelay < $delay"
 done
 interuptchk
 loop=0
# while [ "$loop" -lt "$loops" ]; do
#  process "${remote:1:0-1}" "${code:1:0-1}" "$delay" "$loops"
#  interuptchk
# done
 echo -e "test:$z:${remote:1:0-1}:${code:1:0-1}:$delay:$loops"
 ((z++))||true
done
