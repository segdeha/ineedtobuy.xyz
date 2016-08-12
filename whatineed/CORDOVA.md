# Cordova Notes

Documenting how to create the [Cordova](https://cordova.apache.org) app from scratch ’cuz I did that thing where you build the thing but forgot how I built it. You know, that thing.

_Note: Most of the following came from the [Create your first Cordova app](https://cordova.apache.org/docs/en/latest/guide/cli/index.html) page._

------

## Step 0: Install Node.js & NPM

You probably already have these installed. If not, see [the lesson on Node.js & NPM](https://github.com/segdeha/pdxcodeguild/blob/master/2.%20HTML%20%26%20CSS/2/nodejs-and-npm.md).

------

## Step 1: Install Cordova

    npm install -g cordova

Or, if that fails:

    sudo npm install -g cordova

------

## Step 2: Create the app

`cd` into the directory where you want to create the app, then run the following:

    cordova create WhatINeed com.pdxcodeguild.whatineed WhatINeed

------

## Step 3: Edit `config.xml`

Open `WhatINeed/config.xml` in Atom and change the following:

- description
- author

------

## Step 4: Add platforms

At a minimum, add iOS and Android as platforms (Cordova can also build to OS X, Blackberry, webOS, etc.).

    cordova platform add browser --save
    cordova platform add ios --save
    cordova platform add android --save

_Note: The `browser` platform is just here to help with development in a web browser._

_Note: Also, you need to have [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) installed to build to iOS and the [Android SDK](https://developer.android.com/studio/) installed to build to Android._

------

## Step 5: Add an app icon

1. Create a new directory in the root of the app (sibling to `www`) called `res`
1. Add an app icon named `icon.png` to `res`
1. Add `<icon src="res/icon.png" />` to `config.xml`

_Note: The above will add a single, generic icon that will be used across platforms. You can also specify custom icons for each and every possible situation see [the documentation here](https://cordova.apache.org/docs/en/latest/config_ref/images.html) or below for a quick reference._

_Also: I learned that having `icon.png` at 120x120px will make it appear on an iPhone 6. Having it at 180x180px will make it appear on an iPhone 6s. YMMV._

### Platform Specific Sizes
It is a good idea to define a default icon as a fallover for any undefined icon sizes.

_Note: When specifying icons for specific platforms, be sure to include the proper path other wise any build attempts will throw errors and fail._

#### iOS Icons
iOS Icon assets should be stored in `/res/ios/`.

##### Image Sizes and Naming Conventions

| iOS Version | Platform | Naming Convention | Image Size (px) |
| -------- | ------- | ----------------- | ---------- |
| iOS 8.0+ |iPhone 6 Plus | icon-60@3x.png       | 180 x 180 |
| iOS 7.0+| iPhone/iPod Touch | icon-60.png | 60 x 60 |  
| iOS 7.0+| iPhone/iPod Touch | icon-60@2x.png | 120 x 120 | 
| iOS 7.0+| iPad | res/ios/icon-76.png | 76 x 76 | 
| iOS 7.0+| iPad | res/ios/icon-76@2x.png | 152 x 152 |
| iOS 6.1 | Spotlight Icon | icon-40.png | 40 x 40|
| iOS 6.1 | Spotlight Icon | icon-40@2x.png | 80 x 80|
| iOS 6.1 | iPhone/iPod Touch | icon@.png | 57 x 57|
| iOS 6.1 | iPhone/iPod Touch | icon@2x.png | 114 x 114|
| iOS 6.1 | iPad | icon-72.png | 72 x 72|
| iOS 6.1 | iPad | icon-72@2x.png | 144 x 144|
| iOS 6.1 | iPhone Spotlight and Settings Icon | icon-small.png | 29 x 29 |
| iOS 6.1 | iPhone Spotlight and Settings Icon | icon-small@2x.png | 58 x 58|
| iOS 6.1 | iPad Spotlight and Settings Icon | icon-50.png | 50 x 50|
| iOS 6.1 | iPad Spotlight and Settings Icon | icon-50@2x.png | 100 x 100|
           

##### config.xml links

Once the icons are created you can add this code from the [Cordova documentation](https://cordova.apache.org/docs/en/latest/config_ref/images.html#ios) directly to your project's config.xml

    <platform name="ios">
        <!-- iOS 8.0+ -->
        <!-- iPhone 6 Plus  -->
        <icon src="res/ios/icon-60@3x.png" width="180" height="180" />
        <!-- iOS 7.0+ -->
        <!-- iPhone / iPod Touch  -->
        <icon src="res/ios/icon-60.png" width="60" height="60" />
        <icon src="res/ios/icon-60@2x.png" width="120" height="120" />
        <!-- iPad -->
        <icon src="res/ios/icon-76.png" width="76" height="76" />
        <icon src="res/ios/icon-76@2x.png" width="152" height="152" />
        <!-- iOS 6.1 -->
        <!-- Spotlight Icon -->
        <icon src="res/ios/icon-40.png" width="40" height="40" />
        <icon src="res/ios/icon-40@2x.png" width="80" height="80" />
        <!-- iPhone / iPod Touch -->
        <icon src="res/ios/icon.png" width="57" height="57" />
        <icon src="res/ios/icon@2x.png" width="114" height="114" />
        <!-- iPad -->
        <icon src="res/ios/icon-72.png" width="72" height="72" />
        <icon src="res/ios/icon-72@2x.png" width="144" height="144" />
        <!-- iPhone Spotlight and Settings Icon -->
        <icon src="res/ios/icon-small.png" width="29" height="29" />
        <icon src="res/ios/icon-small@2x.png" width="58" height="58" />
        <!-- iPad Spotlight and Settings Icon -->
        <icon src="res/ios/icon-50.png" width="50" height="50" />
        <icon src="res/ios/icon-50@2x.png" width="100" height="100" />
    </platform>

_For more information refer to the [iOS Documentation](https://developer.apple.com/ios/human-interface-guidelines/graphics/app-icon/) for sizes and the [Cordova Documentation](https://cordova.apache.org/docs/en/latest/config_ref/images.html#ios) config.xml references_

------

## Step 6: Add a splash screen

1. Install the splash screen plugin by running the following command: `cordova plugin add cordova-plugin-splashscreen`
1. If you didn’t already in Step 5, create a `res` directory at the same level as the `www` directory; inside it, create a `screen` directory and inside that create a directory for the two device platforms (`ios` & `android`); so, you should have the following two directory structures in place:
    - `res/screen/ios`
    - `res/screen/android`
1. Add the forllowing PNGs to `res/screen/ios` (Honestly, it’s a bit of a mystery to me which of the following images actually get used on which devices. If you figure it out, please update this doc!): 
	- `Default~iphone.png`
	- `Default@2x~iphone.png`
    - `Default-Portrait~ipad.png`
    - `Default-Portrait@2x~ipad.png`
    - `Default-Landscape~ipad.png`
    - `Default-Landscape@2x~ipad.png`
    - `Default-568h@2x~iphone.png`
    - `Default-667h.png`
    - `Default-736h.png`
    - `Default-Landscape-736h.png`
    
    _**edit**: I believe the funky sizes are to account for status bar sizes,  if you look at the screen sizes on the [iOS Splash Screen Documentation](https://developer.apple.com/ios/human-interface-guidelines/graphics/launch-screen/). additionally [this blogger](http://www.mobilemammoth.com/ios-app-icon-and-launch-image-sizes-for-iphone-6-and-6-plus/) mentions that suffixes are for serving different images to identical screen sizes.:_

1. Add the following directives to `<platform name="ios"></platform>`:


   - `<splash src="res/screen/ios/Default~iphone.png" width="320" height="480"/>`
    - `<splash src="res/screen/ios/Default@2x~iphone.png" width="640" height="960"/>`
    - `<splash src="res/screen/ios/Default-Portrait~ipad.png" width="768" height="1024"/>`
    - `<splash src="res/screen/ios/Default-Portrait@2x~ipad.png" width="1536" height="2048"/>`
    - `<splash src="res/screen/ios/Default-Landscape~ipad.png" width="1024" height="768"/>`
    - `<splash src="res/screen/ios/Default-Landscape@2x~ipad.png" width="2048" height="1536"/>`
    - `<splash src="res/screen/ios/Default-568h@2x~iphone.png" width="640" height="1136"/>`
    - `<splash src="res/screen/ios/Default-667h.png" width="750" height="1334"/>`
    - `<splash src="res/screen/ios/Default-736h.png" width="1242" height="2208"/>`
    - `<splash src="res/screen/ios/Default-Landscape-736h.png" width="2208" height="1242"/>`
    
1. Add the following PNGs to `res/screen/android`
    - `splash-port-mdpi.png.png`
    - `splash-port-hdpi.png.png`
    - `splash-port-xhdpi.png`
1. Add the following directives to `<platform name="android"></platform>`:
    - `<splash src="res/screen/android/splash-port-mdpi.png" density="port-mdpi" />`
    - `<splash src="res/screen/android/splash-port-hdpi.png" density="port-hdpi" />`
    - `<splash src="res/screen/android/splash-port-xhdpi.png" density="port-xhdpi" />`

_Note: The way of designating Android screen sizes used by the plugin is a little outdated. Look here for [documentation on what the different DPI types are](https://developer.android.com/guide/practices/screens_support.html)._

I also set the following preference directives, but you can play around with them. They’re outlined in the [plugin documentation](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/).

- `<preference name="FadeSplashScreenDuration" value="250" />`
- `<preference name="SplashScreenDelay" value="1000" />`
- `<preference name="ShowSplashScreenSpinner" value="false" />`


------

## Step 7: Add camera access

Run the following to add the ability to use the device’s camera:

    cordova plugin add cordova-plugin-camera

## Step 8: Add device info plugin (optional)

The following optional plugin will give you access to information about the environment in which your app is running ([more info here](https://github.com/apache/cordova-plugin-device)):

    cordova plugin add cordova-plugin-device

------

## Step 9: Add status bar control (optional)

The following optional plugin will give you control over the appearance of the status bar ([more info here](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-statusbar/)):

    cordova plugin add cordova-plugin-statusbar

------

## Step 10: Set up aliases (optional)

We’re ready to build the app, but I found it was easier to set up the following aliases in my `~/.aliases` file first:

- `alias cordsim='cordova emulate ios --target="iPhone-6, 9.3"'`
- `alias cordemu='cordova emulate android'`
- `alias cordios='cordova run ios'`
- `alias cordand='cordova run android'`

_Note: I have `cordsim` set up to target the emulator in a mode that matches my phone. You can launch it this way and change the device using the “Hardware > Device” menu in the simulator app._

------

## Step 11: Run it!

Try building the app! I recommend building it to the iOS simulator or Android emulator first.

    cordsim
    cordemu

_Note: I haven’t yet been able to get Cordova to build to the Android emulator. Probably a [PEBKAC](http://www.urbandictionary.com/define.php?term=pebkac)._

------

## Steps 12 thru ∞: Build your app

Now that the app builds and runs, you can start futzing (that’s a technical term) with the assets in the `www` folder to make it what you want.
