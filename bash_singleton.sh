
#!/bin/bash

broke='false' 
#last time since we want to kill any existing ones when we end new ones.
time_start_file=/tmp/${USER}_singleton_started_time.txt
time_start=$(date +%s)-$RANDOM
echo ${time_start} > ${time_start_file}

function watch_startfile()
{
 echo "what is going on"
 local loops=0
 while true;do
  if [ "$(cat ${time_start_file})" != "${time_start}" ];then break; fi
  sleep 1
  echo test
  loops=$((${loops}+1))
  if [ "${loops}" -gt "100" ];then break;fi
 done
 echo "Should break here"
}
watch_startfile &  
pid=$!
echo ${pid}


timeout=$((20+($RANDOM%30)))
x=0;
PID=$$
function timeout_loop()
{
while [ "${x}" -lt "${timeout}" ];do
if [ "$(ps -hp ${pid} 2>/dev/null)" == "" ];then break;broke="true";fi
sleep 1;
x=$(($x+1))
done
if [ "${broke}" == "false" ];then
echo "I finnised"
else
echo "I got interupted"
fi
}
started=$(date +%s)
echo ${started} > /tmp/myprogram-lastrun
timeout_loop &
