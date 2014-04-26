var $ = require( 'jquery' ),
  _ = require( 'lodash' ),
  Handlebars = require( 'handlebars' ),
  Game = require( '../src/game' );

Handlebars.registerHelper( 'titlize', function( text ) {
  if( text.length > 5 ) {
    return text[0].toUpperCase() + text.slice( 1 );
  } else {
    return text.toUpperCase();
  }
});

Handlebars.registerHelper( 'scrubLibName', function( text ) {
  return text
          .replace( /^.\/|\.so$/g, '' )
          .replace( /mupen64plus-(video|audio|input)-/, '' );
});

var tmpl = {
  game : Handlebars.compile( $( '#tmpl_game' ).html() ),
  arg : Handlebars.compile( $( '#tmpl_arg' ).html() ),
  argBinary : Handlebars.compile( $( '#tmpl_arg_binary' ).html() ),
  argSelect : Handlebars.compile( $( '#tmpl_arg_select' ).html() )
};

var socket = io.connect( '' );

socket.on( 'game:list', function( gms ) {
  var games = gms.map(function( gm ) { return new Game( gm ); });
  var container = $( '#games' ).html( games.map( tmpl.game ) );
  imagesLoaded( 'img', function() {
    new Masonry( container[0], { itemSelector : '.game' });
  });
});

socket.on( 'game:load', function() {
  $( '#console' ).html( '' );
});

socket.on( 'mupen:opts', function( opts ) {
  var optionsContainer = $( '#options' ).html( '' );
  _.reduce( opts, function( a, conf, name ) {
    if( conf.hidden ) { return;
    }
    if( conf.type === 'switch' ) {
      optionsContainer.append( tmpl.argBinary( conf ) );
    } else if( conf.vals ) {
      var select = $( tmpl.argSelect( conf ) );
      optionsContainer.append( select );
      if( conf.val ) {
        select.find( '[value="' + conf.val + '"]' ).attr( 'selected', true );
      }
    } else {
      optionsContainer.append( tmpl.arg( conf ) );
    }
  });
});

socket.on( 'console:output', function( val ) {
  $( '#console' ).append( val );
});

$( '#games' ).on( 'click', '.game', function() {
  socket.emit( 'game:load', $( this ).attr( 'id' ) );
});

$( '#options' ).on( 'blur', 'input[type=checkbox]', function() {
  var name = $( this ).parent().attr( 'id' ),
    val = $( this ).is( ':checked' ),
    o = {};

  o[ name ] = val;
  socket.emit( 'mupen:opts', o );
});

$( '#options' ).on( 'change', 'input[type!=checkbox], select', function() {
  console.log( 'chg' );
  var name = $( this ).parent().attr( 'id' ),
    val = $( this ).val(),
    o = {};

  o[ name ] = val;
  socket.emit( 'mupen:opts', o );
});

$( '#opts_toggle' ).click(function() {
  $( '#options' ).toggle();
});

$( '#console_toggle' ).click(function() {
  $( '#console' ).toggle();
});

$( '#end_game' ).click(function() {
  socket.emit( 'game:end' );
});