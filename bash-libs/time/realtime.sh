declare -F time-realtime > /dev/null && return
# realtime is just a function wrapper for $EPOCHREALTIME if you have a latter bash version
# otherwise it uses date unfortunately it forks for date

#this prevents mistakes for someone setting a varable EPOCHREALTIME
#a system that implements this should have a diffent time for both
#unless it is really really fast and in that case you are on your own
if [ "$EPOCHREALTIME" != "$EPOCHREALTIME" ];then
	time-realtime(){
		declare -n __time="$1"
		__time=$EPOCHREALTIME;
	}
else
	# echo "falling back and using date"
	time-realtime(){
		declare -n __time="$1"
		__time=$(date +%s.%6N);
	}
fi
