var $ = require( 'jquery' );

module.exports = function( socket ) {
  socket.on( 'console:output', function( val ) {
    $( '#console' ).append( val );
  });

  socket.on( 'game:load', function() {
    $( '#console' ).html( '' );
  });

  $( '#console_toggle' ).click(function() {
    $( '#console' ).toggle();
  });
};