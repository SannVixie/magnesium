const gulp = require('gulp');
const gulpIf = require('gulp-if');
const eslint = require('gulp-eslint');
const webpack = require('webpack');
const path = require('path');
const fse = require('fs-extra');
const prettify = require('gulp-jsbeautifier');

const webpackComponents = ['ui-control', 'ui-playlist'];

const webpackConfig = {
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: [
          'react', 'es2015', 'stage-0',
        ],
        plugins: ['react-html-attrs', 'transform-class-properties',
          'transform-decorators-legacy',
        ],
      },
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-sourcemap',
  target: 'electron',
};

gulp.task('lint:gulp', () => gulp.src(['./gulpfile.js'])
  .pipe(prettify())
  .pipe(eslint({
    fix: true,
  }))
  .pipe(gulp.dest('./')));

const isFixed = file => file.eslint != null && file.eslint.fixed;

gulp.task('lint:js', () => gulp.src(['src/**/*.jsx', 'src/**/*.js'])
  .pipe(prettify())
  .pipe(eslint({
    fix: true,
  }))
  .pipe(eslint.format())
  .pipe(gulpIf(isFixed, gulp.dest('src'))));

gulp.task('lint', ['lint:gulp', 'lint:js']);

gulp.task('clean', (callback) => {
  fse.emptyDir('./dist', callback);
});

const webpackTasks = [];
for (const component of webpackComponents) {
  const task = `webpack-${component}`;

  webpackTasks.push(task);

  gulp.task(task, (callback) => {
    const cfg = Object.create(webpackConfig);
    cfg.entry = `./src/${component}/index.jsx`;
    cfg.output.filename = 'index.min.js';
    cfg.output.path = `dist/${component}`;
    webpack(cfg, (err, stats) => {
      if (err) {
        console.error(err);
        throw new Error('webpack', err);
      }
      console.log(stats.toString({}));
      callback();
    });
  });
}

gulp.task('copy-static', ['clean'], (callback) => {
  for (const component of webpackComponents) {
    fse.copySync('src/html/index.html',
      `dist/${component}/index.html`);
  }
  callback();
});

gulp.task('webpack', webpackTasks);

gulp.task('build', ['clean', 'copy-static', 'webpack']);

gulp.task('default', ['start']);
