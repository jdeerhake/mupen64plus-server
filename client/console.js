var $ = require( 'jquery' );

module.exports = function( socket ) {
  socket.on( 'console:output', function( val ) {
    $( '#console' ).append( val + '\n' );
  });

  socket.on( 'game:load', function() {
    //$( '#console' ).html( '' );
  });
};