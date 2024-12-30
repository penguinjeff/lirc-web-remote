# lirc-web-remote
# Written by Jeff Sadowski
# I give no warrenty of any kind.
# This is a Free and open source project and it under the Apache 2 license feel free to use the code in any way useful to you.
# I am developing this to use as a remote to my devices at home.
# I have a fairly good start better than anything I have seen as a lirc interface.

# This project requires lircd to be setup correctly.
# This project requires netcat (nc) to be installed for the irsend service I created.

# move this directory to /var/www/html/lirc-web-remote/
sudo cp -r . /var/www/html/lirc-web-remote
sudo chmod a+x /var/www/html/lirc-web-remote/irsend.sh
# To install irsend service
sudo cp irsend_mult.service /etc/systemd/system/irsend_mult.service
sudo systemctl daemon-reload
sudo systemctl start irsend_mult
sudo systemctl enable irsend_mult

##### Warning this part may be Dangerous ######
# I set this directory writable by all for the first save
sudo chmod a+w /var/www/html/lirc-web-remote/data/
# use the web page to save data in the Edit section
# Set the owner to the webserver user that should have written the file
sudo chown -R $(ls -l /var/www/html/lirc-web-remote/data/|grep "saved-data-"|awk '{print $3}') /var/www/html/lirc-web-remote/data/
# remove write flag for all other users
sudo chmod go-w /var/www/html/lirc-web-remote/data/

#
# I used irscrutinizer to help create my lirc files.
#

#
# I will soon implement an indicator to let you know it sent a command
#

#
# Finnished moving from running a single command to multiple
#

#
# Finnished macros 
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
