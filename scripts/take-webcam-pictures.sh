cd /home/pi/garage-door-controller/www

fswebcam -r 640x480 --rotate=180 \
	--set "Brightness=100%" --set "Backlight Compensation=100%" --set "Gain=100%" --set "Contrast=100%" \
	--deinterlace \
	--timestamp="$(echo -n $(TZ=America/New_York date +"%b %d %r"))" \
	--subtitle="Garage Door (closed settings)" \
	--frames=10 \
	cam-dim.jpg

fswebcam -r 640x480 --rotate=180 \
	--set "Brightness=0%" --set "Backlight Compensation=0%" --set "Gain=0%"  --set "Contrast=50%" \
	--deinterlace \
	--timestamp="$(echo -n $(TZ=America/New_York date +"%b %d %r"))" \
	--subtitle="Garage Door (open settings)" \
	--frames=1 \
	cam-bright.jpg
