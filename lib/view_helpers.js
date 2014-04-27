module.exports = function( hbs ) {

  hbs.registerHelper( 'titlize', function( text ) {
    if( text.length > 5 ) {
      return text[0].toUpperCase() + text.slice( 1 );
    } else {
      return text.toUpperCase();
    }
  });

  hbs.registerHelper( 'scrubLibName', function( text ) {
    return text
            .replace( /^.\/|\.so$/g, '' )
            .replace( /mupen64plus-(video|audio|input)-/, '' );
  });

};