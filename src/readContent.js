const axios = require('axios');

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

const sendRequest = (url) => {
  axios
  .get(url)
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res);
    // if (res.status === 200 && res.data) {
    //   htmlRaw = res.data
    //   // console.log("----- htmlRaw: ", htmlRaw)
    //   // console.log(typeof htmlRaw)
      
      
    //   // var doc = new DOMParser().parseFromString(htmlRaw, "text/xml");
    //   console.log("---------doc: ", htmlRaw)
    // } else {
    //   console.log('\n\n\n---------------- status: ', res.status)
    // }
  })
  .catch(error => {
    console.error(error);
  });
}

const generateEpub = (title, outputName, htmlRaw, author = '') => {
  const bookTitle = title
  const bookAuthor = author
}

module.exports = { sendRequest, generateEpub }