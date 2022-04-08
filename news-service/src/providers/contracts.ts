import {INewsDataTranslated, INewsTitleData} from "../importer/contracts";

export interface IMongoDbProvider {
    connect(): Promise<void>;
    uploadNews(newsData: INewsDataTranslated[]): Promise<void>;
    findNotProcessedNews(newsData: INewsTitleData[]): Promise<INewsTitleData[]>;
}
