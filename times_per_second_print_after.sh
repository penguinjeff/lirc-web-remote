#!/bin/bash
#Filename: times_per_second.sh
#Author: Jeff Sadowski

location="${0%/*}"
. "${location}/time_functions.sh"

_clump=""
function clump()
{
	printf -v tmp "$@"
	_clump+="$tmp";
}


realtime first
count=0
ms=0
clump 'Seconds_and_Milliseconds   ms_diff #ofTimes\n';
while [ "$ms" -lt "1000000" ]; do
	microseconds $first current ms
	clump 'interval:%s %6s %5s\n' $current $ms $((++count));
done
clump '   start:%s\n' $first
clump '%s\n' $count
printf "%s" "$_clump";
