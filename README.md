HTML5 dice
==========

Build
-----

Assuming `npm` is installed, install the Grunt tool and bower globally:

	sudo npm install -g grunt-cli bower

Install dependencies:

	npm install
	bower install

Build:

	grunt

Watch stylus and coffeescript sources and rebuild when they change:

	grunt watch

The watch command does not roll the libraries together. To do just that:

	grunt uglify:libs

Todo
----

- Fix SVG dots which don't appear on old Android
- Make sound optional
- Option to shake device to roll
- Fix roll history dialog which is dodgy on some browsers

Licence
-------

MIT
