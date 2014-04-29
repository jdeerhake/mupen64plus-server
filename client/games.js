var $ = require( 'jquery' );
var _ = require( 'lodash' );
var Game = require( '../src/game' );


require( '../lib/view_helpers' )( require( 'hbsfy/runtime' ) );

var tmpl = {
  game : require( '../tmpl/game.hbs' )
};

var container = $( '#games' ).html( '' );

function reset() {
  container.html( '' );
}


function initialize( gameData ) {
  var game = new Game( gameData );
  game.el = $( tmpl.game( game ) );
  return game;
}


function append( game) {
  container.append( game.el );
  return game;
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
  socket.emit( 'game:get_list' );

  socket.on( 'game:list', function( games ) {
    reset();
    games
      .map( initialize )
      .sort( sortByName )
      .map( append );


  });

  socket.on( 'game:added', function( game ) {
    [].concat( game )
      .map( initialize )
      .map( insertInOrder );
  });

  socket.on( 'game:removed', function( game ) {
    container.remove( '#' + game.id );
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