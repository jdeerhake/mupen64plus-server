var events = require( 'events' );
var path = require( 'path' );
var findit = require( 'findit' );
var Game = require( './game' );
var gamesdb = require( '../lib/gamesdb' );


function isRomFile( filename ) {
  var gameExts = [ /n64$/i, /z64$/i, /v64$/i ];
  return gameExts.some(function( reg ) {
    return !!reg.exec( filename );
  });
}

function fileInfo( location ) {
  return {
    name : path.basename( location ),
    dir : path.dirname( location ),
    location : location
  };
}

function fetchGDBInfo( file ) {
  return gamesdb.findByName( file.name.slice( 0, -4 ) )
      .then(function( gamesDB ) {
        return { gamesDB : gamesDB, file : file };
      }, function() {
        return { file : file };
      });
}

function makeGame( info ) {
  return new Game( info );
}

module.exports = function( dir ) {
  var finder = findit( dir );
  var eventEmitter = new events.EventEmitter();

  finder.on( 'file', function( location, stat ) {
    var file = fileInfo( location );
    if( !isRomFile( file.name ) ) { return; }

    console.log( 'Found game file: ' + file.name + '. Downloading info.' );

    fetchGDBInfo( file )
      .then( makeGame )
      .then(function( game ) {
        eventEmitter.emit( 'game:found', game );
      });
  });

  return eventEmitter;
};