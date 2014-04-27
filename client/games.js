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
  if( msnry ) { msnry.reloadItems(); }
}

function preloadGame( game ) {
  game.el = $( tmpl.game( game ) );

  var img = game.el.find( 'img' ).attr( 'src' ),
    complete = _.partial( loadGame, game );
  if( img ) {
    var preload = new Image();
    preload.src = img;
    preload.onload = complete;
  } else {
    complete();
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

function loadGame( game ) {
  if( msnry ) {
    container.append( game.el );
    msnry.appended( game.el );
  }

  insertInOrder( game );

  if( msnry ) {
    msnry.reloadItems();
    //msnry.appended( game.el[0] );
    msnry.layout();
  }
}

function byName( gameA, gameB ) {
  return gameA.name() > gameB.name() ? 1 : -1;
}

module.exports = function( socket ) {

  socket.on( 'game:list', function( games ) {
    reset();
    games
      .map(function( gm ) { return new Game( gm ); })
      .sort( byName )
      .map( preloadGame );
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