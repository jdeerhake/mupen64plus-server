var $ = require( 'jquery' );
var Game = require( '../src/game' );

$( '#opts_toggle' ).click(function() {
  $( '#options' ).toggle();
});

$( '#console_toggle' ).click(function() {
  $( '#console' ).toggle();
});

module.exports = function( socket ) {
  socket.on( 'game:load', function( gm ) {
    var game = new Game( gm );
    $( '#status' ).html( '<em>Now playing:</em> ' + game.name() + ' (' + game.file.name + ')' );
  });

  socket.on( 'game:end', function() {
    $( '#status' ).html( '<em>No game loaded</em>' );
  });

  $( '#end_game' ).click(function() {
    socket.emit( 'game:end' );
  });

};