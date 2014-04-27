var _ = require( 'lodash' );

function GameList( games ) {
  this._games = games || [];
}

GameList.prototype = {
  add : function( game ) {
    this._games.push( game );
  },
  find : function( id ) {
    return _.indexBy( this._games, 'id' )[ id ];
  },
  all : function() {
    return this._games;
  }
};

module.exports = GameList;