var conf = require( '../config' ),
  defaults = require( '../mupen_defaults' ),
  _ = require( 'lodash' ),
  fs = require( 'fs' );

var args = [
  {
    name : 'configdir',
    type : 'val',
    hidden : true,
    val : './config'
  },
  {
    name : 'fullscreen',
    type : 'switch'
  },
  {
    name : 'windowed',
    type : 'switch'
  },
  {
    name : 'osd',
    type : 'switch'
  },
  {
    name : 'noosd',
    type : 'switch'
  },
  {
    name : 'verbose',
    type : 'switch'
  },
  {
    name : 'resolution',
    type : 'val'
  },
  {
    name : 'gfx',
    type : 'val',
    vals : (function() {
      return fs.readdirSync( conf.mupenDir ).filter(function( name ) {
        return name.match( /^mupen64plus-video-(.*)\.so$/i );
      }).map(function( name ) {
        return './' + name;
      });
    }())
  }
];

args.map(function( arg ) {
  if( typeof defaults[ arg.name ] !== 'undefined' ) {
    arg.val = defaults[ arg.name ];
  }
});

var dict = _.indexBy( args, 'name' );


module.exports = dict;