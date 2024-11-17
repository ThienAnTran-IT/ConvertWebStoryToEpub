import axios from 'axios'
import { JSDOM } from 'jsdom'
import {
  STORY_TITLE_CLASSNAME,
  CHAPTER_CONTENT_CLASSNAME,
  CHAPTER_TITLE_CLASSNAME
} from './hosts/truyenfull/constants'
import { ITruyenFullChapter } from './hosts/truyenfull/types'
import { extractStoryInforFromUrl, getChapterUrl } from './utils'
import { generateEpubTruyenFull } from './hosts/truyenfull/readContent'
import { IBasicStoryInfoRequest, EpubOutput } from './types'

export const readContent = async (url: string): Promise<EpubOutput>  => {
  const request = await extractStoryInforFromUrl(url)
  const { hostWebsite } = request
  console.log('--- hostWebsite done: ', hostWebsite)
  switch (hostWebsite) {
    case 'truyenfull.io':
      return await generateEpubTruyenFull(url, request)
    case 'truyenf.com':
      return await generateEpubTruyenFull(url, request)
    default:
      throw new Error(`Not support converting this website ${hostWebsite} yet`)
  }
}
