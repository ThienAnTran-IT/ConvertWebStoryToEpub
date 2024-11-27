import axios from 'axios'
import { JSDOM } from 'jsdom'

import { HOSTS} from "./hostsLibrary"
import {
  POST_FIX_URL,
  TRUYENFULL_IO_HOST,
  TRUYENF_COM_HOST
} from "./hosts/truyenfull/constants"
import { IBasicStoryInfoRequest } from './types'


const getHostFromUrl = (url: string) => {
  const urlParts = url.split('/')
  return urlParts[2]
}

const getStoryNameFromUrlNameByHost = (url: string, hostWebsite: string) => {
  switch (hostWebsite) {
    case HOSTS.TRUYENFULL_IO:
      return url.split('/')[3]
    case HOSTS.TRUYENFULL_VN:
      return url.split('/')[3]
    case HOSTS.TRUYENF_COM:
      return url.split('/')[3]
    case HOSTS.N_TRUYEN:
      return url.split('/')[4]
    case HOSTS.D_TRUYEN_NET:
      return url.split('/')[3]
    default:
      return ''
  }
}

//TODO: Move this funciton to truyenfull space
const getAuthorNameTruyenFull = async (url: string) => {
  const res = await axios.get(url)
  const author = await axios
    .get(url)
    .then((res: any) => {
      if (res.status === 200 && res.data) {
        const htmlRaw = res.data.replaceAll(/<br\s*[\/]?>/gi, "\n")
        const dom = new JSDOM(htmlRaw).window.document
        return dom.querySelector('a[itemprop=author]')?.textContent ?? 'unknown'  
      }
      else {
        return 'unknown'
      }
    })
    .catch((error: any) => {
      console.log('--- ERROR get Author name: ', error)
      return new Error(error)
    });
  console.log('--- author: ', author)
  return author?.toString()
}

const getAuthorNameDTruyenNet = async (url: string) => {
  const author = await axios
    .get(url)
    .then((res: any) => {
      if (res.status === 200 && res.data) {
        const htmlRaw = res.data.replaceAll(/<br\s*[\/]?>/gi, "\n")
        const dom = new JSDOM(htmlRaw).window.document
        const elementsByIconClass = dom.getElementsByClassName('fa-user')
        let index = 0
        let authorName: string | null | undefined = 'unknown'
        do {
          const currentElementNodename = elementsByIconClass[index].parentElement?.nodeName
          if (currentElementNodename === 'P') {
            console.log(elementsByIconClass[index].parentElement?.textContent)
            authorName = elementsByIconClass[index].parentElement?.textContent
            break
          }
          index++
        } while (index < elementsByIconClass.length)
        return authorName?.trim()
      }
      else {
        return 'unknown'
      }
    })
    .catch((error: any) => {
      console.log('--- ERROR get Author name: ', error)
      return new Error(error)
    });
  return author?.toString()
}

const getAuthorFromUrlNameByHost = async (url: string, hostWebsite: string) => {
  switch (hostWebsite) {
    case HOSTS.TRUYENFULL_IO:
      console.log('--- TRUYENFULL_IO: ')
      return await getAuthorNameTruyenFull(url)
    case HOSTS.TRUYENFULL_VN:
      return await getAuthorNameTruyenFull(url)
    case HOSTS.TRUYENF_COM:
      return await getAuthorNameTruyenFull(url)
    case HOSTS.N_TRUYEN:
      return 'unknown'    //TODO: Handle later
    case HOSTS.D_TRUYEN_NET:
      return await getAuthorNameDTruyenNet(url)
    default:
      return ''
  }
}

export const extractStoryInforFromUrl = async (url: string): Promise<IBasicStoryInfoRequest> => {
  const hostWebsite = getHostFromUrl(url)
  const outputStoryName = getStoryNameFromUrlNameByHost(url, hostWebsite)
  const author = await getAuthorFromUrlNameByHost(url, hostWebsite)
  
  return {
    hostWebsite,
    outputStoryName,
    author: author ?? 'unknown'
  }
}

//TODO: Move this funciton to truyenfull space
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

export const formatEpubFileName = (storyName: string, author: string) => {
  return `../ouput/${storyName}.epub`
}
