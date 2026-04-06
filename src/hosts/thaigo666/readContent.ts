import axios from 'axios'
import { JSDOM } from 'jsdom'
import {
  STORY_TITLE_SELECTOR,
  ENTRY_CONTENT_CLASS,
  CHAPTER_TITLE_SELECTOR,
  CHAPTER_CONTENT_CLASS,
  AUTHOR_LABEL,
} from './constants'
import { EpubOutput, IBasicStoryInfoRequest } from '../../types'
import { ITruyenFullChapter } from '../truyenfull/types'

interface IndexPageInfo {
  storyTitle: string
  author: string
  chapterUrls: string[]
}

const parseIndexPage = (html: string): IndexPageInfo => {
  const dom = new JSDOM(html).window.document

  const storyTitle = dom.querySelector(`.${ENTRY_CONTENT_CLASS} ${STORY_TITLE_SELECTOR}`)?.textContent?.trim() ?? ''

  const authorEl = Array.from(dom.querySelectorAll(`.${ENTRY_CONTENT_CLASS} strong`))
    .find(el => el.textContent?.includes(AUTHOR_LABEL))
  const author = authorEl?.parentElement?.textContent?.replace(AUTHOR_LABEL, '').trim() ?? 'unknown'

  const chapterUrls = Array.from(dom.querySelectorAll(`.${ENTRY_CONTENT_CLASS} p a`))
    .map(a => a.getAttribute('href') ?? '')
    .filter(href => href.includes('chuong-'))

  return { storyTitle, author, chapterUrls }
}

const parseChapterPage = (html: string, fallbackTitle: string): ITruyenFullChapter | null => {
  const dom = new JSDOM(html).window.document

  const title = dom.querySelector(CHAPTER_TITLE_SELECTOR)?.textContent?.trim() || fallbackTitle

  const paragraphs = Array.from(dom.querySelectorAll(`.${CHAPTER_CONTENT_CLASS} p`))
    .map(p => p.textContent?.trim() ?? '')
    .filter(text => text.length > 0)
  const data = paragraphs.join('<br /><br />')

  if (!data) {
    console.warn(`!!! Empty content for chapter: ${title}`)
    return null
  }

  return { title, data }
}

export const generateEpubThaigo666 = async (url: string, request: IBasicStoryInfoRequest): Promise<EpubOutput> => {
  const { outputStoryName, startChapterNo, endChapterNo } = request

  console.log('--- Fetching thaigo666 index page:', url)
  const indexRes = await axios.get(url)
  const { storyTitle, author, chapterUrls } = parseIndexPage(indexRes.data)

  const resolvedTitle = storyTitle || outputStoryName
  console.log(`--- Story: ${resolvedTitle}, Author: ${author}, Total chapters: ${chapterUrls.length}`)

  const startIdx = (startChapterNo ?? 1) - 1
  const endIdx = endChapterNo != null ? endChapterNo - 1 : chapterUrls.length - 1
  const selectedUrls = chapterUrls.slice(startIdx, endIdx + 1)

  const allChapters: ITruyenFullChapter[] = []

  for (let i = 0; i < selectedUrls.length; i++) {
    const chapterUrl = selectedUrls[i]
    const fallbackTitle = `Chương ${startIdx + i + 1}`
    console.log('--- Fetching chapter:', chapterUrl)
    try {
      const res = await axios.get(chapterUrl)
      if (res.status === 200 && res.data) {
        const chapter = parseChapterPage(res.data, fallbackTitle)
        if (chapter) allChapters.push(chapter)
      }
    } catch (error: any) {
      console.error('!!! ERROR fetching chapter:', chapterUrl, error?.message)
      if (error?.response?.status === 503) {
        // retry once
        try {
          const res = await axios.get(chapterUrl)
          if (res.status === 200 && res.data) {
            const chapter = parseChapterPage(res.data, fallbackTitle)
            if (chapter) allChapters.push(chapter)
          }
        } catch (retryError) {
          console.error('!!! Retry failed, skipping chapter:', chapterUrl)
        }
      }
    }
  }

  return {
    chapters: allChapters,
    storyTitle: resolvedTitle,
    outputStoryName: './' + outputStoryName + '.epub',
    author,
  }
}
