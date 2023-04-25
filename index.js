

const http = require('http');
const readContentFunc = require('./src/readContent')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

// const url = 'https://ztruyen.vn/truyen/nghich-thien-than-phi-toi-thuong-39863/9451288'
const url = 'https://truyenyy.vip/truyen/that-thien-kim-nang-la-toan-nang-dai-lao/chuong-454.html'
readContentFunc.sendRequest(url)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



