var _ = require( 'lodash' ),
  $ = require( 'jquery' );

require( '../lib/view_helpers' )( require( 'hbsfy/runtime' ) );

var tmpl = {
  optText   : require( '../tmpl/options/text.hbs' ),
  optCheck  : require( '../tmpl/options/check.hbs' ),
  optSelect : require( '../tmpl/options/select.hbs' )
};


function createOptions( opts ) {
  var optionsContainer = $( '#options' ).html( '' );
  _.reduce( opts, function( a, conf, name ) {
    if( conf.hidden ) { return;
    }
    if( conf.type === 'switch' ) {
      optionsContainer.append( tmpl.optCheck( conf ) );
    } else if( conf.vals ) {
      var select = $( tmpl.optSelect( conf ) );
      optionsContainer.append( select );
      if( conf.val ) {
        select.find( '[value="' + conf.val + '"]' ).attr( 'selected', true );
      }
    } else {
      optionsContainer.append( tmpl.optText( conf ) );
    }
  });
}


$( '#opts_toggle' ).click(function() {
  $( '#options' ).toggle();
});


module.exports = function( socket ) {
  socket.on( 'mupen64plus:opts', createOptions );


  $( '#options' ).on( 'change', 'input[type!=checkbox], select', function() {
    var name = $( this ).parent().attr( 'id' ),
      val = $( this ).val(),
      o = {};

    o[ name ] = val;
    socket.emit( 'mupen64plus:opts', o );
  });

  $( '#options' ).on( 'change', 'input[type=checkbox]', function() {
    var name = $( this ).parent().attr( 'id' ),
      val = $( this ).is( ':checked' ),
      o = {};

    o[ name ] = val;
    socket.emit( 'mupen64plus:opts', o );
  });
};