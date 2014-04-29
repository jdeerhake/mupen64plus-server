var config = require( './config' );

var server = require( './lib/server' )( config.server );
var io = require( 'socket.io' ).listen( server );


Object.keys( config.emulators ).forEach(function( emulator ) {
  if( !emulator.disabled ) {
    new require( './src/emulators/' + emulator )( config.emulators[ emulator ], io.sockets );
  }
});