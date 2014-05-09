module.exports =  {
  platform : require( '../platforms' ).gcm,
  romExts : [ 'gcm' ],
  binDir : '/opt/dolphin/',
  cmd : './dolphin-emu',
  switches : {},
  gameSwitch : 'exec',
  env : {
    DISPLAY : ':0',
    HOME : '/opt/dolphin/'
  }
};