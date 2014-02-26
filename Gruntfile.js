module.exports = function(grunt) {
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	fragments: './build/fragments/',
	build: {
	    debug: './dist/mikan.debug.js'
	},
	yuidoc: {
	    compile: {
		'name': '<%= pkg.name %>',
		'description': 'mikan developer documentation',
		'version': '<%= pkg.version %>',
		'url': '',
		options: {
		    paths: './src/',
		    outdir: './out/yuidoc/'
		}
	    }
	}
    });

    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    /** Returns an array of the source filenames. */
    function getSourceFilenames() {
	var sourceFilenames;
	function linkMikanSources(filenames) {
	    sourceFilenames = filenames;
	}
	var fragments = grunt.config('fragments');
	eval(grunt.file.read(fragments + 'sources.js'));
	return sourceFilenames;
    }

    /** Makes separated source files in one. */
    function combineSources() {
	var sourceFilenames = getSourceFilenames();
	return sourceFilenames.map(function(fn) {
	    return grunt.file.read(fn);
	}).join('');
    }

    grunt.registerMultiTask('build', 'Build mikan.js', function() {
	var output = this.data;
	var source = combineSources();
	grunt.file.write(output, source.replace(/\r\n/g, '\n'));
    });

    grunt.registerTask('default', ['build', 'yuidoc']);
};
