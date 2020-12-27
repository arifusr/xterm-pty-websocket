var Client = require('ssh2').Client;
 
var conn = new Client();
conn.on('ready', function() {
  console.log('Client :: ready');
  conn.shell(function(err, stream) {
    if (err) throw err;
    stream.on('close', function() {
      console.log('Stream :: close');
      conn.end();
    }).on('data', function(data) {
      console.log('OUTPUT: ' + data);
    });
    stream.end('ls -l\nexit\n');
  });
}).connect({
  host: 'localhost',
  port: 22,
  username: 'manjaro',
  password: 'manjaro'
});
 