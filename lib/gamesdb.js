var Promise = require( 'promise' );
var request = Promise.denodeify( require( 'request' ).get );
var parseXML = Promise.denodeify( require('xml2js').parseString );
var handlebars = require( 'handlebars' );
var _ = require( 'lodash' );

var API = 'http://thegamesdb.net/api/';
var PLATFORM = 'Nintendo 64';

function parse( response ) {
  return parseXML( response.body );
}

function makeRequest( url ) {
  return request( API + url ).then( parse );
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

var tmpl = {
  list : handlebars.compile( 'GetGamesList.php?&platform={{ platform }}&name={{ q }}' ),
  find : handlebars.compile( 'GetGame.php?id={{ id }}' )
};

var methods = {};

methods.list = function( q ) {
  return makeRequest( tmpl.list({ platform : PLATFORM, q : q }) )
    .then(function( data ) {
      return data.Data.Game;
    }, function() {
      return [];
    });
};

methods.find = function( id ) {
  return makeRequest( tmpl.find({ id : id }) )
    .then( flatten )
    .then(function( data ) {
      var game = data.Data.Game;
      game.Images.baseImgURL = data.Data.baseImgUrl;
      return game;
    }, function() {
      return {};
    });
};

methods.findByName = function( q ) {
  return methods.list( q ).then(function( matches ) {
    if( matches ) {
      return methods.find( matches[0].id[0] );
    } else {
      throw 'No matches';
    }
  });
};

module.exports = methods;