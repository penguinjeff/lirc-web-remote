
declare -F time-microseconds > /dev/null && return

liblocation="${0%/*}/bash-libs"
. "${liblocation}/time/realtime.sh"


# microseconds is a function that calculates the difference between 2 times
# given in $seconds.$nanosecond format to the nearest microsecond
#
# if the second option is a string it will treat the string as a variable passed by
# reference and will populate it with the current time
#
# if the second option is an empty string (IE:"") it gets the current time as the
# second time
#
# you must give a 3rd option of a variabe to put microseconds difference in
# you can eliminate a fork and it does not print to screen
# if te second argument's name is "now" it is populated with the current time
function microseconds() {
#	[ "$1" = "" ] && echo "Must be given a start time in format \$seconds.\$nanosecond ." && return 1;
	# if given a variable to put current time in give it to it.
	!([[ "$2" =~ ^[0-9.] ]] || [ -z "$2" ]) && declare -n __now="$2" && __now="" || declare __now="$2"
	# if the second argument is blank get the current time to compare
	([ -z "${__now}" ] || [ "$2" = "now" ]) && time-realtime __now
	# if we are not given a variable write to local retval
	declare -n __diff="$3"
	# get the part after the decimal
	local dec_start="${1##*.}"
	# get the part after the decimal
	local dec_now="${__now##*.}"
	# multiply the difference in seconds times 1000000
	# add the difference in micro seconds
	__diff=$(( (${__now%%.*} - ${1%%.*})*1000000+(10#${dec_now:0:6} - 10#${dec_start:0:6})));
}
