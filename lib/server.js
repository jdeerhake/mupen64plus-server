var conf = require( '../config' );
var static = require( 'node-static' );
var file = new static.Server( './public' );

var app = require( 'http' ).createServer(function( request, response ) {
  request.addListener( 'end', function () {
    file.serve( request, response );
  } ).resume();
}).listen( conf.port );

module.exports = app;