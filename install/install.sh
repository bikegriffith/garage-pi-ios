sudo apt-get update
sudo apt-get install -y avahi-daemon python-twisted nginx fswebcam libtiff5

sudo cp etc-rc.local /etc/rc.local
sudo cp etc-nginx-sites-available-garagepi /etc/nginx/sites-available/garagepi
sudo ln -s /etc/nginx/sites-available/garagepi /etc/nginx/sites-enabled/garagepi
sudo service nginx restart

