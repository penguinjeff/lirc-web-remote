#!/bin/bash
location=$(dirname $0)
remote_buttons() {
while read remote; do
 buttons=$(irsend list "${remote}" ''|awk '{print $2}'|sed 's/^/"/' | sed 's/$/",/'|sed -z 's/\n//g')
 printf '"%s":[%s],' "${remote}" "${buttons::-4}" 
done <<< "$(irsend list '' ''||printf '';)"
}
all_buttons=$(remote_buttons)
printf '{"remotes":{%s}}' "${all_buttons::-1}" > ${location}/remotes/remotes.js
