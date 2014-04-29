var static = require( 'node-static' );
var file = new static.Server( './public' );
var http = require( 'http' );

module.exports = function( config ) {
  return http.createServer(function( request, response ) {
    request.addListener( 'end', function () {
      file.serve( request, response );
    } ).resume();
  }).listen( config.port );
};
