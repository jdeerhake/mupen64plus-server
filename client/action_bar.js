var $ = require( 'jquery' );
var _ = require( 'lodash' );
var Game = require( '../src/game' );
var hbs = require( 'handlebars' );

var tmpl = {
  gameStatus : hbs.compile( '<em>Now playing:</em> <span title="{{ file.name }}">{{ name }} ({{ platform.shortName }})</span>' ),
  noGame : hbs.compile( '<em>No game loaded</em>' )
};

$( '#opts_toggle' ).click(function() {
  $( '#options' ).toggle();
});

$( '#console_toggle' ).click(function() {
  $( '#console' ).toggle();
});

$( '#platform_selector' ).on( 'change', function() {
  filterByPlatform( $( this ).val() );
});



function updatePlatformOptions() {
  var platforms = _.uniq( $( '.game' ).map(function() {
      return $( this ).data( 'platform' );
    }).toArray() ).sort(),
    selector = $( '#platform_selector' );

  platforms.forEach(function( platform ) {
    if( !selector.find( '[value=\'' + platform + '\']' ).length ) {
      $( '<option>', { value : platform } ).text( platform ).appendTo( selector );
    }
  });
}

function filterByPlatform( platform ) {
  if( !platform ) {
    $( '.game' ).show();
  } else {
    $( '.game' ).hide();
    $( '.game[data-platform=\'' + platform + '\'' ).show();
  }
}

module.exports = function( socket ) {
  socket.emit( 'emulator:get_status' );

  socket.on( 'game:loaded', function( gm ) {
    var game = new Game( gm );
    $( '#status' ).html( tmpl.gameStatus( game ) );
  });

  socket.on( 'game:ended', function() {
    $( '#status' ).html( tmpl.noGame() );
  });

  socket.on( 'game:list', function() {
    setTimeout( updatePlatformOptions, 500 );
  });

  socket.on( 'game:added', function() {
    setTimeout( updatePlatformOptions, 500 );
  });

  $( '#end_game' ).click(function() {
    socket.emit( 'game:end' );
  });
};