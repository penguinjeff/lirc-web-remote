
#!/bin/bash
timeout=$((20+($RANDOM%30)))
x=0;
PID=$$
function timeout_loop()
{
while [ "${x}" -lt "${timeout}" ];do
if [ "$(cat /tmp/myprogram-lastrun)" != "${started}" ];then
echo "Another started"
exit
fi
sleep 1;
x=$(($x+1))
done
echo "I finnised"
}
started=$(date +%s)
echo ${started} > /tmp/myprogram-lastrun
timeout_loop &
