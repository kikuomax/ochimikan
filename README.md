**OchiMikan** is a JavaScript game which runs on a web-browser.

What is OchiMikan
-----------------

The name "OchiMikan" is a combination of Japanese words *落ちる(Ochiru)* and *蜜柑(Mikan)*.
*Ochiru* means to fall and *Mikan* is a kind of mandarin oranges.
*Mikan* is very popular in Japan especially during the winter.
Because Japanese people often buy a bunch of *Mikans* at once, some of them get moldy in a *Mikan* box before consumption.
Once a *Mikan* gets moldy, the mold quickly spreads in other *Mikans.*

OchiMikan is now hosted on http://ochimikan.herokuapp.com/.

Building OchiMikan
------------------

Before playing OchiMikan, you need to build it through the following steps.

 1. Clone the repository and make it the current directory.

		git clone https://github.com/kikuomax/ochimikan.git
		cd ochimikan

 2. Install [Node.js](http://nodejs.org) if you do not have it installed. OchiMikan itself does not depend on Node.js but it is still needed to organize source files.

 3. Install [Grunt](http://gruntjs.com) if you do not have it installed.

		npm install -g grunt-cli

 4. Resolve build dependencies.

		npm install

 5. Run `grunt`.

		grunt

	Then you will find `mikan.js` in `dist` directory.

Library Dependencies
--------------------

OchiMikan depends on the following libraries and they are bundled into `dist/libs` directory.

 - [jQuery 1.11.1](http://jquery.com)
 - [Knockout 3.2.0](http://knockoutjs.com)

Testing OchiMikan
-----------------

Tests of OchiMikan are powered by [Jasmine 2.0](http://jasmine.github.io/2.0/introduction.html). You can run them through the Grunt script.

	grunt test

Or you can run them on your browser by opening `spec/SpecRunner.html`.

How To Play
-----------

As you open `dist/index.html`, a pair of mikans will start falling on your browser.

You can control mikans by the keyboard on your PC, or touch motion if your device supports touch events.

**Keyboard**

	Left Arrow:   Move mikans left
	Right Arrow:  Move mikans right
	Down Arrow:   Rotate mikans clockwise
	Up Arrow:     Rotate mikans counterclockwise
	Spacebar:     Quickly drop mikans toward the ground

**Touch Motion**

	Left swipe:   Move mikans left
	Right swipe:  Move mikans right
	Down swipe:   Rotate mikans clockwise
	Up swipe:     Rotate mikans counterclockwise
	Tap:          Quickly drop mikans toward the ground

If the mikans reach the ground, they will stick there and a new pair of mikans will start falling. Mikans will stop falling when they reach the ground or fixed mikans.

Mikans are randomly damaged. If you chain more than 4 most damaged mikans, they will explode and you will earn score. By that explosion, mikans surrounding the chained mikans will be spoiled. Mikans that are no longer on the ground or fixed mikans will fall toward the ground. This may cause explosion combo. The longer combo, the higher score you earn.

Sometimes preservatives are dropped instead of mikans. A preservative can prevent surrounding mikans being spoiled 4 times. After 4 interceptions, it will disappear.

Hosting OchiMikan
-----------------

There is a simple script `service.js` which hosts the contents of `dist` directory. The following command will start a service on the port 8080 of your machine.

	node service.js

You can download OchiMikan into your mobile device.

*The above script is not intended to be used for production. It is just for a temporary use.*

Score Server
------------

An external score server [OchiMikan Records](https://github.com/kikuomax/ochimikan-records) is available.

If you run a score server on other than `localhost:9090`, please replace the URI of the following line in [index.html](dist/index.html) with the URI to your score server.

	var recordBase = new RecordBase('http://localhost:9090');

Generating Documentation
------------------------

Comments in the source code of OchiMikan are compatible with [YUIDoc](http://yui.github.io/yuidoc/). You can generate documentation for OchiMikan through the Grunt script.

	grunt doc

You will find documentation in `out/doc` directory.

Browser Compatibility
---------------------

OchiMikan is most tested on [Safari](https://www.apple.com/safari/) 7.0. It should work on the latest [Chrome](https://www.google.com/chrome/).

License
-------

[MIT License](http://opensource.org/licenses/MIT).
