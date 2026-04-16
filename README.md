# lirc-web-remote
# Written by Jeff Sadowski
# I give no warrenty of any kind.
# This is a Free and open source project and it under the Apache 2 license feel free to use the code in any way useful to you.
# I am developing this to use as a remote to my devices at home.
# I have a fairly good start better than anything I have seen as a lirc interface.

# This project requires lircd to be setup correctly.
# This project requires netcat (nc) to be installed for the irsend service I created.

Prereques
Install lirc add your lirc remotes
make sure your lirc remotes have proper button names my interface expects this
irrecord -l show most proper button names I know I saw a lot without proper name when I was downloading some

# To install irsend service
adduser irsend
add irsend to lirc group
sudo cp irsend_mult.service /etc/systemd/system/irsend_mult.service
sudo systemctl daemon-reload
sudo systemctl start irsend_mult
sudo systemctl enable irsend_mult
sudo chown -R irsend: /var/www/html/lirc-web-remote/data/
/var/www/html/lirc-web-remote/refresh_remotes.sh

# move this directory to /var/www/html/lirc-web-remote/
sudo mv lirc-web-remote /var/www/html/lirc-web-remote
sudo chmod a+x /var/www/html/lirc-web-remote/irsend_mult.sh
sudo chmod a+x /var/www/html/lirc-web-remote/macro.sh
chown -R irsend /var/www/html/lirc-web-remote/data


#
# I used irscrutinizer to help create my lirc files.
#

#
# Working on a better macro editor
# I am making lots of progress I have a slick idea on how to build many of the editors all at once.
# I have a build_selector that will help significatly you can check out the test_buildselector.html to see it's progress
# It will allow me to build the editors a lot faster


#
# I was trying to think how to add more that one of a module with different remotes.
# I have some ideas I'll work on that when I implement editing and selecting displays
#
