import gulp from 'gulp'
import server from 'browser-sync';
import concat from 'gulp-concat';
import fileinclude from 'gulp-file-include';

const paths = {
    scripts: {
        src: './',
        dest: './build/'
    }
};

async function includeHTML() {
    return gulp.src([
        '*.html',
    ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(paths.scripts.dest));
}

async function buildJs() {
    let scriptSources = ['src/*.js'];
    gulp.src(scriptSources)
        .pipe(concat('index.js'))
        .pipe(gulp.dest('build/src'));
}

async function reload() {
    server.reload();
}

async function buildAndReload() {
    await includeHTML();
    await buildJs();
    reload();
}

export default async function() {
    server.init({
        server: {
            baseDir: paths.scripts.dest
        }
    });
    buildAndReload();
    gulp.watch(["*.html", 'src/*.js'], gulp.series(buildAndReload));
};