// Load plugins
var gulp = require('gulp'),
	download = require('gulp-download'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	compass = require('gulp-compass'),
	path = require('path'),
	minifyCSS = require('gulp-minify-css'),
	watch = require('gulp-watch'),
	livereload = require('gulp-livereload'),
	lr = require('tiny-lr'),
	server = lr();

// Path configs
var	sass_path = 'src/stylesheets/**/*.scss', // .sass files
	js_path   = 'src/scripts/**/*.js', // .js files
	img_path  = 'src/images/**/*.{png,jpg,gif}'; // image files


//**********************************Tasks**********************************//

// Optimize Images
gulp.task('images', function() {
	gulp.src([img_path, '!src/images/icons/*' ])
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, cache: true }))
		.pipe(gulp.dest('project/img'))
		.pipe(livereload(server));
});

// Concat and Minify Scripts
gulp.task('scripts', function() {
	gulp.src(['src/scripts/libs/**', 'src/scripts/plugins/**', js_path])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('project/js'))
		.pipe(rename('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('project/js'))
		.pipe(livereload(server));
});

// Compile Compass
gulp.task('compass', function() {
	gulp.src(sass_path)
		.pipe(compass({
			project: path.join(__dirname, '/'),
			css: 'project/css',
			sass: 'src/stylesheets/',
			image: 'src/images',

			style: 'expanded',
			//description:
			//The output style for the compiled css.
			//Nested, expanded, compact, or compressed.

			comments: false,
			relative: false,
		}))
		.pipe(livereload(server));
});

// Clean Directories
gulp.task('clean', function() {
	return gulp.src(['project/css', 'project/js', 'project/img'], {read: false})
		.pipe(clean());
});

// Reload Browser
gulp.task('reload-browser', function() {
	gulp.src('project/**/*.html')
		.pipe(livereload(server));
});

// Watch
gulp.task('watch', function() {
	//Listen on port 35729
	server.listen(35729, function (err) {
		if (err) return console.log(err);

		// Watch .js files
		gulp.watch(js_path, function(event) {
			gulp.run('scripts');
		});

		// Watch .scss files
		gulp.watch(sass_path, function(event) {
			gulp.run('compass');
		});

		// Watch .jpg .png .gif files
		gulp.watch(img_path, function(event) {
		  gulp.run('images');
		});

		//Watch .html .php Files
		gulp.watch('project/**/*.{html,php}', function(){
			gulp.run('reload-browser');
		});

	});
});

// Download the latest version of jQuery
gulp.task('jquery', function() {
	download('http://code.jquery.com/jquery.js')
    	.pipe(gulp.dest("src/scripts/libs"));
});

// Download the latest version of jQuery UI
gulp.task('jqueryui', function() {
	download('http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.js')
    	.pipe(gulp.dest("src/scripts/libs"));
});

//Make task for jquery UI styles

//Make task for jquery mobile

//Make task for angular

// Default task
gulp.task('default', ['clean', 'compass', 'scripts', 'images'], function() {
	gulp.run('watch');
});