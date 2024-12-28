function test()
{
echo GET "json={%22ircodes%22:[[%22list%22,%22%22,%22%22,%2210000%22,%221%22]]}" | ./irsend_mult.sh > test1 &
sleep 1
echo GET "json={%22ircodes%22:[[%22list%22,%22%22,%22%22,%220%22,%221%22]]}" | ./irsend_mult.sh > test2 &
}

test &
