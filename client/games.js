/*global Masonry*/

var $ = require( 'jquery' );
var _ = require( 'lodash' );
var Game = require( '../src/game' );


require( '../lib/view_helpers' )( require( 'hbsfy/runtime' ) );

var tmpl = {
  game : require( '../tmpl/game.hbs' )
};

var container = $( '#games' ).html( '' );
var msnry = $( window ).width() > 500 ?  new Masonry( container[0], { itemSelector : '.game' }) : false;

function reset() {
  container.html( '' );
}


function initialize( gameData ) {
  return new Game( gameData );
}

function render( game ) {
  game.el = tmpl.game( game );
  return game;
}

function append( game) {
  container.append( game.el );
  return game;
}

function layout() {
  if( msnry ) {
    msnry.reloadItems();
    msnry.layout();
  }
}

function insertInOrder( game ) {
  container.find( '.game' ).toArray().reverse().some(function( el ) {
    var iterGameName = $( el ).data( 'name' ),
      addedGameName = game.name();

    if( addedGameName > iterGameName ) {
      game.el.insertAfter( el );
      return true;
    }
  }) || container.prepend( game.el );
}

function sortByName( gameA, gameB ) {
  return gameA.name() > gameB.name() ? 1 : -1;
}

module.exports = function( socket ) {

  socket.on( 'game:list', function( games ) {
    reset();
    games
      .map( initialize )
      .map( render )
      .sort( sortByName )
      .map( append );


  });

  socket.on( 'game:add', function( game ) {
    [].concat( game )
      .map( initialize )
      .map( render )
      .map( insertInOrder );
  });

  socket.on( 'game:remove', function( game ) {
    container.remove( '#' + game.id );
    layout();
  });

  $( '#games' )
    .on( 'click', '.game', function() {
      socket.emit( 'game:load', $( this ).attr( 'id' ) );
    })

    .on( 'click', '.toggle_info', function() {
      var infoEl = $( this ).siblings( '.info' );
      infoEl.toggle();
      return false;
    });


};