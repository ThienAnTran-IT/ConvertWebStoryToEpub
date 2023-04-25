

const http = require('http');
const readContentFunc = require('./src/readContent')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

const book = {
  title: 'Thiên kim là lão đại toàn năng',
  author: 'Khanh Thiển',
  startChapterIndex: 484,
  endChapterIndex: 834,
  url: 'https://ntruyen.vn/truyen/that-thien-kim-la-toan-nang-dai-lao-34879/5537887.html',
  outputName: 'thien-kim-toan-nang'
}
// const url = 'https://ztruyen.vn/truyen/nghich-thien-than-phi-toi-thuong-39863/9451288'

const htmlContent = readContentFunc.sendRequest(book.url)
readContentFunc.generateEpub(book.title, book.outputName, htmlContent, book.author)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



