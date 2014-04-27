var config = require( './config' );
var Mupen64Plus = require( './src/mupen64plus' );
var GameList = require( './src/game_list' );
var GameFinder = require( './src/game_finder' );


var games = new GameList();
var finder = new GameFinder( config.gamesDir );
var mupen64plus = new Mupen64Plus( require( './src/mupen64plus_options' ) );


finder.on( 'add', function( game ) {
  games.add( game );
  console.log( 'Added game to the index: ' + game.name() );
  io.sockets.emit( 'game:list', games.all() );
});

finder.on( 'remove', function( file ) {
  var game = games.findByFile( file );
  games.remove( game );
  console.log( 'Removed game from index: ' + game.name() );
  io.sockets.emit( 'game:list', games.all() );
});


var server = require( './lib/server' );
var io = require( 'socket.io' ).listen( server );


io.sockets.on( 'connection', handlers );


function handlers( socket ) {
  socket.emit( 'connection:established' );
  socket.emit( 'game:list', games.all() );
  socket.emit( 'mupen64plus:opts', mupen64plus.opts );
  if( mupen64plus.loadedGame ) {
    socket.emit( 'game:load', mupen64plus.loadedGame );
  }

  socket.on( 'game:list', function() {
    socket.emit( 'game:list', games.all() );
  });

  socket.on( 'game:load', function( id ) {
    var game = games.find( id );
    if( !game ) {
      socket.emit( 'error', 'Invalid game ID' );
      return;
    }

    mupen64plus.load( game );
    io.sockets.emit( 'game:load', game );
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
  });
}

mupen64plus.console.on( 'output', function( data ) {
  io.sockets.emit( 'console:output', data );
});

mupen64plus.console.on( 'exit', function( status ) {
  io.sockets.emit( 'console:output', 'process exited with ' + status );
  io.sockets.emit( 'game:end' );
});
