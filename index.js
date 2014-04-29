var config = require( './config' );

var server = require( './lib/server' )( config.server );
var io = require( 'socket.io' ).listen( server );


Object.keys( config.emulators ).forEach(function( emulator ) {
  if( !emulator.disabled ) {
    try {
      new require( './src/emulators/' + emulator )( emulator, io.sockets );
    } catch(e) {
      throw 'Config exists for invalid emulator: ' + emulator;
    }
  }
});