var socket = io.connect( '' );

require( './games' )( socket );
require( './options' )( socket );
require( './console' )( socket );

