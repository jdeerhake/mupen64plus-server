module.exports =  {
  platform : require( '../platforms' ).n64,
  romExts : [ 'n64', 'v64', 'z64', 'rom' ],
  cmd : '/opt/mupen64plus/mupen64plus',
  switches : {
    'configdir' : './config',
    'datadir' : './data',
    'sshotdir' : './screenshots'
  },
  env : {
    DISPLAY : ':0',
    HOME : '/opt/tenlr/'
  }
};