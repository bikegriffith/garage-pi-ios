Garage Door Opener for Raspberry Pi with iOS Control App and Foscam IP Camera Integration
=========================================================================================

Inspired by [andrewshilliday/garage-door-controller](https://github.com/andrewshilliday/garage-door-controller)

Monitor and control your garage doors from the web via a Raspberry Pi.

Overview:
---------

This project provides software and hardware installation instructions for monitoring and controlling your garage doors remotely.

The software is designed to run on a [Raspberry Pi](www.raspberrypi.org) and supports:
* Monitoring of the state of the garage doors (indicating whether they are open, closed, opening, or closing)
* Remote control of the garage doors
* Logging of all garage door activity
* Live display from Foscam IP cameras

Requirements:
-------------

**Hardware**

* [Raspberry Pi](http://www.raspberrypi.org)
* Micro USB charger (1.5A preferable)
* 8 GB micro SD Card
* Relay Module, 1 channel per garage door (I used [SainSmart](http://amzn.com/B0057OC6D8 ), but there are [other options](http://amzn.com/B00DIMGFHY) as well)
* [Magnetic Contact Switch](http://amzn.com/B006VK6YLC) (one per garage door)
* [Female-to-Female jumper wires](http://amzn.com/B007XPSVMY) (you'll need around 10, or you can just solder)
* 2-conductor electrical wire

**Firmware**

* [Raspbian](http://www.raspbian.org/)
* Python >2.7 (installed with Raspbian)
* Raspberry Pi GPIO Python libs (installed with Raspbian)
* Python Twisted web module
* nginx (provies authentication layer and proxy to IP cameras)

**Mobile App**

* iOS device (iPhone or iPad)
* Developer certiticate for installing
* Built with [React Native](https://facebook.github.io/react-native/)

Hardware Setup:
------

*Step 1: Install the magnetic contact switches:*

The contact switches are the sensors that the raspberry pi will use to recognize whether the garage doors are open or shut.
You need to install one on each door so that the switch is *closed* when the garage doors are closed.
Attach the end without wire hookups to the door itself, and the other end (the one that wires get attached to) to the frame of the
door in such a way that they are next to each other when the garage door is shut.
There can be some space between them, but they should be close and aligned properly, like this:

![Sample closed contact switch][3]

*Step 2: Install the relays:*

The relays are used to mimic a push button being pressed which will in turn cause your garage doors to open and shut.
Each relay channel is wired to the garage door opener identically to and in parallel with the existing push button wiring.
You'll want to consult your model's manual, or experiment with paper clips, but it should be wired somewhere around here:

![!\[Wiring the garage door opener\]][4]
    
*Step 3: Wiring it all together*

The following diagram illustrates how to wire up a two-door controller.  The program can accommodate fewer or additional garage doors (available GPIO pins permitting).

![enter image description here][5]

Software Installation:
-----

1. **Install [Raspbian](http://www.raspbian.org/) onto your Raspberry Pi**

2. **Configure your WiFi adapter**

3. **Install the required dependencies**

    From the Raspberry Pi:
    `sudo apt-get update`
    `sudo apt-get install -y git avahi-daemon python-twisted nginx fswebcam libtiff5 apache2-utils`
    
4. **Install the server application**
        
    I just install it to ~/pi/garage-door-controller.  You can install it anywhere you want but make sure to adapt these instructions accordingly.
    
    From the Raspberry Pi:
    `git clone https://github.com/bikegriffith/garage-pi-ios ~pi/garage-pi-ios`
    
5.  **Edit `server/config.json`**
    
    You'll need one configuration entry for each garage door.  The settings are fairly obvious, but are defined as follows:
    - **name**: The name for the garage door as it will appear on the controller app.
    - **relay_pin**: The GPIO pin connecting the RPi to the relay for that door.
    - **state_pin**: The GPIO pin conneting to the contact switch.
    - **approx_time_to_close**: How long the garage door typically takes to close.
    - **approx_time_to_open**: How long the garage door typically takes to open.

    The **approx_time_to_XXX** options are not particularly crucial.  They tell the program when to shift from the opening or closing state to the "open" or "closed" state.  You don't need to be out there with a stopwatch and you wont break anything if they are off.  In the worst case, you may end up with a slightly odd behavior when closing the garage door whereby it goes from "closing" to "open" (briefly) and then to "closed" when the sensor detects that the door is actually closed.

        
6.  **Configure server to launch at startup**

    Add the following line to your /etc/rc.local file on your Raspberry Pi,
    just above the call to `exit 0`:

    `(cd ~pi/garage-pi-ios/server; python controller.py)&`

7.  **Configure nginx to provide auth layer if you plan to expose this externally through your router for remote access**

    See the sample nginx site configuration in server/install/etc-nginx-sites-available-garagepi.
    Modify the ports and credentials as necessary to point to your IP cameras and expose the
    authenticated port as necessary.

    Create a user/password for web access using:

    From the Raspberry Pi:
    `sudo htpasswd -c /etc/apache2/.htpasswd johndoe`

8. **Verify controller web service can be reached**

    The garage door controller application runs directly from the Raspberry Pi as a web service running on port 8080.
    It can be used by directing a web browser to http://[hostname-or-ip-of-pi]:8080/.
    Open a browser to that address and verify you get a response.

9. **Configure and run iOS app**

    From your Mac, open the GarageDoorOpenerReactNative folder.  Make sure to edit the config.js to
    meet your needs.

    From your Mac:
    `npm install -g react-native-cli`
    `cd GarageDoorOpenerReactNative`
    `cp config.js.example config.js`
    `npm start && npm run sim`
    

Image Links:
-----------

  [1]: http://i.imgur.com/rDx9YIt.png
  [2]: http://i.imgur.com/bfjx9oy.png
  [3]: http://i.imgur.com/vPHx7kF.png
  [4]: http://i.imgur.com/AkNl6FI.jpg
  [5]: http://i.imgur.com/48bpyG0.png
  
