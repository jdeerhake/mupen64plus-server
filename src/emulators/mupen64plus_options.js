var defaults = require( '../../mupen_defaults' ),
  path = require( 'path' ),
  _ = require( 'lodash' ),
  fs = require( 'fs' );


module.exports = function( conf ) {
  var args = [
    {
      name : 'configdir',
      type : 'val',
      hidden : true,
      val : './config'
    },
    {
      name : 'datadir',
      type : 'val',
      hidden : true,
      val : './'
    },
    {
      name : 'sshotdir',
      type : 'val',
      hidden : true,
      val : path.resolve( conf.gamesDir, 'screenshots' )
    },
    {
      name : 'plugindir',
      type : 'val',
      hidden : true,
      val : './'
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
      name : 'resolution',
      type : 'val'
    },
    {
      name : 'verbose',
      type : 'switch'
    },
    {
      name : 'gfx',
      type : 'val',
      vals : (function() {
        return fs.readdirSync( conf.binDir ).filter(function( name ) {
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

  return _.indexBy( args, 'name' );

};