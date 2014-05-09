module.exports = {
  platform : require( '../platforms' ).nes,
  romExts : [ 'nes' ],
  cmd : 'fceux',
  switches : {},
  env : {
    DISPLAY : ':0',
    HOME : '/opt/tenlr/'
  }
};