/*global imagesLoaded, Masonry*/
var $ = require( 'jquery' );
var Game = require( '../src/game' );

require( '../lib/view_helpers' )( require( 'hbsfy/runtime' ) );

var tmpl = {
  game : require( '../tmpl/game.hbs' )
};


function showGames( games ) {
  var container = $( '#games' ).html( games.map( tmpl.game ) );
  imagesLoaded( 'img', function() {
    new Masonry( container[0], { itemSelector : '.game' });
  });
}

module.exports = function( socket ) {

  socket.on( 'game:list', function( gms ) {
    var games = gms.map(function( gm ) { return new Game( gm ); });
    showGames( games );
  });

  $( '#games' ).on( 'click', '.game', function() {
    socket.emit( 'game:load', $( this ).attr( 'id' ) );
  });


};