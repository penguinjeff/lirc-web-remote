#!/bin/bash
# Written by: Jeff Sadowski
# these are common tasks needed for irsend_mult.sh and macro_helper.sh

liblocation="${location}/bash-libs"
datalocation="${location}/data"

# for time-realtime and time-microseconds
. "${liblocation}/time/microseconds.sh"

#for json-list2array
. "${liblocation}/json/list2array.sh"

#create a directory if it doesn't exist to mount as tmpfs
#I'd recommed 1MB of space if a user is sending more than that many commands in a json
#for a macro there is something wrong. I could see it getting longer than the commandline
# but not more than a MB
mkdir -p /tmp/${USER}_irsend_tmpfs

idlocation="/tmp/${USER}_irsend_tmpfs/ids"

#last time since we want to kill any existing ones when we end new ones.
time_start_file=/tmp/${USER}_irsend_tmpfs/irsend_started_time.txt
json_pass=/tmp/${USER}_irsend_tmpfs/irsend_pass.json
time-realtime time_start

remove_newlines(){
  declare -n __string="$1"
  __string="${__string//$'\n'/\\\\n}"
}

command_exists(){
  # 'command -v' returns 0 if found, non-zero otherwise
  command -v "$1" >/dev/null 2>&1
}

msg(){
 local severity="info";
 local message=();
 local wrapped;
 local mask='"%s"';
 case "$1" in
 "e") severity="error"; shift;;
 "f") severity="finished";shift;;
 "i") severity="interrupted";shift;;
 "o") severity="info";shift;;
 "s") severity="success";shift;;
 "n") severity="$2";shift;shift;;
 esac
 while [ -n "$1" ];do message+=("$1");mask+=',"%s"';shift; done
 printf -v wrapped '[%s]\n' "${mask}"
 printf "${wrapped}" "${severity}" "${message[@]}"
 [ "$severity" = "interrupted" ] && msg f
 return 0;
}
