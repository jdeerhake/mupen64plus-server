var _ = require( 'lodash' );
var GameList = require( '../game_list' );
var GameFinder = require( '../game_finder' );


var NAME = 'VisualBoyAdavnce';
var VALID_EXTS = [ 'gba' ];
var PLATFORM = 'Nintendo Game Boy Advance';


function VisualBoyAdvance( config, allSockets ) {
  var games = new GameList();

  var handlers = {
    gameList : function( socket ) {
      socket.emit( 'game:list', games.all() );
    }
  };

  allSockets.on( 'connection', function bindEventHandlers( socket ) {
    socket.on( 'game:get_list', _.partial( handlers.gameList, socket ) );
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

module.exports = VisualBoyAdvance;