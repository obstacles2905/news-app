export interface INewsDataTranslated extends INewsData {
    textTranslated: string[];
}

export enum INewsSources {
    PCGamer = 'PCGamer',
    TheGuardian = 'TheGuardian'
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
    source: INewsSources
}

export interface INewsImporterFactory {
    importNewsFromAllSources(): Promise<INewsData[]>;
}

export interface INewsImporter {
    importLatestNews(): Promise<INewsData[]>;
    fetchTitleData(): Promise<INewsTitleData[]>;
    fetchContentData(titleData: INewsTitleData[]): Promise<INewsData[]>
}