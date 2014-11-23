/**
 *  Expose `plugin`
 */

module.exports = plugin;

/**
 * Imports
 */

var gaze    = require('gaze'),
    chalk   = require('chalk'),
    tinylr  = require('tiny-lr');

/**
 * A metalsmith plugin to watch all files in the project directory. 
 * Rebuilds the project on file change
 */

var watchall = {
  running: false
};

function startLiveReloadServer(){
  var port    = 35729,
      server  = tinylr();
  server.listen(port, function(){
    console.log(chalk.cyan('Listening on port', port));
  });
  watchall.server = server;
};

function startWatcher(metalsmith, files, done){
  gaze(['templates/*', 'src/**/*'], function(err, watcher) {
    console.log(chalk.green('Watching files'));
    this.on('changed', function(filepath) {
      console.log(chalk.red(filepath) + chalk.blue(' was changed.'));
      console.log(chalk.yellow('Rebuilding files...'));
      metalsmith.build(function(err, files){
        console.log(chalk.blue('Build successful'))
        watchall.server.changed({body:{files:Object.keys(files)}});
      });
    });
  });
  done();
};

function plugin(){
  return function(files, metalsmith, done){
    if ( watchall.running === false ) {
      startLiveReloadServer();
      startWatcher(metalsmith, files, done);
      watchall.running = true;
    } else {
      done();
    };
  }
}
