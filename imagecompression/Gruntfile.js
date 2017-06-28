module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			files:['src/*.{png,jpg,gif}'],
			tasks:['shrinkImages']
		},
		image_resize: {
			resize: {
				options: {
					width:650,
					height:650,
					overwrite:true,
					upscale:true
				},
				src:'src/*.{png,jpg,gif}',
				dest:'dest/'

			}
		},
		image:{
			dynamic:{
				files:[{
					expand:true,
					cwd:'dest/',
					src:['**/*.{png,jpg,gif}'],
					dest:'dest/'
				}]
			}
		},
		clean:{
			images:['src/*.{png,jpg,gif}']
		}
	});

	grunt.loadNpmTasks('grunt-image-resize');
	grunt.loadNpmTasks('grunt-image');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('shrinkImages', ['image_resize','image', 'clean']);
	grunt.registerTask('default', ['watch']);

};