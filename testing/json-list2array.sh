#!/bin/bash
#Filename: times_per_second.sh
#Author: Jeff Sadowski

location="${0%/*}/bash-libs"
. "${location}/json/list2array.sh"

json-list2array '["item1","item2","item3"]' myarray 4

echo ${myarray[0]}
echo ${myarray[1]}
echo ${myarray[2]}
echo ${myarray[3]}

