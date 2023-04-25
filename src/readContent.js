const axios = require('axios');
const jsdom = require("jsdom");

// interface epubChapter {
//   title: String,
//   data: String
// }

// interface epubBook {
//   title: String,
//   author: String,
//   output: String,
//   content: epubChapter[]
// }

const sendRequest = () => {
  axios
  .get(url)
  .then(res => {
    if (res.status === 200 && res.data) {
      htmlRaw = res.data
      var dom = new jsdom.JSDOM(htmlRaw)
      return dom
    }
  })
  .catch(error => {
    console.error(error);
  });
}

const generateEpub = (title, outputName, htmlContent, author = '') => {
  const bookTitle = title
  const bookAuthor = author
}

module.exports = { sendRequest, generateEpub }
// history_chapter=%7B%2239863%22%3A%7B%22story_id%22%3A%2239863%22%2C%22chapter_id%22%3A%229451288%22%2C%22chapter_name%22%3A%22Ch%5Cu01b0%5Cu01a1ng%20162%22%7D%7D; Path=/; Expires=Wed, 13 Feb 2075 08:28:28 GMT;