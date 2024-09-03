const http = require('http');
import EPub from 'epub-gen';
import { generateEpubTruyenFull } from './readContent'

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((_req: any, res: { statusCode: number; setHeader: (arg0: string, arg1: string) => void; end: (arg0: string) => void; }) => {
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

// const book = {
//   title: 'Thiên kim là lão đại toàn năng',
//   author: 'Khanh Thiển',
//   startChapter: 1,
//   endChapter: 5538008,
//   // chaptersNo: tempChaps,
//   // url: 'https://ntruyen.vn/truyen/that-thien-kim-la-toan-nang-dai-lao-34879/5537943.html',
//   url: 'https://truyenf.com/bien-hinh-ky/chuong-1.html',
//   outputName: './thien-kim-la-lao-dai-toan-nang.epub',    //Get name from html
//   postFixType: '.epub'
// }
const book = {
  title: 'Ta Là Nữ Đầu Bếp Ở Tửu Lâu',
  author: 'Linh Te',
  startChapter: 1,
  endChapter: 8,
  // chaptersNo: tempChaps,
  // url: 'https://ntruyen.vn/truyen/that-thien-kim-la-toan-nang-dai-lao-34879/5537943.html',
  // url: 'https://truyenf.com/the-tu-phu-nhan/chuong-',
  url: 'https://truyenf.com/ta-la-nu-dau-bep-o-tuu-lau/chuong-'
}
// const url = 'https://ztruyen.vn/truyen/nghich-thien-than-phi-toi-thuong-39863/9451288'

const processUrl = () => {
  const args = process.argv.slice(2)
  const urlToDownload = args[0]
  if (!urlToDownload) {
    console.log( 'We need the url to download. PLease try again!')
    throw new Error('We need the url to download. PLease try again!')
  }
  return urlToDownload
}

const finalizeEpub = async () => {
  const urlToDownload = processUrl()

  console.log('\n*********************** START ***********************\n')
  const myBookChapters = await generateEpubTruyenFull(urlToDownload)

  const myBook = {
    title: myBookChapters.storyTitle ?? book.title,
    author: book.author,
    output: myBookChapters.outputStoryName ?? 'Default story name',
    content: myBookChapters.chapters
  }

  new EPub(myBook).promise.then(() => console.log('\n*********************** DONE ***********************\n'));
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  finalizeEpub()
});
