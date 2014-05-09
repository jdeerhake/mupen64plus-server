var _ = require( 'lodash' );
var requireAll = require( 'require-all' );

var config = require( './config' );
var emulatorConfig = requireAll( __dirname + '/emulator_config' );
var Emulator = require( './src/emulator' );

var server = require( './lib/server' )( config.server );
var io = require( 'socket.io' ).listen( server );


_.map( emulatorConfig, function( conf, name ) {
  _.merge( conf, config.emulators[ name ] );

  if( conf.disabled ) { return; }
  conf.name = name;
  console.log( 'Initializing new emulator: ' + name );
  return new Emulator( conf, io.sockets );
});
