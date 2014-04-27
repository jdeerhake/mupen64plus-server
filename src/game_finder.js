var events = require( 'events' );
var path = require( 'path' );
var findit = require( 'findit' );
var watch = require( 'watch' );
var Game = require( './game' );
var gamesdb = require( '../lib/gamesdb' );


function isRomFile( filename ) {
  var gameExts = [ /n64$/i, /z64$/i, /v64$/i, /rom$/i ];
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
  return gamesdb.findByName( file.name.slice( 0, -4 ) );
}

function instGame( info ) {
  return new Game( info );
}

function makeGame( file ) {
  console.log( 'Found game file: ' + file.name + '. Downloading info.' );

  return fetchGDBInfo( file )
    .then(function( gamesDB ) {
      return { gamesDB : gamesDB, file : file };
    }, function() {
      return { file : file };
    })
    .then( instGame );
}

module.exports = function( dir ) {
  var finder = findit( dir );
  var eventEmitter = new events.EventEmitter();

  finder.on( 'file', function( location ) {
    var file = fileInfo( location );
    if( !isRomFile( file.name ) ) { return; }

    makeGame( file ).then(function( game ) {
      eventEmitter.emit( 'add', game );
    });

  });

  watch.createMonitor( dir, function( monitor ) {

    monitor.on( 'created', function( location ) {
      var file = fileInfo( location );
      if( !isRomFile( file.name ) ) { return; }

      makeGame( file ).then(function( game ) {
        eventEmitter.emit( 'add', game );
      });
    });

    monitor.on( 'removed', function( location ) {
      var file = fileInfo( location );
      if( !isRomFile( file.name ) ) { return; }

      eventEmitter.emit( 'remove', location );
    });

  });



  return eventEmitter;
};