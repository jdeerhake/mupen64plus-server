var events = require( 'events' );
var path = require( 'path' );
var findit = require( 'findit' );
var watch = require( 'watch' );
var Game = require( './game' );
var gamesdb = require( '../lib/gamesdb' );


function fileInfo( location ) {
  return {
    name : path.basename( location ),
    dir : path.dirname( location ),
    location : location
  };
}

function fetchGDBInfo( file, platform ) {
  return gamesdb.findByNameAndPlatform( file.name.slice( 0, -4 ), platform );
}

function instantiateGame( info ) {
  return new Game( info );
}

function makeGame( file, platform ) {
  console.log( 'Found game file: ' + file.name + '. Downloading info.' );
  var gameInfo = { file : file, platform: platform };
  return fetchGDBInfo( file, platform )
    .then(function( gamesDB ) {
      gameInfo.gamesDB = gamesDB;
      return gameInfo;
    }, function() {
      return gameInfo;
    })
    .then( instantiateGame );
}

module.exports = function( dir, exts, platform ) {
  var finder = findit( dir );
  var eventEmitter = new events.EventEmitter();
  var extensionRegex = exts.map(function( ext ) {
    return new RegExp( '.' + ext + '$', 'i' );
  });

  function isRomFile( filename ) {
    return extensionRegex.some(function( reg ) {
      return !!reg.exec( filename );
    });
  }


  finder.on( 'file', function( location ) {
    var file = fileInfo( location );
    if( !isRomFile( file.name ) ) { return; }

    makeGame( file, platform ).then(function( game ) {
      eventEmitter.emit( 'add', game );
    });

  });

  watch.createMonitor( dir, function( monitor ) {

    monitor.on( 'created', function( location ) {
      var file = fileInfo( location );
      if( !isRomFile( file.name ) ) { return; }

      makeGame( file, platform ).then(function( game ) {
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