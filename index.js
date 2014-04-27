var config = require( './config' );
var _ = require( 'lodash' );
var Mupen64Plus = require( './src/mupen64plus' );
var GameList = require( './src/game_list' );
var GameFinder = require( './src/game_finder' );


var games = new GameList();
var finder = new GameFinder( config.gamesDir );
var mupen64plus = new Mupen64Plus( require( './src/mupen64plus_options' ) );


finder.on( 'game:found', function( game ) {
  console.log( 'Added game to the index: ' + game.name() );
  games.add( game );
});


var server = require( './lib/server' );
var io = require( 'socket.io' ).listen( server );


io.sockets.on( 'connection', handlers );

function handlers( socket ) {
  socket.emit( 'connection', 'connected' );
  socket.emit( 'game:list', games.all() );
  socket.emit( 'mupen64plus:opts', mupen64plus.opts );

  socket.on( 'game:list', function() {
    socket.emit( 'game:list', games.all() );
  });

  socket.on( 'game:load', function( id ) {
    var game = games.find( id );
    if( !game ) {
      socket.emit( 'error', 'Invalid game ID' );
      return;
    }

    var process = mupen64plus.load( game );
    io.sockets.emit( 'game:load', game );
    setProcessBindings( process );
  });

  socket.on( 'mupen64plus:opts', function( opts ) {
    Object.keys( opts ).map(function( key ) {
      var val = opts[ key ];
      mupen64plus.opts[ key ].val = val;
      io.sockets.emit( 'mupen64plus:opts', mupen64plus.opts );
    });
  });

  socket.on( 'game:end', function() {
    mupen64plus.end();
    io.sockets.emit( 'game:end' );
  });
}

function setProcessBindings( process ) {
  process.stdout.on( 'data', function( data ) {
    io.sockets.emit( 'console:output', '' + data );
  });

  process.stderr.on( 'data', function( data ) {
    io.sockets.emit( 'console:output', '' + data );
  });
}