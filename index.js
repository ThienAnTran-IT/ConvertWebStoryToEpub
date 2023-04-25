

const http = require('http');

const readContentFunc = require('./readContent')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});


readContentFunc.sendRequest()

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



