// const axios = require('axios');
// const jsdom = require("jsdom");
import axios from 'axios'
import { JSDOM } from 'jsdom'
import {
  STORY_TITLE_CLASSNAME,
  CHAPTER_CONTENT_CLASSNAME,
  CHAPTER_TITLE_CLASSNAME,
  TRUYENFULL_IO_HOST,
  TRUYENF_COM_HOST
} from "./hosts/truyenfull/constants"
import { ITruyenFullChapter } from "./hosts/truyenfull/types"

const POST_FIX_URL = '.html'

// const generateEpub = async (url, chaptersNo) => {
//   const allChapters = []
//   for (j = 0; j < chaptersNo.length; j++) {
//     const startChap = chaptersNo[j].startChapter
//     const endChap = chaptersNo[j].endChapter
//     console.log('------------- startChap: ', startChap)
//     console.log('------------- endChap: ', endChap)
//     for (i = startChap; i <= endChap; i++) {
//       const finalUrl = getUrlByChapter(url, i)
  
//     await axios
//       .get(finalUrl)
//       .then(res => {
//         if (res.status === 200 && res.data) {
//           htmlRaw = res.data
//           const chapterInfo = getChapterInfo(htmlRaw, '<div class="chapter-infos">', '<div class="chapter-direction bot">')
//           const chapterContent = getChapterContent(chapterInfo, '<div id="chapter-content">', ' </div>')
//           const chapterHeader = getChapterContent(chapterInfo, '<h1>', '</h1>')
    
//           const chapter = {
//             title: chapterHeader,
//             data: chapterContent
//           }
//           allChapters.push(chapter)
//         }
//       })
//       .catch(error => {
//         console.error(error);
//       });
//     }
//   }
//   return allChapters
// }

const getStoryTitleInTruyenFull = (dom: Document) => {
  return dom.getElementsByClassName(STORY_TITLE_CLASSNAME)[0].textContent
}

const getChapperTitleInTruyenFull = (dom: Document) => {
  return dom.getElementsByClassName(CHAPTER_TITLE_CLASSNAME)[0].textContent
}

const getChapperContentInTruyenFull = (dom: Document) => {
  return dom.getElementsByClassName(CHAPTER_CONTENT_CLASSNAME)[0].textContent?.replace(/\n/g, "<br />");
}

// const generateEpubTruyenFull = async (url, startChapter, endChapter, storyNameInUrl) => {
//   if (startChapter > endChapter) {
//     return "Invalid start chapter number and end chapter number"
//   }
//   const allChapters = []
//   let storyTitle = undefined
//   // for (j = startChapter; j < endChapter; j++) {
//     // const startChap = chaptersNo[j].startChapter
//     // const endChap = chaptersNo[j].endChapter
    
//     for (i = startChapter; i <= endChapter; i++) {
//       // const finalUrl = getUrlByChapter(url, i)
//       const finalUrl = url + i + POST_FIX_URL // https://truyenf.com
//       // const finalUrl = url + i   // https://truyenfull.io
    
//       console.log('------------- finalUrl: ', finalUrl)
//     await axios
//       .get(finalUrl)
//       .then(res => {
//         if (res.status === 200 && res.data) {
//           htmlRaw = res.data.replaceAll(/<br\s*[\/]?>/gi, "\n")
//           const dom = new jsdom.JSDOM(htmlRaw).window.document
//           storyTitle = getStoryTitleInTruyenFull(dom)
//           const chapterTitle = getChapperTitleInTruyenFull(dom)
//           const chapterContent = getChapperContentInTruyenFull(dom)
//           const chapter = {
//             title: chapterTitle,
//             data: chapterContent
//           }
//           allChapters.push(chapter)
//         }
//       })
//       .catch(error => {
//         console.error(error);
//       });
//     }
//   // }
//   return {
//     chapters: allChapters,
//     storyTitle: storyTitle
//   }
// }

const getHostFromUrl = (url: string) => {
  const urlParts = url.split('/')
  return urlParts[2]
}

export const generateEpubTruyenFull = async (url: string) => {
  const hostWebsite = getHostFromUrl(url)
  let outputStoryName = ''
  if (hostWebsite === TRUYENFULL_IO_HOST || hostWebsite === TRUYENF_COM_HOST) {
    const urlParts = url.split('/')
    outputStoryName = urlParts[3]
  }

  const allChapters: ITruyenFullChapter[] = []
  let storyTitle: string | null = ''

  let readlingChapterNo = 1
  let endReading = false
  do {
    const finalUrl = url + readlingChapterNo + POST_FIX_URL // https://truyenf.com
    // const finalUrl = url + readlingChapterNo   // https://truyenfull.io


    await axios
      .get(finalUrl)
      .then((res: any) => {
        if (res.status === 200 && res.data) {
          const htmlRaw = res.data.replaceAll(/<br\s*[\/]?>/gi, "\n")
          const dom = new JSDOM(htmlRaw).window.document

          try {
            storyTitle = getStoryTitleInTruyenFull(dom)
            const chapterTitle = getChapperTitleInTruyenFull(dom)
            const chapterContent = getChapperContentInTruyenFull(dom)
            const chapter: ITruyenFullChapter = {
              title: chapterTitle ?? '',
              data: chapterContent ?? ''
            }
            allChapters.push(chapter)
          } catch (error) {
            console.error('!!! ERROR !!!\n', error)
            endReading = true
          }
          
        }
      })
      .catch((error: any) => {
        console.error(error);
        endReading = true
      });
    
    
    readlingChapterNo++
  } while (endReading === false)

  return {
    chapters: allChapters,
    storyTitle: storyTitle,
    outputStoryName: './' + outputStoryName + '.epub'
  }
}

// module.exports = { generateEpub: generateEpubTruyenFull, generateEpubTruyenFull }
