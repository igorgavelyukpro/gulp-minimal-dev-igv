const {task,src,dest,watch,series,parallel} = require('gulp');
const server = require('gulp-webserver');
const sass = require('gulp-sass');
var serverstarted=0;	// set a port to avoid conflicts with other local apps

// All paths
const paths = {
  index: {src: ['./src/*.html'], dest: './dist/' },
  html: {src: ['./src/html/*.html'], dest: './dist/html/'},
  images: {src: ['./src/images/**/**/*'],dest: './dist/images/'},
  css: {src: ['./src/css/**/*.css'], dest: './dist/css/'},
  sass: {src: ['./src/sass/**/*.scss'], dest: './src/css/'},
  fonts_ttf: {src: ['./src/fonts/**/*'], dest: './dist/fonts/'},
  fonts_web: {src: ['./src/webfonts/**/*'], dest: './dist/webfonts/'},
  styles: {src: ['./src/scss/**/*.scss'], dest: './dist/scss/'},
  scripts: {src: ['./src/scripts/**/*.js'],dest: './dist/scripts/'},
  serverdir:"./dist",
};
function mybuild(){
   series(parallel(copyHtml,copySass,copyCss,copyIndex,copyImages,copyScripts),myServer);
}
function mywatch(){
   parallel(mybuild,watcher,myServer);
}
function doAll() {
  return series(parallel('myServer', 'watcher'));
}
function copyIndex() {
  return src(paths.index.src)
  .pipe(dest(paths.index.dest));
}
function copyHtml() {
  return src(paths.html.src)
  .pipe(dest(paths.html.dest));
}
function copySass() {
  return src(paths.sass.src)
  .pipe(dest(paths.sass.dest));
}
function copyCss() {
  return src(paths.css.src)
  .pipe(dest(paths.css.dest));
}
function copyScripts() {
  return src(paths.scripts.src)
  .pipe(dest(paths.scripts.dest));
}
function copyImages() {
  return src(paths.images.src)
  .pipe(dest(paths.images.dest));
}
function watcher() {
  watch(paths.index.src,series(copyIndex))
  watch(paths.html.src,series(copyHtml))
  watch(paths.images.src,series(copyImages))
  watch(paths.sass.src,series(copySass))
  watch(paths.styles.src,series(copyCss))
  watch(paths.scripts.src,series(copyScripts))
  if(serverstarted==0){
    myServer();
    serverstarted=1;
  }
}
function myServer() {
  src(paths.serverdir)
  .pipe(server({
    livereload: true,
    open: true,
    port: 4321,	// set a port to avoid conflicts with other local apps
  }));
}
// Export tasks to make them public
exports.copyIndex = copyIndex;
exports.copyScripts = copyScripts;
exports.copySass = copySass;
exports.copyCss = copyCss;
exports.copyHtml = copyHtml;
exports.copyImages = copyImages;
exports.myServer = myServer;
exports.watcher = watcher;
exports.mywatch = mywatch;
exports.mybuild = mybuild;
exports.doAll = doAll;
exports.default = series(doAll);
