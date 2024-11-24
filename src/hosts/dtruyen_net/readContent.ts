import axios from 'axios'
import { JSDOM } from 'jsdom'

import { EpubOutput, IBasicStoryInfoRequest } from '../../types'
import { ITruyenFullChapter } from '../truyenfull/types'
import { url } from 'inspector'

const getStoryTitle = async (url: string) => {
  return await axios
    .get(url)
    .then((res: any) => {
      if (res.status === 200 && res.data) {
        const htmlRaw = res.data.replaceAll(/<br\s*[\/]?>/gi, "\n")
        const dom = new JSDOM(htmlRaw).window.document

        try {
          const storyTitle = dom.getElementsByClassName('story-title')[0].textContent
          return storyTitle
        } catch (error) {
          console.error('!!! ERROR !!!\n', error)
        }
      }
    })
    .catch((error: any) => {
      console.error('ERROR get Dtruyen.net story title: ', error);

    });
}

const readChapters = async (url: string, chapters: ITruyenFullChapter[], retry = 1, isCheckingAdBlocker?: boolean) => {
  const adByGoogleText = '(adsbygoogle = window.adsbygoogle || []).push({});'
  let dom: Document

  await axios
    .get(url)
    .then(async (res: any) => {
      if (res.status === 200 && res.data) {
        const htmlRaw = res.data.replaceAll(/<br\s*[\/]?>/gi, "\n")
        dom = new JSDOM(htmlRaw).window.document

        if (!isCheckingAdBlocker) {
          try {
            const chapterTitle = dom.querySelector('.chapter-title')?.textContent
            console.log('---------- READING ', chapterTitle)
            const chapterContentWithAds = dom.querySelector('#chapter-content')?.textContent
            const chapterContent = chapterContentWithAds?.replace(adByGoogleText, '')
            const currentChapter: ITruyenFullChapter = {
              title: chapterTitle ?? '',
              data: chapterContent ?? ''
            }
            chapters.push(currentChapter)
  
            // Get next chapter url in a tag with class 'chap-nav' and title 'Chương Sau'
            const nextChapterUrl = dom.querySelector('.chap-nav[title="Chương Sau"]')?.getAttribute('href')
            if (nextChapterUrl) {
              retry = retry + 1
              await readChapters(nextChapterUrl, chapters, retry)
            } else {
              return chapters
            }
          } catch (error) {
            console.error('!!! ERROR !!!\n', error)
            console.log('-------------- ERROR CODE: ', res.status)
          }
        } else {
          //Check if there is adblocker
          console.log('--- dom: ', dom)
        }
      }
    })
    .catch(async (error: any) => {
      console.error('error: ', error);
      

      //Check if there is adblocker
      await readChapters(url, chapters, 1)
    });
}


export const generateEpubDTruyenNet = async (url: string, request: IBasicStoryInfoRequest): Promise<EpubOutput> => {
  const { hostWebsite, outputStoryName, author } = request
  console.log(hostWebsite, outputStoryName, author)

  let chapters: ITruyenFullChapter[] = []
  const storyTitle = await getStoryTitle(url)
  console.log('--- storyTitle: ', storyTitle)
  await readChapters(url, chapters)
  
  return {
    chapters: chapters,
    storyTitle: storyTitle ?? '',
    outputStoryName: './' + outputStoryName + '.epub',
    author: author ?? 'unknown'
  }
}