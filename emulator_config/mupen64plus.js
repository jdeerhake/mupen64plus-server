module.exports =  {
  platform : require( '../platforms' ).n64,
  romExts : [ 'n64', 'v64', 'z64', 'rom' ],
  binDir : '/opt/mupen64plus/',
  cmd : './mupen64plus',
  switches : {
    'configdir' : './config',
    'datadir' : './data',
    'sshotdir' : './screenshots'
  },
  env : {
    DISPLAY : ':0',
    HOME : '/opt/mupen64plus/'
  }
};