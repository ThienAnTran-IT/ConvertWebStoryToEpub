import axios from 'axios'
import { JSDOM } from 'jsdom'
import {
  STORY_TITLE_CLASSNAME,
  CHAPTER_CONTENT_CLASSNAME,
  CHAPTER_TITLE_CLASSNAME
} from './constants'
import { ITruyenFullChapter } from './types'
import { extractStoryInforFromUrl, getChapterUrl } from '../../utils'

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

export const generateEpubTruyenFull = async (url: string) => {
  const { hostWebsite, outputStoryName, author } = await extractStoryInforFromUrl(url)
  const allChapters: ITruyenFullChapter[] = []
  let storyTitle: string | null = ''

  let readlingChapterNo = 1
  let endReading = false

  do {
    const finalUrl = getChapterUrl(hostWebsite, url, readlingChapterNo)
    console.log('------------- finalUrl: ', finalUrl)

    if (!finalUrl) {
      console.error(`!!! Not found ${finalUrl} !!!\n`)
      endReading = true
    }

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
        if (error.response && error.response.status === 503) {
          readlingChapterNo--
          return
        } else {
          endReading = true
        }
      });
    
    if (readlingChapterNo > 252) {
      break
    }
    
    readlingChapterNo++
  } while (endReading === false)

  return {
    chapters: allChapters,
    storyTitle: storyTitle,
    outputStoryName: './' + outputStoryName + '.epub',
    author
  }
}

// module.exports = { generateEpub: generateEpubTruyenFull, generateEpubTruyenFull }
