#!/bin/bash
#Filename: times_per_second.sh
#Author: Jeff Sadowski

if [ "$EPOCHREALTIME" != "$EPOCHREALTIME" ];then
        function realtime(){ echo $EPOCHREALTIME; }
else
        echo "using date"
        function realtime(){ date +%s.%6N; }
fi

microseconds() {
        #remove zero padding
        rzp() {
                local number="${1#${1%%[!0]*}}";
                [ -z $number ]&&number=0
                echo $number
        }
        echo $(( (${2%%.*} - ${1%%.*})*1000000 +\
                ($(rzp ${2##*.}) - $(rzp ${1##*.})) ));
}

first=$(realtime)
current=$(realtime)
ms=$(microseconds $first $current);
count=0
while [ "$ms" -lt "1000000" ]; do
        printf 'interval:%s %6s %5s\n' $current $ms $((++count));
        current=$(realtime);
        ms=$(microseconds $first $current);
done
echo "   start:$first"
echo $count
