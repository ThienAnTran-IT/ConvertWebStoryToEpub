import axios from 'axios'
import { JSDOM } from 'jsdom'

import { EpubOutput, IBasicStoryInfoRequest } from '../../types'
import { ITruyenFullChapter } from '../truyenfull/types'

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

const getBookNumberFromChapterTitle = (chapterTitle: string) => {
  const bookNumber = chapterTitle.match(/Quyển (\d+)/)
  return bookNumber ? Number(bookNumber[1]) : undefined
}

const readChapters = async (url: string, chapters: ITruyenFullChapter[], retry = 1, bookNumber?: number) => {
  const adByGoogleText = '(adsbygoogle = window.adsbygoogle || []).push({});'
  let dom: Document

  await axios
    .get(url)
    .then(async (res: any) => {
      if (res.status === 200 && res.data) {
        const htmlRaw = res.data.replaceAll('<br/>', "\n")
        dom = new JSDOM(htmlRaw).window.document

        try {
          const chapterTitle = dom.querySelector('.chapter-title')?.textContent ?? ''
          const currentBookNumber = getBookNumberFromChapterTitle(chapterTitle)
          console.log('\n\n---------- READING ', currentBookNumber, ' --- ', bookNumber)
          console.log('           ------- ', chapterTitle)
          const chapterContentWithAds = dom.querySelector('#chapter-content')?.textContent
          const chapterContent = chapterContentWithAds?.replace(adByGoogleText, '')?.replace(/\n/g, "<br />");
          const currentChapter: ITruyenFullChapter = {
            title: chapterTitle,
            data: chapterContent ?? ''
          }
          chapters.push(currentChapter)

          // Get next chapter url in a tag with class 'chap-nav' and title 'Chương Sau'
          const nextChapterUrl = dom.querySelector('.chap-nav[title="Chương Sau"]')?.getAttribute('href')
          if (nextChapterUrl && (!currentBookNumber || !bookNumber || (currentBookNumber === bookNumber))) {
            retry = retry + 1
            
            await readChapters(nextChapterUrl, chapters, retry, currentBookNumber)
          } else {
            return { chapters, bookNumber }
          }
        } catch (error) {
          console.error('!!! ERROR !!!\n', error)
          console.log('-------------- ERROR CODE: ', res.status)
        }
      }
    })
    .catch(async (error: any) => {
      console.error('!!! ERROR: ', error.response.statusText);
      

      //Check if there is adblocker
      await readChapters(url, chapters, 1, bookNumber)
    });
}


export const generateEpubDTruyenNet = async (url: string, request: IBasicStoryInfoRequest): Promise<EpubOutput> => {
  const { hostWebsite, outputStoryName, author } = request
  console.log(hostWebsite, outputStoryName, author)

  let chapters: ITruyenFullChapter[] = []
  const storyTitle = await getStoryTitle(url)
  console.log('--- storyTitle: ', storyTitle)
  const bookNumber = 12
  await readChapters(url, chapters, 1, bookNumber)
  
  return {
    chapters: chapters,
    storyTitle: storyTitle?.concat(` - Quyển ${bookNumber}`) ?? '',
    outputStoryName: './' + outputStoryName.concat(`_quyen_${bookNumber}`) + '.epub',
    author: author ?? 'unknown'
  }
}