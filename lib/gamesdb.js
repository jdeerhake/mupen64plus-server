var Promise = require( 'promise' );
var request = Promise.denodeify( require( 'request' ).get );
var parseXML = Promise.denodeify( require('xml2js').parseString );
var _ = require( 'lodash' );
var url = require( 'url' );

function makeEndpoint( path ) {
  return function( q ) {
    return {
      protocol : 'http',
      host : 'thegamesdb.net',
      pathname : url.resolve( '/api/', path ),
      query : q
    };
  };
}

var endpoints = {
  list : makeEndpoint( 'GetGamesList.php' ),
  find : makeEndpoint( 'GetGame.php' )
};

function parse( response ) {
  return parseXML( response.body );
}

function makeRequest( urlConfig ) {
  return request( url.format( urlConfig ) ).then( parse );
}

function flatten( x ) {
  if( Array.isArray( x ) && x.length === 1 ) {
    return flatten( x[ 0 ] );
  } else if( Array.isArray( x ) ) {
    return x.map( flatten );
  } else if( typeof x === 'object' ) {
    return _.mapValues( x, flatten );
  } else {
    return x;
  }
}

var methods = {};

methods.list = function( params ) {
  return makeRequest( endpoints.list( params ) )
    .then(function( data ) {
      return data.Data.Game;
    }, function() {
      return [];
    });
};

methods.find = function( id ) {
  return makeRequest( endpoints.find({ id : id }) )
    .then( flatten )
    .then(function( data ) {
      var game = data.Data.Game;
      game.Images.baseImgURL = data.Data.baseImgUrl;
      return game;
    }, function() {
      return {};
    });
};

methods.findByNameAndPlatform = function( name, platform ) {
  return methods.list({ name : name, platform : platform }).then(function( matches ) {
    if( matches ) {
      var match = _.find( matches, function( match ) {
        return match.GameTitle[0] === name;
      } ) || matches[0];

      return methods.find( match.id[0] );
    } else {
      throw 'No matches';
    }
  });
};

module.exports = methods;