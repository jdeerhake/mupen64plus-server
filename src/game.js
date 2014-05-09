var _ = require( 'lodash' ),
  uuid = require( 'node-uuid' );


function Game( conf ) {
  _.merge( this, conf );
  // shorthand for plucking
  this.fileLocation = this.file.location;
  if( !this.id ) {
    this.id = 'game-' + uuid.v4();
  }
}

Game.prototype = {
  name : function() {
    var name = this.gamesDB.GameTitle;
    if( !name ) { name = this.file.name; }
    return name;
  },
  info : function() {
    var keys = [ 'Genre', 'Rating', 'ESRB', 'Developer' ];
    return keys.map((function( key ) {
      var func = key.toLowerCase();
      var val = this[ func ]();
      if( !val ) { return false; }
      return { key : key, val : val };
    }).bind( this )).filter( Boolean );
  },
  genre : function() {
    return [].concat( this.gamesDB.Genres.genre ).join( ', ' );
  },
  rating : function() {
    return Math.round( this.gamesDB.Rating * 10 ) / 10;
  },
  esrb : function() {
    return this.gamesDB.ESRB;
  },
  summary : function() {
    return this.gamesDB.Overview;
  },
  developer : function() {
    return this.gamesDB.Developer;
  },
  boxart : function() {
    if( !this.gamesDB.Images.boxart ) { return false; }
    var art = [].concat( this.gamesDB.Images.boxart );
    var front = _.find( art, { $ : { side : 'front' } } );
    if( !front ) { return false; }
    return {
      url : this._imgURL( front.$.width > 1000 ? front.$.thumb : front._ ),
      width : front.$.width,
      height : front.$.height
    };
  },
  _imgURL : function( path ) {
    return this.gamesDB.Images.baseImgURL + path;
  }
};

module.exports = Game;

