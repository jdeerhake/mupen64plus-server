module.exports = {
  platform : require( '../platforms' ).gba,
  romExts : [ 'gba' ],
  binDir : '/opt/vba-m/',
  cmd : './vbam',
  switches : {
    config : '/opt/vba-m/vbam.cfg'
  },
  env : {
    DISPLAY : ':0',
    HOME : '/opt/vba-m/'
  }
};