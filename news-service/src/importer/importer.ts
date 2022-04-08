import {PCGamerImporter} from "./pcgamer.importer";
import {TheGuardianImporter} from "./theguardian.importer";

export interface INewsDataTranslated extends INewsData {
    textTranslated: string[];
}

export interface INewsData extends INewsTitleData {
    textByParagraphs: string[];
    images?: string[];
}

export interface INewsTitleData {
    title: string;
    url: string;
    date: string;
    titleImage: string;
}

export interface INewsImporterFactory {
    importNewsFromAllSources(): Promise<INewsData[]>;
}

export interface INewsImporter {
    importLatestNews(): Promise<INewsData[]>;
    fetchTitleData(): Promise<INewsTitleData[]>;
    fetchContentData(titleData: INewsTitleData[]): Promise<INewsData[]>
}

export class NewsImporterFactory implements INewsImporterFactory {
    async importNewsFromAllSources(): Promise<INewsData[]> {
        const pcGamerImporter = new PCGamerImporter();
        const pcGamerNews = await pcGamerImporter.importLatestNews();

        const theGuardianImporter = new TheGuardianImporter();
        const theGuardianNews = await theGuardianImporter.importLatestNews();

        return pcGamerNews.concat(theGuardianNews);
    }
}