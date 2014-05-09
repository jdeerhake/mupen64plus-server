var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var EventEmitter = require( 'events' ).EventEmitter;

function subscribe( process, emitter ) {
  process.on( 'exit', function( code, sig ) {
    emitter.emit( 'exit', code, sig );
  });

  process.stdout.on( 'data', function( data ) {
    emitter.emit( 'stdout', '' + data );
  });

  process.stderr.on( 'data', function( data ) {
    emitter.emit( 'stderr', '' + data );
  });
}


function Command( config ) {
  this._env = config.env || process.env;
  this._cwd = config.cwd || this._env.HOME;
  this._cmd = config.cmd;
  this._switches = config.switches;
  this.events = new EventEmitter();
}

Command.prototype = {
  args : function() {
    return _.reduce( this._switches, function( args, val, key ) {
      args.push( '--'  + key );
      if( val !== true ) {
        args.push( val );
      }
      return args;
    }, [] );
  },
  procOpts : function() {
    return {
      cwd : this._cwd,
      env : this._env
    };
  },
  kill : function() {
    var proc = this.process;
    if( proc ) {
      proc.kill( 'SIGKILL' );
    }
    this.process = false;
  },
  execute : function( arg ) {
    this.process = spawn( this._cmd, this.args().concat( arg ), this.procOpts() );
    subscribe( this.process, this.events );
  },
  getFullCmd : function( arg ) {
    return this._cmd + ' ' + this.args().concat( arg ).join( ' ' );
  }
};

module.exports = Command;