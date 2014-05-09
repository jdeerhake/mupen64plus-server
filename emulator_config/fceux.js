module.exports = {
  platform : require( '../platforms' ).nes,
  romExts : [ 'nes' ],
  binDir : '/opt/fceux/',
  cmd : './fceux',
  switches : {},
  env : {
    DISPLAY : ':0',
    HOME : '/opt/fceux/'
  }
};