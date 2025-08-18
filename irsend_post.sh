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

line='something'
prev='something'
start='false'
accum=''
while [ -n "$prev" ] || [ -n "$line" ];do
prev=$line
read -t .01 line
#echo "$line"
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
x=0
y=0
quotelocation[$((x++))]=remote
quotelocation[$((x++))]=signal
quotelocation[$((x++))]=pause
quotelocation[$((x++))]=loops
ircode_array=''
x=0
while [ -n "${unwrapped}" ];do
 [ "${unwrapped:0:1}" != '[' ] && bad "malformed ircodes inner [ missing"
 [ "${unwrapped:0-1}" != ']' ] && bad "malformed ircodes inner ] missing"
 ircode_wrapped=${unwrapped%%\]*}
 ircode="${ircode_wrapped:1:$((${#ircode_wrapped}-1))}"
#  echo "$ircode"
 while [ "${ircode:0-1}" = '"' ];do
  [ "${ircode:0:1}" != '"' ] && bad "missing open quote for ${quotelocation[$((x-y))]}"
  part=${ircode:1}
  part=${part%%\"*}
  #echo "${x}part:${part}"
  ircode=${ircode:$((${#part}+3))}
  ircode_array[$x]=$part
  ((x++))||true
  [ "${ircode:0-1}" != '"' ] && [ -n "${ircode:0-1}" ] && bad "missing closing quote"
 done
# echo -e "test:$x:$y:${ircode_array[$((0+y*4))]}:${ircode_array[$((1+y*4))]}:${ircode_array[$((2+y*4))]}:${ircode_array[$((3+y*4))]}"
 ((y++))||true
# echo -e "$unwrapped"
# echo -e "ircode:$ircode"
 unwrapped=${unwrapped:$((${#ircode_wrapped}+2))}
done
z=0

##recall
while [ "$z" -lt "$y" ];do
 echo -e "test:$z:${ircode_array[$((0+z*4))]}:${ircode_array[$((1+z*4))]}:${ircode_array[$((2+z*4))]}:${ircode_array[$((3+z*4))]}"
 ((z++))||true
done
