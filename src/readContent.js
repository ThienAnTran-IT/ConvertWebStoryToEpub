const axios = require('axios');

const POST_FIX_URL = '.html'
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

const getChapterInfo = (htmlRaw, searchStartStr, endStartString) => {
  const startIndexToSubstring = htmlRaw.indexOf(searchStartStr)
  const endIndexToSubstring = htmlRaw.indexOf(endStartString)
  const chapterInfo = htmlRaw.substring(startIndexToSubstring, endIndexToSubstring - 1)
  return chapterInfo
}

const getChapterContent = (chapterInfo, searchStartStr, endStartString) => {
  const chapterContent = chapterInfo.substring(
    chapterInfo.indexOf(searchStartStr) + searchStartStr.length,
    chapterInfo.indexOf(endStartString),
  )
  return chapterContent
}

const getPrefixUrl = (url) => {
  const lastIndexOfSlash = url.lastIndexOf('/')
  const prefixUrl = url.substring(0, lastIndexOfSlash + 1)
  return prefixUrl
}

const getUrlByChapter = (url, chapterNo) => {
  const prefixUrl = getPrefixUrl(url)
  const finalUrl = prefixUrl + chapterNo + POST_FIX_URL
  return finalUrl
}

const generateEpub = async (url, startChapter, endChapter) => {
  const allChapters = []
  for (i = startChapter; i <= endChapter; i++) {
    const finalUrl = getUrlByChapter(url, i)

  await axios
    .get(finalUrl)
    .then(res => {
      if (res.status === 200 && res.data) {
        htmlRaw = res.data
        const chapterInfo = getChapterInfo(htmlRaw, '<div class="chapter-infos">', '<div class="chapter-direction bot">')
        const chapterContent = getChapterContent(chapterInfo, '<div id="chapter-content">', ' </div>')
        const chapterHeader = getChapterContent(chapterInfo, '<h1>', '</h1>')
  
        const chapter = {
          title: chapterHeader,
          data: chapterContent
        }
        allChapters.push(chapter)
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  return allChapters
}

module.exports = { generateEpub }
