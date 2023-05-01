

const http = require('http');
const readContentFunc = require('./src/readContent')
const epub = require('epub-gen');

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
  startChapter: 5537943,
  endChapter: 5537945,
  url: 'https://ntruyen.vn/truyen/that-thien-kim-la-toan-nang-dai-lao-34879/5537943.html',
  outputName: './thien-kim-toan-nang.epub',
  postFixType: '.epub'
}
// const url = 'https://ztruyen.vn/truyen/nghich-thien-than-phi-toi-thuong-39863/9451288'

const finalizeEpub = async () => {
  const myBookChapters = await readContentFunc.generateEpub(book.url, book.startChapter, book.endChapter)
  const myBook = {
    title: book.title,
    author: book.author,
    output: book.outputName,
    content: myBookChapters
  }
  new epub(myBook).promise.then(() => console.log('An Done'));
}
finalizeEpub()

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



