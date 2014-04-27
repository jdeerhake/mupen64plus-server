/*global io*/
var socket = io.connect( '' );

require( './games' )( socket );
require( './options' )( socket );
require( './console' )( socket );
require( './action_bar' )( socket );