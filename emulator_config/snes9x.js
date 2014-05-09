module.exports =  {
  platform : require( '../platforms' ).snes,
  romExts : [ 'smc' ],
  binDir : '/opt/snes9x/',
  cmd : './snes9x-gtk',
  switches : {},
  env : {
    DISPLAY : ':0',
    HOME : '/opt/snes9x/'
  }
};