var gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
reload = browserSync.reload,
autoprefixer = require('gulp-autoprefixer'),
browserify = require('gulp-browserify'),
clean  = require('gulp-clean'),
concat = require('gulp-concat'),
merge = require('merge-stream');




var SOURCEPATHS = {
    sassSource : 'src/scss/*.scss',
    htmlSource : 'src/*.html',
    jsSource : 'src/js/**'
}

var APPPATH = {
    root :'app/',
    css : 'app/css',
    js : 'app/js',
    fonts: 'app/fonts'
}

gulp.task('clean-html', function() {
    return gulp.src(APPPATH.root + '/*.html', {read: false, force: true })
        .pipe(clean());
});

gulp.task('clean-scripts', function() {
    return gulp.src(APPPATH.js + '/*.js', {read: false, force: true })
        .pipe(clean());
});


gulp.task('sass', function() {
    var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;
    
   sassFiles = gulp.src(SOURCEPATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(APPPATH.css));
});

gulp.task('moveFonts', function() {
    gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest(APPPATH.fonts));
});

gulp.task('scripts', ['clean-scripts'], function() {
    gulp.src(SOURCEPATHS.jsSource)
        .pipe(concat('main.js'))
        .pipe(browserify())
        .pipe(gulp.dest(APPPATH.js))
});

gulp.task('copy', ['clean-html'], function() {
    gulp.src(SOURCEPATHS.htmlSource)
        .pipe(gulp.dest(APPPATH.root))
});

gulp.task('serve', ['sass'], function() {
    browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
        server: {
            baseDir : APPPATH.root
        }
    })
});

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts'], function() {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
    gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
    gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});


gulp.task('default', ['watch']);