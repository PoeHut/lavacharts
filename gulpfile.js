var gulp = require('gulp'),
   spawn = require('child_process').spawn,
      sh = require('sh'),
    bump = require('gulp-bump'),
  jshint = require('gulp-jshint'),
 replace = require('gulp-replace'),
    argv = require('yargs').array('browsers').argv,
   karma = require('karma').server,
    page = require('webpage').create();


gulp.task('karma', function (done) {
    karma.start({
        configFile: __dirname + '/configs/karma.conf.js',
        singleRun: argv.dev ? false : true
    }, function(exitStatus) {
        done(exitStatus ? "There are failing unit tests" : undefined);
    });
});

gulp.task('render', function (done) {
    var phpserver = spawn('php', ['-S', 'localhost:8946', '-t', 'tests/Renders']);

    phpserver.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    phpserver.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    var page = require('webpage').create();

    page.open('localhost:8946/TableChart.php', function () {
        page.render(__dirname + '/build/renders/tablechart.png')

        phantom.exit();
        phpserver.kill('SIGINT');
        phpserver.on('close', function (code) {
            console.log('child process exited with code ' + code);
        });
    });
});

gulp.task('php:test', function (done) {
    sh('./vendor/bin/phpunit -c configs/phpunit.xml');
});

gulp.task('php:doc', function (done) {
    sh('./vendor/bin/sami.php update configs/sami.cfg.php');
});

gulp.task('php:cs', function (done) {
    sh('./vendor/bin/phpcs -n --standard=PSR2 ./src ./tests');
});

gulp.task('php:fix', function (done) {
    sh('./vendor/bin/phpcbf -n --standard=PSR2 ./src ./tests');
});

gulp.task('js:lint', function (done) {
    gulp.src('./javascript/lava.js')
        .pipe(jshint());
});

gulp.task('bump', function (done) { //-v=1.2.3
    var version = argv.v;
    var minorVersion = version.slice(0, -2);

    gulp.src('./package.json')
        .pipe(bump({version:argv.v}))
        .pipe(gulp.dest('./'));

    gulp.src(['./README.md', './.travis.yml'])
        .pipe(replace(/("|=|\/|-)[0-9]+\.[0-9]+/g, '$1'+minorVersion))
        .pipe(gulp.dest('./'));
});
