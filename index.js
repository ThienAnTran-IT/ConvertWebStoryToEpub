

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

const tempChaps = [
  {
    startChapter: 5537974,
    endChapter: 5538008,
  },
  {
    startChapter: 5566921,
    endChapter: 5566929,
  },
  {
    startChapter: 5615099,
    endChapter: 5615102,
  },
  {
    startChapter: 5630757,
    endChapter: 5630760,
  },
  {
    startChapter: 5716992,
    endChapter: 5716997,
  },
  {
    startChapter: 5750094,
    endChapter: 5750097,
  },
  {
    startChapter: 5771855,
    endChapter: 5771858,
  },
  {
    startChapter: 5827427,
    endChapter: 5827432,
  },
  {
    startChapter: 5836616,
    endChapter: 5836617,
  },
  {
    startChapter: 5860592,
    endChapter: 5860595,
  },
  {
    startChapter: 5863920,
    endChapter: 5863921,
  },
  {
    startChapter: 5907190,
    endChapter: 5907204,
  },
  {
    startChapter: 5932051,
    endChapter: 5932052,
  },
  {
    startChapter: 5932270,
    endChapter: 5932271,
  },
  {
    startChapter: 5968457,
    endChapter: 5968458,
  },
  {
    startChapter: 6044003,
    endChapter: 6044013,
  },
  {
    startChapter: 6068160,
    endChapter: 6068161,
  },
  {
    startChapter: 6077187,
    endChapter: 6077188,
  },
  {
    startChapter: 6089086,
    endChapter: 6089087,
  },
  {
    startChapter: 6112721,
    endChapter: 6112726,
  },
  {
    startChapter: 6129212,
    endChapter: 6129213,
  },
  {
    startChapter: 6134661,
    endChapter: 6134662,
  },
  {
    startChapter: 6150083,
    endChapter: 6150084,
  },
  {
    startChapter: 6129212,
    endChapter: 6129213,
  },
  {
    startChapter: 6168277,
    endChapter: 6168278,
  },
  {
    startChapter: 6225707,
    endChapter: 6225712,
  },
  {
    startChapter: 6237597,
    endChapter: 6237598,
  },
  {
    startChapter: 6261234,
    endChapter: 6261237,
  },
  {
    startChapter: 6277587,
    endChapter: 6277588,
  },
  {
    startChapter: 6346851,
    endChapter: 6346856,
  },
  {
    startChapter: 6355631,
    endChapter: 6355632,
  },
  {
    startChapter: 6378711,
    endChapter: 6378713,
  },
  {
    startChapter: 6445416,
    endChapter: 6445425,
  },
  {
    startChapter: 6450826,
    endChapter: 6450829,
  },
  {
    startChapter: 6456808,
    endChapter: 6456809,
  },
  {
    startChapter: 6512677,
    endChapter: 6512682,
  },
  {
    startChapter: 6545812,
    endChapter: 6545815,
  },
  {
    startChapter: 6548379,
    endChapter: 6548380,
  },
  {
    startChapter: 6648475,
    endChapter: 6648484,
  },
  {
    startChapter: 6746677,
    endChapter: 6746691,
  },
  {
    startChapter: 6765706,
    endChapter: 6765707,
  },
  {
    startChapter: 6775159,
    endChapter: 6775160,
  },
  {
    startChapter: 6788307,
    endChapter: 6788308,
  },
  {
    startChapter: 6801912,
    endChapter: 6801913,
  },
  {
    startChapter: 6851533,
    endChapter: 6851540,
  },
  {
    startChapter: 6865739,
    endChapter: 6865740,
  },
  {
    startChapter: 6882060,
    endChapter: 6882061,
  },
  {
    startChapter: 6882536,
    endChapter: 6882539,
  },
  {
    startChapter: 6922334,
    endChapter: 6922340,
  },
  {
    startChapter: 6926791,
    endChapter: 6926792,
  },
  {
    startChapter: 6942550,
    endChapter: 6942552,
  },
  {
    startChapter: 6955734,
    endChapter: 6955734,
  },
  {
    startChapter: 7008256,
    endChapter: 7008263,
  },
  {
    startChapter: 7009170,
    endChapter: 7009171,
  },
  {
    startChapter: 7053414,
    endChapter: 7053415,
  },
  {
    startChapter: 7163677,
    endChapter: 7163681,
  },
  {
    startChapter: 7585389,
    endChapter: 7585409,
  },
  {
    startChapter: 8820030,
    endChapter: 8820044,
  },
]

const book = {
  title: 'Thiên kim là lão đại toàn năng',
  author: 'Khanh Thiển',
  // startChapter: 5537944,
  // endChapter: 5538008,
  chaptersNo: tempChaps,
  url: 'https://ntruyen.vn/truyen/that-thien-kim-la-toan-nang-dai-lao-34879/5537943.html',
  outputName: './thien-kim-la-lao-dai-toan-nang.epub',
  postFixType: '.epub'
}
// const url = 'https://ztruyen.vn/truyen/nghich-thien-than-phi-toi-thuong-39863/9451288'

const finalizeEpub = async () => {
  // const myBookChapters = await readContentFunc.generateEpub(book.url, book.startChapter, book.endChapter)
  const myBookChapters = await readContentFunc.generateEpub(book.url, book.chaptersNo)
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


// 5566921-5566929, 5615099-5615102, 5630757-5630760, 5716992-5716997, 5750094-5750097, 5771855-5771858, 5827427-5827432, 5836616-5836617, 5860592-5860595, 5863920-5863921, 5907190-5907204, 
// 5932051-5932052, 5932270-5932271, 5968457-5968458, 6044003-6044013, 6068160-6068161, 6077187-6077188, 6089086-6089087, 6112721-6112726, 6129212-6129213, 6134661-6134662, 6150083-6150084, 
// 6168277-6168278, 6225707-6225712, 6237597-6237598, 6261234-6261237, 6277587-6277588, 6346851-6346856, 6355631-6355632, 6378711-6378713, 6445416-6445425, 6450826-6450829
// 6456808-6456809, 6512677-6512682, 6545812-6545815, 6548379-6548380, 6648475-6648484, 6746677-6746691, 6765706-6765707, 6775159-6775160, 6788307-6788308, 6801912-6801913
// 6851533-6851540, 6865739-6865740, 6882060-6882061, 6882536-6882539, 6922334-6922340, 6926791-6926792, 6942550-6942552, 6955734-6955734, 7008256-7008263, 7009170-7009171
// 7053414-7053415, 7163677-7163681, 7585389-7585409, 8820030-8820044
