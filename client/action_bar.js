var $ = require( 'jquery' );
var Game = require( '../src/game' );
var hbs = require( 'handlebars' );

var tmpl = {
  gameStatus : hbs.compile( '<em>Now playing:</em> <span title="{{ file.name }}">{{ name }}</span>' ),
  noGame : hbs.compile( '<em>No game loaded</em>' )
};

$( '#opts_toggle' ).click(function() {
  $( '#options' ).toggle();
});

$( '#console_toggle' ).click(function() {
  $( '#console' ).toggle();
});

module.exports = function( socket ) {
  socket.on( 'game:load', function( gm ) {
    var game = new Game( gm );
    $( '#status' ).html( tmpl.gameStatus( game ) );
  });

  socket.on( 'game:end', function() {
    $( '#status' ).html( tmpl.noGame() );
  });

  $( '#end_game' ).click(function() {
    socket.emit( 'game:end' );
  });
};