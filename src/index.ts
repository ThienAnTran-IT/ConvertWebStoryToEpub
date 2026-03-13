const http = require('http');
import EPub from 'epub-gen';
import { readContent } from './readContent'

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((_req: any, res: { statusCode: number; setHeader: (arg0: string, arg1: string) => void; end: (arg0: string) => void; }) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

const book = {
  title: 'Ta Là Nữ Đầu Bếp Ở Tửu Lâu',
  author: 'Linh Te',
  startChapter: 1,
  endChapter: 8,
  url: 'https://truyenf.com/ta-la-nu-dau-bep-o-tuu-lau/chuong-'
}

const processUrl = () => {
  const args = process.argv.slice(2)
  const urlToDownload = args[0]
  const startChapter = (args[1] && !isNaN(Number(args[1]))) ? Number(args[1]) : undefined
  const endChapter = (args[2] && !isNaN(Number(args[2]))) ? Number(args[2]) : undefined

  if (!urlToDownload) {
    console.log( 'We need the url to download. PLease try again!')
    throw new Error('We need the url to download. PLease try again!')
  }

  return {
    urlToDownload,
    startChapter,
    endChapter
  }
}

const finalizeEpub = async () => {
  const { urlToDownload, startChapter, endChapter } = processUrl()

  console.log('\n*********************** START ***********************\n')
  
  const myBookChapters = await readContent(urlToDownload, startChapter, endChapter)

  const myBook = {
    title: myBookChapters.storyTitle ?? book.title,
    author: myBookChapters.author,
    output: myBookChapters.outputStoryName ?? 'Default story name',
    content: myBookChapters.chapters
  }

  new EPub(myBook).promise.then(() => console.log('\n*********************** DONE ***********************\n'));
}

server.listen(port, hostname, async() => {
  console.log(`Server running at http://${hostname}:${port}/`);
  finalizeEpub()
});
