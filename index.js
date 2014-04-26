var config = require( './config' );
var _ = require( 'lodash' );
var Mupen64Plus = require( './src/mupen64plus' );

var games = [];
require( './src/load_games' )( config.gamesDir ).then(function( gms ) {
  console.log( 'Game info downloaded' );
  games = gms;
});

var server = require( './lib/server' );
var io = require( 'socket.io' ).listen( server );


var mupen = new Mupen64Plus( require( './mupen_defaults' ) );

function routes( socket ) {
  socket.emit( 'connection', 'connected' );
  socket.emit( 'game:list', games );
  socket.emit( 'mupen:opts', mupen.opts );

  socket.on( 'game:list', function() {
    socket.emit( 'game:list', games );
  });

  socket.on( 'game:load', function( id ) {
    var game = _.find( games, { id : id });
    if( !game ) {
      socket.emit( 'error', 'Invalid game ID' );
      return;
    }

    var process = mupen.load( game );
    io.sockets.emit( 'game:load', game );
    setBindings( process );
  });

  socket.on( 'mupen:opts', function( opts ) {
    _.extend( mupen.opts, opts );
    io.sockets.emit( 'mupen:opts', mupen.opts );
  });
}

function setBindings( process ) {
  process.stdout.on( 'data', function( data ) {
    io.sockets.emit( 'console:output', '' + data );
  });

  process.stderr.on( 'data', function( data ) {
    io.sockets.emit( 'console:output', '' + data );
  });
}


io.sockets.on( 'connection', routes );

