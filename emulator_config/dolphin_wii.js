module.exports =  {
  platform : require( '../platforms' ).wii,
  romExts : [ 'iso', 'wbfs' ],
  cmd : 'dolphin-emu',
  switches : {},
  gameSwitch : 'exec',
  env : {
    DISPLAY : ':0',
    HOME : '/opt/tenlr/'
  }
};