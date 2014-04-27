var gulp = require( 'gulp' ),
  plumber = require( 'gulp-plumber' ),
  browserify = require( 'gulp-browserify' ),
  sass = require('gulp-sass');


var paths = {
  scripts : 'client/*.js',
  styles : 'scss/*.scss',
  output : 'public/compiled'
};

var bfyConf = {
  source : paths.scripts,
  transform: [ 'hbsfy' ]
};

gulp.task( 'scripts', function() {
  gulp.src( paths.scripts )
      .pipe( plumber() )
      .pipe( browserify( bfyConf ) )
      .pipe( gulp.dest( paths.output ) );
});

gulp.task( 'sass', function () {
  gulp.src( paths.styles )
    .pipe( plumber() )
    .pipe( sass() )
    .pipe( gulp.dest( paths.output ) );
});

gulp.task( 'watch', function() {
  gulp.watch( [ paths.scripts, 'lib/*.js', 'src/*.js' ], [ 'scripts' ]);
  gulp.watch( paths.styles, [ 'sass' ]);
});

gulp.task( 'compile', [ 'scripts', 'sass' ]);

gulp.task( 'default', [ 'watch' ]);