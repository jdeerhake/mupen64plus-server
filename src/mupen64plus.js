var conf = require( '../config' );
var spawn = require( 'child_process' ).spawn;
var path = require( 'path' );
var _ = require( 'lodash' );


function Mupen64Plus( config ) {
  this.opts = config;
}

Mupen64Plus.prototype = {
  load : function( game ) {
    if( this.process ) { this.end(); }
    console.log( 'args', this.args( game.file.location ) );
    this.process = spawn( './mupen64plus', this.args( game.file.location ), { cwd : conf.mupenDir });
    return this.process;
  },
  end : function() {
    this.process.kill();
  },
  args : function( file ) {
    return _.reduce( this.opts, function( res, val, name ) {
      var withVal = val === true ? '' : ' '  + val;
      if( val ) {
        res.push( '--' + name + withVal );
      }
      return res;
    }, [] ).concat( file );
  }
};

module.exports = Mupen64Plus;