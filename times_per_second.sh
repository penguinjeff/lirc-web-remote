#!/bin/bash
#Filename: times_per_second.sh
#Author: Jeff Sadowski

location="${0%/*}"
. "${location}/time_functions.sh"

first=$(realtime)
count=0
ms=0
while [ "$ms" -lt "1000000" ]; do
        microseconds $first current ms
        printf 'interval:%s %6s %5s\n' $current $ms $((++count));
done
echo "   start:$first"
echo $count
