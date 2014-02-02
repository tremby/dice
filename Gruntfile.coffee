module.exports = (grunt) ->
	grunt.initConfig
		stylus:
			options:
				import: [
					'nib'
				]
			app:
				files:
					'build/style.css': 'style.styl'
		coffee:
			options:
				sourceMap: true
			app:
				files:
					'build/dice.js': 'dice.coffee'
		uglify:
			options:
				mangle: true
				compress: true
			libs:
				files:
					'build/libs.js': [
						'bower_components/jquery/jquery.js'
						'bower_components/jquery.ui/ui/jquery.ui.core.js'
						'bower_components/jquery.ui/ui/jquery.ui.widget.js'
						'bower_components/jquery.ui/ui/jquery.ui.mouse.js'
						'bower_components/jquery.ui/ui/jquery.ui.sortable.js'
						'bower_components/modernizr/modernizr.js'
						'bower_components/spectrum/spectrum.js'
						'bower_components/colour.js/colour.js'
					]
		watch:
			stylus:
				files: ['style.styl']
				tasks: ['stylus']
			coffee:
				files: ['dice.coffee']
				tasks: ['coffee']

	grunt.loadNpmTasks 'grunt-contrib-stylus'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'

	grunt.registerTask 'default', [
		'uglify'
		'stylus'
		'coffee'
	]
