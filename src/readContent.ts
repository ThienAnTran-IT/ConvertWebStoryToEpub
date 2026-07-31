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
import { generateEpubThaigo666 } from './hosts/thaigo666/readContent'
import { IBasicStoryInfoRequest, EpubOutput } from './types'
import { HOSTS } from './hostsLibrary'

export const readContent = async (url: string, startChap?: number, endChap?: number): Promise<EpubOutput>  => {
  const request: IBasicStoryInfoRequest = {
    ...(await extractStoryInforFromUrl(url)),
    startChapterNo: startChap,
    endChapterNo: endChap
  }
  const { hostWebsite } = request
  console.log('--- hostWebsite done: ', request)
  switch (hostWebsite) {
    case HOSTS.TRUYENFULL_IO:
      return await generateEpubTruyenFull(url, request)
    case HOSTS.TRUYENFULL_BIO:
    case HOSTS.TRUYENFULL_TODAY:
    case HOSTS.TRUYENFULL_LIVE:
      return await generateEpubTruyenFull(url, request)
    case HOSTS.TRUYENF_COM:
      return await generateEpubTruyenFull(url, request)
    case HOSTS.D_TRUYEN_NET:
      return await generateEpubDTruyenNet(url, request)
    case HOSTS.THAIGO666_COM:
      return await generateEpubThaigo666(url, request)
    default:
      throw new Error(`Not support converting this website ${hostWebsite} yet`)
  }
}
