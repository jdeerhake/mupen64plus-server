var conf = require( '../config' );
var spawn = require( 'child_process' ).spawn;
var _ = require( 'lodash' );
var events = require( 'events' );

var CMD = './mupen64plus';

var execOpts = {
  cwd : conf.mupenDir,
  env : {
    HOME : conf.mupenDir,
    DISPLAY : ':0'
  }
};

function Mupen64Plus( config ) {
  var cnsl = new events.EventEmitter();
  var process = false;
  var loadedGame = false;

  function logCmd( args ) {
    var cmd = CMD + ' ' + args.join( ' ' );
    cnsl.emit( 'output', '$ ' + cmd + '\n' );
  }

  function subscribeToProcess() {
    process.on( 'exit', function( code ) {
      loadedGame = false;
      cnsl.emit( 'exit', code );
    });

    process.stdout.on( 'data', function( data ) {
      cnsl.emit( 'output', '' + data );
    });

    process.stderr.on( 'data', function( data ) {
      cnsl.emit( 'output', '' + data );
    });
  }

  function args( file ) {
    return _.reduce( config, function( res, conf, name ) {
      if( !conf.val ) { return res; }
      res.push( '--'  + name );

      if( conf.type === 'val' ) {
        res.push( conf.val );
      }
      return res;
    }, [] ).concat( file );
  }

  function load( game ) {
    if( loadedGame ) { end(); }
    loadedGame = game;
    var arg = args( game.file.location );
    process = spawn( CMD, arg, execOpts );
    subscribeToProcess();
    logCmd( arg );
  }

  function end() {
    process.kill();
  }


  return {
    opts : config,
    load : load,
    end : end,
    loadedGame : loadedGame,
    console : cnsl
  };
}

module.exports = Mupen64Plus;