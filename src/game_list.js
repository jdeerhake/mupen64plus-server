var _ = require( 'lodash' );

function GameList( games ) {
  this._games = games || [];
}

GameList.prototype = {
  add : function( game ) {
    this._games.push( game );
  },
  remove : function( game ) {
    var dict = _.indexBy( this._games, 'id' );
    delete dict[ game.id ];
    this._games = _.values( dict );
  },
  find : function( id ) {
    return _.indexBy( this._games, 'id' )[ id ];
  },
  all : function() {
    return this._games;
  },
  findByFile : function( file ) {
    return _.indexBy( this._games, 'fileLocation' )[ file ];
  }
};

module.exports = GameList;