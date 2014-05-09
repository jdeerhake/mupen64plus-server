module.exports =  {
  platform : require( '../platforms' ).snes,
  romExts : [ 'smc' ],
  cmd : '/opt/snes9x/snes9x-gtk',
  switches : {},
  env : {
    DISPLAY : ':0',
    HOME : '/opt/tenlr/'
  }
};