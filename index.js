var os = require('os');
var pty = require('node-pty');

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(process.env.PORT || 8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});
wsServer = new WebSocketServer({
  httpServer: server,
});
var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});
wsServer.on('request', function (request) {
  // var Client = require('ssh2').Client;

  // var conn = new Client();
  
  
  var connection = request.accept(null, request.origin);
  //sent to browser
  ptyProcess.on('data', function (data) {
    connection.send(data);
  });
  //receive message from browser
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      ptyProcess.write(message.utf8Data)
    }
    else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      ptyProcess.write(message.binaryData);
    }
  // conn.on('ready', function () {
  //   console.log('Client :: ready');
  //   conn.shell(function (err, stream) {
  //     connection.on('message', function (message) {
  //       if (message.type === 'utf8') {
  //         console.log('Received Message: ' + message.utf8Data);
  //         stream.write(message.utf8Data)
  //       }
  //       else if (message.type === 'binary') {
  //         console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
  //         stream.write(message.binaryData);
  //       }
    
  //     });
  //     if (err) throw err;
  //     stream.on('close', function () {
  //       console.log('Stream :: close');
  //       connection.close()
  //     }).on('data', function (data) {
  //       console.log('OUTPUT: ' + data);
  //       connection.sendUTF(data)
  //     });
  //     // stream.end('ls -l\nexit\n');
  //   });
  // })
  
  
  // conn.connect({
  //   host: 'localhost',
  //   port: 22,
  //   username: 'manjaro',
  //   password: 'manjaro'
});

connection.on('close', function (reasonCode, description) {
  console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  ptyProcess.kill()
  // conn.end();
});


// conn.on('ready', function () {
//   console.log('Client :: ready');
//   conn.shell(function (err, stream) {
//     if (err) throw err;
//     stream.on('close', function () {
//       console.log('Stream :: close');
//       conn.end();
//     }).on('data', function (data) {
//       console.log('OUTPUT: ' + data);
//     });
//     stream.end('ls -l\nexit\n');
//   });
// })




// var stdin = process.stdin;

// // without this, we would only get streams once enter is pressed
// stdin.setRawMode( true );

// // resume stdin in the parent process (node app won't quit all by itself
// // unless an error or process.exit() happens)
// stdin.resume();

// // i don't want binary, do you?
// stdin.setEncoding( 'utf8' );
// stdin.on( 'data', function( key ){
//     // ctrl-c ( end of text )
//     if ( key === '\u0003' ) {
//       process.exit();
//     }
//     // write the key to stdout all normal like
//     ptyProcess.write( key );
});