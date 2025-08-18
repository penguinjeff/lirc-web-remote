strace -f -o /tmp/script.trace -e trace=process bash -c 'echo -e "\r\n\r\n{%22ircodes%22:[[%22remote%22,%22ircode%22,%220%22,%221%22]]}" | ./irsend_post.sh'
