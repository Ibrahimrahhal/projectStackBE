

import App from '../app';
import http from 'http';

var port = normalizePort(process.env.PORT || 3000);
var server = http.createServer(App);

server.listen(port);
console.log(port)

function normalizePort(val:any) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


