import {INewsData, INewsImporter, INewsSources, INewsTitleData} from "./contracts";

export class TheGuardianImporter implements INewsImporter {
    private readonly link: string;

    constructor() {
        this.link = 'https://www.theguardian.com/games';
    }

    async importLatestNews(): Promise<INewsData[]> {
        const newsTitleData = await this.fetchTitleData();
        const newsContent = await this.fetchContentData(newsTitleData);
        return newsContent;
    }

    async fetchTitleData(): Promise<INewsTitleData[]> {
       return [
           {
               title: 'some title 1',
               url: 'https://someUrl1.com',
               date: 'someDate1',
               titleImage: 'https://someImageLink.com',
               source: INewsSources.TheGuardian
           }
       ]
    }

    async fetchContentData(titleData: INewsTitleData[]): Promise<INewsData[]> {
        return titleData.map(news => {
            return Object.assign(news, {
                textByParagraphs: ['paragraph1', 'paragraph2'],
                images: ['https://someImage1.com', 'https://someImage2.com']
            })
        })
    }
}