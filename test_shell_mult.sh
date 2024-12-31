function test()
{
echo GET "json={%22ircodes%22:[[%22list%22,%22%22,%22%22,%222000%22,%221%22]]}" | ./irsend_mult.sh > test1 &
sleep 1
time bash -c "echo GET "json={%22ircodes%22:[[%22list%22,%22%22,%22%22,%222000%22,%221%22]]}" | ./irsend_mult.sh > test2"
echo GET "json={%22ircodes%22:[[%22list%22,%22%22,%22%22,%220%22,%221%22]]}" | ./irsend_mult.sh > test3
echo GET "json={%22ircodes%22:[[%22list%22,%22badremote%22,%22%22,%220%22,%221%22]]}" | ./irsend_mult.sh > test4 
echo GET "json={%22ircodes%22:[[%22list%22,%22%22,%22%22,%220%22,%221%22]]" | ./irsend_mult.sh > test5 &
echo GET "json={%22ircodes%22:[[%22list%22,%22%22,%22%22,%220%22]]}" | ./irsend_mult.sh > test6 &
}

test &
