import { ITruyenFullChapter } from './hosts/truyenfull/types'

export interface EpubOutput {
    // title: string
    // author: string
    // output: string      // Epub file name 
    // content: any        //TODO: Change this 'any' type to a more specific type
    chapters: ITruyenFullChapter[]
    storyTitle: string
    outputStoryName: string,      // Need validation this outputStoryName must in syntax './<name>.epub'
    author: string
}

export interface IBasicStoryInfoRequest {
  hostWebsite: string, 
  outputStoryName: string,
  author: string
  storyTitle?: string
}