module.exports =  {
  platform : require( '../platforms' ).n64,
  romExts : [ 'n64', 'v64', 'z64', 'rom' ],
  cmd : '/opt/mupen64plus/mupen64plus',
  switches : {
    'configdir' : '/opt/.mupen64plus/config',
    'datadir' : '/opt/.mupen64plus/data',
    'sshotdir' : '/opt/.mupen64plus/sshots'
  },
  env : {
    DISPLAY : ':0',
    HOME : '/opt/tenlr/'
  }
};