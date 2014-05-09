var _ = require( 'lodash' );
var GameList = require( './game_list' );
var GameFinder = require( './game_finder' );
var Command = require( './command' );


function Emulator( config, allSockets ) {
  var games = new GameList();
  var loadedGame = false;
  var command = new Command({
    cwd : config.binDir,
    env : _.extend( {}, process.env, config.env ),
    switches : config.switches,
    cmd : config.cmd
  });

  command.events.on( 'stdout', function( data ) {
    log( 'stdout', data );
  });

  command.events.on( 'stderr', function( data ) {
    log( 'stderr', data );
  });

  command.events.on( 'exit', function( code, sig ) {
    allSockets.emit( 'game:ended', loadedGame );
    loadedGame = false;
    log( 'exit', 'Exited with code ' + code + ' and ' + sig );
  });

  function loadGame( game ) {
    loadedGame = game;
    command.execute( game.file.location );
    log( 'cmd', command.getFullCmd( game.file.location ) );
    return true;
  }

  function endGame() {
    command.kill();
  }

  function log( action, val ) {
    allSockets.emit( 'emulator:' + action, config.name + ': ' + val );
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
    }
  };

  allSockets.on( 'connection', function bindEventHandlers( socket ) {
    socket.on( 'game:get_list', _.partial( handlers.gameList, socket ) );
    socket.on( 'game:load', handlers.gameLoad );
    socket.on( 'game:end', handlers.gameEnd );
  });

  var finder = new GameFinder( config.gamesDir, config.romExts, config.platform.gamesDB );
  finder.on( 'add', function( game ) {
    console.log( 'Game added for ' + config.name + ': ' + game.name() );
    game.platform = config.platform;
    games.add( game );
    allSockets.emit( 'game:added', game );
  });

  finder.on( 'remove', function( file ) {
    var game = games.findByFile( file );
    if( game ) {
      games.remove( game );
      allSockets.emit( 'game:removed', game );
    }
  });

  return;
}

module.exports = Emulator;