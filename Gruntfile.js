module.exports = function(grunt) {

 // Project configuration.
 grunt.initConfig({
   pkg: grunt.file.readJSON('package.json'),
   sass: {
   		dist: {
   			files: {
   				'css/style.css':'css/style.scss'
   			}
   		}
   },
   watch: {
   	css: {
   		 files: ['css/*.scss'],
   		 tasks: ['sass', 'autoprefixer']
   	},
   	options: {
   		liveReload: true
   	}
   },
   autoprefixer: {
   	options: {
   		browsers: ['last 5 version', 'ie 7', 'ie 8', 'ie 9']
   	},
   	no_dest: {
   		src: 'css/style.css'
   	}
   },
   connect: {
   	server: {
   		options: {
   			port: 9001,
   			base: ''
   		}
   	}
   },
   imagemin: {                          // Task
       dynamic: {                         // Another target
             files: [{
               expand: true,                  // Enable dynamic expansion
               cwd: 'images/',                   // Src matches are relative to this path
               src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
               dest: 'images/'                  // Destination path prefix
             }]
           }
     },

     cssmin: {
       minify: {
         expand: true,
         cwd: 'css/',
         src: ['*.css', '!*.min.css'],
         dest: 'css/',
         ext: '.min.css'
       }
     }
 });

 grunt.loadNpmTasks('grunt-contrib-sass');
 grunt.loadNpmTasks('grunt-contrib-watch');
 grunt.loadNpmTasks('grunt-autoprefixer');
 grunt.loadNpmTasks('grunt-contrib-connect');
 grunt.loadNpmTasks('grunt-contrib-imagemin');
 grunt.loadNpmTasks('grunt-contrib-cssmin');

 // Default task(s).
 grunt.registerTask('default', ['connect','watch', 'imagemin', 'cssmin']);
};