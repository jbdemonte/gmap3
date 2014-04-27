[gmap3](http://gmap3.net/) - Google Maps and jQuery
===================================================

[Buy author a beer](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WCUX27CFV79S2)

Presentation
------------

gmap3 is a plugin for jQuery which allows you to use the Google maps API easily.
It provides some powerful functions (clustering...) and some simple which avoid you to write lot of repetitive code.
However, it allows to use all the Google Maps API.

Why using gmap3 ?
-----------------

### Full jQuery
 - The same map can be accessed by all css selectors
 - Chainable

### Full Google Maps API
 - Even if gmap3 provides simplified types, Google Maps types and objects are still usable

### Silent use of Google Maps services
 - Google Maps services are usable without any code (address resolution, elevation ...) ([example of silent address resolution](http://gmap3.net/en/catalog/10-overlays/marker-41))

### Unique Id, tags & custom data
 - All objects added (markers, overlays ...) can have a unique id and / or have tag(s) in order to access / remove it later ([example of id and tags](http://gmap3.net/en/catalog/16-misc/clear-59))
 - All objects can embed custom data which are sent on events ([example of custom data](http://gmap3.net/en/catalog/10-overlays/marker-41))

### A complete documentation
 [Read the documentation](http://gmap3.net/en/catalog/)

### Lot of examples 
 - All the features are visible in a single standalone file in the package


What you need to build your own Gmap3
--------------------------------------

In order to build Gmap3, you need to have Node.js/npm latest and git 1.7 or later.
(Earlier versions might work OK, but are not tested.)

For Windows you have to download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Mac OS users should install [Homebrew](http://mxcl.github.com/homebrew/). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install git and Node.js, or build from source
if you swing that way. Easy-peasy.

How to build your own Gmap3
----------------------------

Clone a copy of the main Gmap3 git repo by running:

```bash
git clone git@github.com:jbdemonte/gmap3.git
```

Enter the gmap3 directory and install its dependencies:
```bash
cd gmap3
npm install
```

Now, build it:
```bash
gulp
```

The built version of Gmap3 will be put in the `dist/` subdirectory, along with the minified copy.

The builder contains two main tasks named "default" and "package".
  - "default" build the gmap3.js and its minified version
  - "package" also include the demo and examples files

By default, all the features are included in the build, to create your own light version, you can either remove some features by using *--no-option_name* in the build command line or only include the ones you want by using the option *--only*.

e.g.,

only include "rectange" and "circle" features:
```bash
gulp --only --rectangle --circle
```
The code below is equivalent to:
```bash
gulp default --only --rectangle --circle
```
To also includes compatible demo and examples:
```bash
gulp package --only --rectangle --circle
```

to keep all features but the cluster support:
```bash
gulp --no-cluster
```

If a feature is removed while it is a dependency for another one, it will be nevertheless kept.

Available options:
 - autofit
 - bicyclinglayer
 - circle
 - clear
 - cluster (use marker)
 - defaults
 - destroy
 - directionsrenderer
 - exec
 - get
 - getaddress
 - getdistance
 - getelevation
 - getgeoloc
 - getlatlng
 - getmaxzoom
 - getroute
 - groundoverlay
 - imagemaptype
 - infowindow
 - kmllayer
 - marker
 - overlay
 - panel
 - polygon
 - polyline
 - rectangle
 - streetviewpanorama
 - styledmaptype
 - trafficlayer
 - trigger


Licence
-------
[GPL v3](http://www.gnu.org/licenses/gpl.html)