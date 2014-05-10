module.exports =  {
  platform : require( '../platforms' ).ngc,
  romExts : [ 'gcm', 'iso' ],
  cmd : 'dolphin-emu',
  switches : {},
  gameSwitch : 'exec',
  env : {
    DISPLAY : ':0',
    HOME : '/opt/tenlr/'
  }
};