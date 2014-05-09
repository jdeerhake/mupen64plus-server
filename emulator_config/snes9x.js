module.exports =  {
  platform : require( '../platforms' ).snes,
  romExts : [ 'smc' ],
  cmd : 'snes9x-gtk',
  switches : {},
  env : {
    DISPLAY : ':0',
    HOME : '/opt/tenlr/'
  }
};