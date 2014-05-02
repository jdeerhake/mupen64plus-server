var $ = require( 'jquery' );

module.exports = function( socket ) {
  socket.on( 'emulator:stderr', function( val ) {
    $( '#console' ).append( val + '\n' );
  });

  socket.on( 'emulator:stdout', function( val ) {
    $( '#console' ).append( val + '\n' );
  });

  socket.on( 'emulator:exit', function( val ) {
    $( '#console' ).append( val + '\n' );
  });

  socket.on( 'game:load', function() {
    //$( '#console' ).html( '' );
  });
};