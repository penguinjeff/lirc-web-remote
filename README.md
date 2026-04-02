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


# move this directory to /var/www/html/lirc-web-remote/
sudo cp -r . /var/www/html/lirc-web-remote
sudo chmod a+x /var/www/html/lirc-web-remote/irsend_mult.sh
sudo chmod a+x /var/www/html/lirc-web-remote/macro.sh
sudo chmod a+x /var/www/html/lirc-web-remote/refresh_remotes.sh
# To install irsend service
adduser irsend
add irsend to lirc group
sudo cp irsend_mult.service /etc/systemd/system/irsend_mult.service
sudo systemctl daemon-reload
sudo systemctl start irsend_mult
sudo systemctl enable irsend_mult
sudo chown -R irsend: /var/www/html/lirc-web-remote/data/
/var/www/html/lirc-web-remote/refresh_remotes.sh


#
# my rewrite was better at the remote but still pretty crappy I am working on another rewite that will use some tricks I am working on
#

#making lots of changes
#
# I used irscrutinizer to help create my lirc files.
#

#
# Everything is a macro I want a better macro editor
#

#
# Next I will work on modules so that I can add macros to modules
#

#
# After that I can work on Activities so that I can add the modules to activites
#

#
# I was trying to think how to add more that one of a module with different remotes.
# I have some ideas I'll work on that when I implement editing and selecting displays
#
