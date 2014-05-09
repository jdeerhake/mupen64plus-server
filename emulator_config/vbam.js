module.exports = {
  platform : require( '../platforms' ).gba,
  romExts : [ 'gba' ],
  cmd : 'vbam',
  switches : {
    config : '/opt/tenlr/vbam.cfg'
  },
  env : {
    DISPLAY : ':0',
    HOME : '/opt/tenlr/'
  }
};