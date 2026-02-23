#!/bin/bash
#Filename: times_per_second.sh
#Author: Jeff Sadowski

location="${0%/*}/lib"
. "${location}/url_functions.sh"

declare -A test_params
parse_get_post 'json={"test":"jsondata"}&id=1000' '' test test_params
echo "${test_params['json']}"
echo -en "$test"
