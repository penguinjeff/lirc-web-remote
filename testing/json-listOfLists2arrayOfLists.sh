#!/bin/bash
#Filename: times_per_second.sh
#Author: Jeff Sadowski

location="${0%/*}/bash-libs"
. "${location}/json/listOfLists2arrayOfLists.sh"

json-listOfLists2arrayOfLists '[["item1","item2","item3"],["item4","item5","item6"]]' myarray 2

echo "${myarray[0]}"
echo ${myarray[1]}

