# whatineed

Smart shopping list

## Installation

Clone this repo and cd into it

    git clone https://github.com/segdeha/whatineed.git

then

    cd whatineed

### Create a virtual env and activate it:

    virtualenv env

then

    source env/bin/activate

you should see (env) show up in front of your prompt (ex: `(env) Jasmine@Home $`)

### Make sure it's running python3

    virtualenv -p python3 env

### install django

    pip3 install django

### make sure you're in the same directory as manage.py and do

    python manage.py runserver

follow its instructions and make sure you see the right message in your browser.

## Requirements (for now)

    pip install numpy
    pip install pytz

## Installing Cordova

To get our app running on the iOS simulator, do the following:

1. `npm install -g cordova` (or, if that fails `sudo npm install -g cordova`)
1. `cordova platform add ios` (or `cordova platform add android`)
1. `cordova emulate ios`

To build a new Cordova app from scratch, follow [these instructions](https://github.com/segdeha/whatineed/blob/master/CORDOVA.md).

To get our app running on an iOS device (i.e. your phone), you will need to be registered as an [Apple Developer](https://developer.apple.com/), then obtain a [provisioning profile](http://stackoverflow.com/questions/3362652/what-is-a-provisioning-profile-used-for-when-developing-iphone-applications) for your device.

I haven’t been able to get the app running yet on Android. 😕
