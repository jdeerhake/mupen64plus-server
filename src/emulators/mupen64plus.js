var spawn = require( 'child_process' ).spawn;
var _ = require( 'lodash' );
var GameList = require( '../game_list' );
var GameFinder = require( '../game_finder' );


var VALID_EXTS = [ 'n64', 'v64', 'z64', 'rom' ];
var PLATFORM = 'Nintendo 64';
var CMD = './mupen64plus';
var NAME = 'mupen64plus';


function Mupen64Plus( config, allSockets ) {
  var opts = require( './mupen64plus_options' )( config );
  var games = new GameList();
  var process = false;
  var loadedGame = false;

  var execOpts = {
    cwd : config.binDir,
    env : _.extend({
      DISPLAY : ':0',
      HOME : '/opt/mupen64plus'
    }, process.env )
  };

  function args( file ) {
    return _.reduce( opts, function( res, conf, name ) {
      if( !conf.val ) { return res; }
      res.push( '--'  + name );

      if( conf.type === 'val' ) {
        res.push( conf.val );
      }
      return res;
    }, [] ).concat( file );
  }

  function loadGame( game ) {
    if( loadedGame ) { throw 'End current game before loading a new one'; }
    loadedGame = game;
    var arg = args( game.file.location );
    process = spawn( CMD, arg, execOpts );
    subscribeToProcess( process );
    log( 'cmd_issued', CMD + ' ' + arg.join( ' ' ) + '\n' );
  }

  function endGame() {
    process.kill();
  }

  function log( action, val ) {
    allSockets.emit( 'emulator:' + action, NAME + ': ' + val );
  }

  function subscribeToProcess( proc ) {
    proc.on( 'exit', function( code, sig ) {
      loadedGame = false;
      log( 'exit', 'code: ' + code + ', sig: ' + sig );
    });

    proc.stdout.on( 'data', function( data ) {
      log( 'stdout', '' + data );
    });

    proc.stderr.on( 'data', function( data ) {
      log( 'stderr', '' + data );
    });
  }


  var handlers = {
    gameList : function( socket ) {
      socket.emit( 'game:list', games.all() );
    },
    gameLoad : function( gameID ) {
      var game = games.find( gameID );
      if( game && loadGame( game ) ) {
        allSockets.emit( 'game:loaded', game );
      }
    },
    gameEnd : function() {
      if( !loadedGame ) { return false; }
      allSockets.emit( 'game:ended', loadedGame );
      endGame();
    },
    getOpts : function( socket, emuName ) {
      emuName = emuName || NAME;
      if( emuName === NAME ) {
        socket.emit( 'emulator:opts', opts );
      }
    },
    updateOpts : function( obj ) {
      console.log( obj );
      _.merge( opts, obj );
    }
  };

  allSockets.on( 'connection', function bindEventHandlers( socket ) {
    socket.on( 'game:get_list', _.partial( handlers.gameList, socket ) );
    socket.on( 'game:load', handlers.gameLoad );
    socket.on( 'game:end', handlers.gameEnd );
    socket.on( 'emulator:get_opts', _.partial( handlers.getOpts, socket ) );
    socket.on( 'emulator:opts', handlers.updateOpts );
  });

  var finder = new GameFinder( config.gamesDir, VALID_EXTS, PLATFORM );
  finder.on( 'add', function( game ) {
    console.log( 'Game added for ' + NAME + ': ' + game.name() );
    games.add( game );
    allSockets.emit( 'game:add', games );
  });

  finder.on( 'remove', function( file ) {
    var game = games.findByFile( file );
    if( game ) {
      games.remove( game );
      allSockets.emit( 'game:remove', game );
    }
  });

  return;
}

module.exports = Mupen64Plus;