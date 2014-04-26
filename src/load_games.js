var findit = require( 'findit' );
var Promise = require( 'promise' );
var path = require( 'path' );
var Game = require( './game' );
var gamesdb = require( '../lib/gamesdb' );

var gameExts = [ /n64$/i, /z64$/i, /v64$/i ];

function matches( filename ) {
  return gameExts.some(function( reg ) {
    return !!reg.exec( filename );
  });
}

module.exports = function( dir ) {
  var finder = findit( dir ),
    promises = [];

  finder.on( 'file', function( fileloc, stat ) {
    var file = {
      name : path.basename( fileloc ),
      dir : path.dirname( fileloc ),
      location : fileloc,
      size : stat.size
    };

    if( !matches( file.name ) ) { return; }

    console.log( 'Found game ' + file.name + '. Downloading info.' );

    var p = gamesdb.findByName( file.name.slice( 0, -4 ) )
      .then(function( gamesDB ) {
        return { gamesDB : gamesDB, file : file };
      }, function() {
        return { file : file };
      });

    promises.push( p );
  });

  var finderDone = new Promise(function( resolve, reject ) {
    finder.on( 'end', function() { resolve(); });
  });

  return finderDone.then(function() {
    return Promise.all( promises ).then(function( gms ) {
      return gms.map(function( info ) {
        return new Game( info );
      });
    });
  });
};