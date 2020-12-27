var os = require('os');
var pty = require('node-pty');
 
var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
 
var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});
 
ptyProcess.on('data', function(data) {
  process.stdout.write(data);
});
var stdin = process.stdin;


// without this, we would only get streams once enter is pressed
// stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );
stdin.on( 'data', function( key ){
    // ctrl-c ( end of text )
    if ( key === '\u0003' ) {
      process.exit();
    }
    // write the key to stdout all normal like
    ptyProcess.write( key );
});