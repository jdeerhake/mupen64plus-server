var $ = require( 'jquery' ),
  Handlebars = require( 'handlebars' ),
  Game = require( '../src/game' );

var tmpl = {
  game : Handlebars.compile( $( '#tmpl_game' ).html() ),
  arg : Handlebars.compile( $( '#tmpl_arg' ).html() ),
  argBinary : Handlebars.compile( $( '#tmpl_arg_binary' ).html() )
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
  Object.keys( opts ).sort().forEach(function( name ) {
    var val = opts[ name ],
      obj = { name : name, val : val };
    if( [ 'true', 'false' ].indexOf( val.toString() ) > -1 ) {
      optionsContainer.append( tmpl.argBinary( obj ) );
    } else {
      optionsContainer.append( tmpl.arg( obj ) );
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

$( '#options' ).on( 'blur', 'input[type=text]', function() {
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