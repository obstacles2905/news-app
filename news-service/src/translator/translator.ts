import {INewsData, INewsDataTranslated} from "../importer/contracts";

export interface ITranslator {
    translate(newsData: INewsData[]): any
}

export class Translator implements ITranslator {
    private translateProvider: any;
    constructor(translateProvider: any) {
        this.translateProvider = translateProvider;
    }

    translate(newsData: INewsData[]): INewsDataTranslated[] {
        return newsData.map(news => Object.assign(news, {
            titleTranslated: 'заголовок1',
            textTranslated: ['параграф1', 'параграф2']
        }));
    }
}