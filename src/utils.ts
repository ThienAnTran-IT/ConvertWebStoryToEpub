import axios from 'axios'
import { JSDOM } from 'jsdom'

import {
  POST_FIX_URL,
  TRUYENFULL_IO_HOST,
  TRUYENF_COM_HOST
} from "./hosts/truyenfull/constants"

const getHostFromUrl = (url: string) => {
  const urlParts = url.split('/')
  return urlParts[2]
}

export const extractStoryInforFromUrl = async (url: string) => {
  const hostWebsite = getHostFromUrl(url)

  let outputStoryName = ''
  if (hostWebsite === TRUYENFULL_IO_HOST || hostWebsite === TRUYENF_COM_HOST) {
    const urlParts = url.split('/')
    outputStoryName = urlParts[3]
  }

  const author = await axios
  .get(url)
  .then((res: any) => {
    if (res.status === 200 && res.data) {
      const htmlRaw = res.data.replaceAll(/<br\s*[\/]?>/gi, "\n")
      const dom = new JSDOM(htmlRaw).window.document
      return dom.querySelector('a[itemprop=author]')?.textContent ?? 'unknown'  
    }
  })
  .catch((error: any) => {
    console.error(error)
    return new Error(error)
  });
  
  return {
    hostWebsite,
    outputStoryName,
    author: author?.toString()
  }
}

export const getChapterUrl = (host:string, originalUrl: string, chapterNo: number) => {
  switch (host) {
    case TRUYENFULL_IO_HOST:
      return originalUrl + 'chuong-' + chapterNo
    case TRUYENF_COM_HOST:
      return originalUrl + 'chuong-' + chapterNo + POST_FIX_URL   //TODO: Not correct
    default:
      return ''
  }
}
