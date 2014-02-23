module.exports = function(grunt) {
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	fragments: './build/fragments/',
	build: {
	    debug: './build/output/mikan.debug.js'
	}
    });

    /** Makes separated source files in one. */
    function combineSources() {
	var fragments = grunt.config('fragments');
	sourceFilenames = JSON.parse(grunt.file.read(fragments + 'sources.json'));
	return sourceFilenames.map(function(fn) {
	    return grunt.file.read(fn);
	}).join('');
    };

    grunt.registerMultiTask('build', 'Build mikan.js', function() {
	var output = this.data;
	var source = combineSources();
	grunt.file.write(output, source.replace(/\r\n/g, '\n'));
    });

    grunt.registerTask('default', ['build']);
};
