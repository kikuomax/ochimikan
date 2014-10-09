module.exports = function (grunt) {
    grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		build: {
			debug: './dist/mikan.js'
		},
		jasmine: {
			mikan: {
				src: './dist/mikan.js',
				options: {
					specs: './spec/**/*Spec.js',
					helpers: './spec/**/*Helper.js'
				}
			}
		},
		yuidoc: {
			compile: {
				'name': '<%= pkg.name %>',
				'description': 'mikan developer documentation',
				'version': '<%= pkg.version %>',
				'url': '',
				options: {
					paths: './src/',
					outdir: './out/doc/'
				}
			}
		}
    });

	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	/** Returns an array of the source filenames. */
	function getSourceFilenames() {
		var sourceFilenames;
		function linkMikanSources(filenames) {
			sourceFilenames = filenames;
		}
		eval(grunt.file.read('./build/sources.js'));
		return sourceFilenames;
	}

	/** Makes separated source files one. */
	function combineSources() {
		var sourceFilenames = getSourceFilenames();
		return sourceFilenames.map(function (fn) {
			return grunt.file.read(fn);
		}).join('');
	}

	grunt.registerMultiTask('build', 'Build mikan.js', function () {
		var output = this.data;
		var source = combineSources();
		grunt.file.write(output, source.replace(/\r\n/g, '\n'));
	});

	grunt.registerTask('test',    ['jasmine']);
	grunt.registerTask('doc',     ['yuidoc']);
	grunt.registerTask('default', ['build', 'test', 'doc']);
};
