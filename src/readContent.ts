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
import { generateEpubDTruyenNet } from './hosts/dtruyen_net/readContent'
import { IBasicStoryInfoRequest, EpubOutput } from './types'
import { HOSTS } from './hostsLibrary'

export const readContent = async (url: string): Promise<EpubOutput>  => {
  const request = await extractStoryInforFromUrl(url)
  const { hostWebsite } = request
  console.log('--- hostWebsite done: ', request)
  switch (hostWebsite) {
    case HOSTS.TRUYENFULL_IO:
      return await generateEpubTruyenFull(url, request)
    case HOSTS.TRUYENF_COM:
      return await generateEpubTruyenFull(url, request)
    case HOSTS.D_TRUYEN_NET:
      return await generateEpubDTruyenNet(url, request)
    default:
      throw new Error(`Not support converting this website ${hostWebsite} yet`)
  }
}
