var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var karma = require('karma').server;
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var fs = require('fs');
var _ = require('lodash');

karmaConfiguration = {
  browsers: ['PhantomJS'],
  frameworks: ['jasmine', 'browserify'],
  files: ['spec/emojie-spec.js'],
  preprocessors: {
    'spec/*': ['browserify']
  }
};

gulp.task('watch', function(done) {
  karma.start(_.assign({}, karmaConfiguration, {
    singleRun: false,
    autoWatch: true,
    browserify: {
      watch: true
    }
  }), done);
});

gulp.task('test', function(done) {
  karma.start(_.assign({}, karmaConfiguration, {
    singleRun: true
  }), done);
});

gulp.task('test-browser', function(done) {
  karma.start(_.assign({}, karmaConfiguration, {
    singleRun: true,
    browsers: ['Chrome', 'Firefox']
  }), done);
});

gulp.task('dist', function() {
  return gulp.src('emojie.js').pipe(uglify()).pipe(rename('emojie.min.js')).pipe(gulp.dest('./'));
});

gulp.task('default', ['test', 'dist']);
