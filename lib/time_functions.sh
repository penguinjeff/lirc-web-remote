#!/bin/bash

# realtime is just a function wrapper for $EPOCHREALTIME if you have a latter bash version
# otherwise it uses date unfortunately it forks for date

#this prevents mistakes for someone setting a varable EPOCHREALTIME
#a system that implements this should have a diffent time for both
#unless it is really really fast and in that case you are on your own
if [ "$EPOCHREALTIME" != "$EPOCHREALTIME" ];then
	function realtime(){
		# if we are not given a variable to send to write to local retval
		[ "$1" = "" ] && declare retval="" ||  declare -n retval="$1"
		retval=$EPOCHREALTIME;
		# if we are not given a variable to send to echo to screen
		[ "$1" = "" ] && echo "$retval"
	}
else
	# echo "falling back and using date"
	function realtime(){
		# if we are not given a variable to send to write to local retval
		[ "$1" = "" ] && declare retval="" || declare -n retval="$1"
		retval=$(date +%s.%6N);
		# if we are not given a variable to send to echo to screen
		[ "$1" = "" ] && echo "$retval"
	}
fi

# microseconds is a function that calculates the difference between 2 times
# given in $seconds.$nanosecond format to the nearest microsecond
#
# if the second option is a string it will treat the string as a variable passed by
# reference and will populate it with the current time
#
# if the second option is an empty string (IE:"") it gets the current time as the
# second time
#
# if you give a 3rd option of a variabe to put it in
# you can eliminate a fork and it does not print to screen
function microseconds() {
	[ "$1" = "" ] && echo "Must be given a start time in format \$seconds.\$nanosecond ." && return 1;
	# if given a variable to put current time in give it to it.
	!([[ "$2" =~ ^[0-9.] ]] || [ -z "$2" ]) && declare -n ms_current="$2" && ms_current="" || declare ms_current="$2"
	# if the second argument is blank get the current time to compare
	[ -z "${ms_current}" ] && realtime ms_current
	# if we are not given a variable write to local retval
	[ "$3" = "" ] && declare retval="" || declare -n retval="$3"
	# get the part after the decimal
	local dec1="${1##*.}"
	# get the part after the decimal
	local dec2="${ms_current##*.}"
	# multiply the difference in seconds times 1000000
	# add the difference in micro seconds
	retval=$(( (${ms_current%%.*} - ${1%%.*})*1000000+(10#${dec2:0:6} - 10#${dec1:0:6})));
	# if we are not given a variable echo to screen
	[ "$3" = "" ] && echo "$retval"
}
