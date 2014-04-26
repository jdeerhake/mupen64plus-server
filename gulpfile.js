var gulp = require( 'gulp' ),
  plumber = require( 'gulp-plumber' ),
  browserify = require( 'gulp-browserify' ),
  sass = require('gulp-sass');

var bfyConf = {
  source : 'public/index.js'
};

var paths = {
    scripts : [ 'public/index.js' ],
    output : 'public/compiled'
};

gulp.task( 'scripts', function() {
    gulp.src( paths.scripts )
        .pipe( plumber() )
        .pipe( browserify( bfyConf ) )
        .pipe( gulp.dest( paths.output ) );
});

gulp.task( 'sass', function () {
  gulp.src( './public/*.scss' )
    .pipe( sass() )
    .pipe( gulp.dest( paths.output ) );
});

gulp.task( 'watch', function() {
    gulp.watch( [ 'public/index.js', 'lib/*.js', 'src/*.js' ], [ 'scripts' ]);
    gulp.watch( [ 'public/*.scss' ], [ 'sass' ]);
});

gulp.task( 'compile', [ 'scripts', 'sass' ]);

gulp.task( 'default', [ 'watch' ]);