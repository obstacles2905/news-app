import {INewsData} from "../importer/importer";

interface INewsDataTranslated extends INewsData {
    textTranslated: string[];
}

export interface ITranslator {
    translate(newsData: INewsData[]): any
}

export class Translator implements ITranslator {
    private translateProvider: any;
    constructor(translateProvider: any) {
        this.translateProvider = translateProvider;
    }

    translate(newsData: INewsData[]): INewsDataTranslated[] {
        return newsData.map(news => Object.assign(news, {textTranslated: ['параграф1', 'параграф2']}));
    }
}