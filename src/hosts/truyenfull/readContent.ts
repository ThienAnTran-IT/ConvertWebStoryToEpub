import axios from 'axios'
import { JSDOM } from 'jsdom'
import {
  STORY_TITLE_CLASSNAME,
  CHAPTER_CONTENT_CLASSNAME,
  CHAPTER_TITLE_CLASSNAME,
  DEFAULT_START_CHAPTER_READ, 
  DEFAULT_END_CHAPTER_READ
} from './constants'
import { ITruyenFullChapter } from './types'
import { getChapterUrl } from '../../utils'
import { EpubOutput, IBasicStoryInfoRequest } from '../../types'

const getStoryTitleInTruyenFull = (dom: Document) => {
  return dom.getElementsByClassName(STORY_TITLE_CLASSNAME)[0].textContent
}

const getChapperTitleInTruyenFull = (dom: Document) => {
  return dom.getElementsByClassName(CHAPTER_TITLE_CLASSNAME)[0].textContent
}

const getChapperContentInTruyenFull = (dom: Document) => {
  return dom.getElementsByClassName(CHAPTER_CONTENT_CLASSNAME)[0].textContent?.replace(/\n/g, "<br />")
}

const handleDOMResponse = (res: any) => {
  const htmlRaw = res.data.replaceAll(/<br\s*[\/]?>/gi, "\n").replaceAll(`<br class="html-br" />`, "\n").replace(/<\/p>/g, '</p>\n\n')
  return new JSDOM(htmlRaw).window.document
}

export const generateEpubTruyenFull = async (url: string, request: IBasicStoryInfoRequest): Promise<EpubOutput> => {
  const { hostWebsite, outputStoryName, author, startChapterNo, endChapterNo } = request
  console.log('------- request: ', request)
  console.log('------- url: ', url)
  const allChapters: ITruyenFullChapter[] = []
  let storyTitle: string | null = ''

  let firstChapterRead = startChapterNo ?? DEFAULT_START_CHAPTER_READ
  let endChapterRead = endChapterNo ?? DEFAULT_END_CHAPTER_READ
  let endReading = false

  do {
  
    const finalUrl = getChapterUrl(hostWebsite, url, firstChapterRead)
    console.log('------------- finalUrl: ', finalUrl)

    if (!finalUrl) {
      console.error(`!!! Not found ${finalUrl} !!!\n`)
      endReading = true
    }

    await axios
      .get(finalUrl)
      .then((res: any) => {
        if (res.status === 200 && res.data) {
          const dom = handleDOMResponse(res)
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
            console.error('!!! ERROR !!!\n')
            console.error(error)
            return
            // endReading = true
          }
        }
      })
      .catch((error: any) => {
        console.error('!!! OUTSIDE ERROR !!!\n')
        console.error(error)
        if (error.response && error.response.status === 503) {
          firstChapterRead--
          return
        } else {
          endReading = true
        }
      });

    if (firstChapterRead === endChapterRead) {
      endReading = true
      break
    }

    firstChapterRead++
  } while (endReading === false)

  return {
    chapters: allChapters,
    storyTitle: storyTitle,
    outputStoryName: './' + outputStoryName + '.epub',
    author: author ?? 'unknown'
  }
}
