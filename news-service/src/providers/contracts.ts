import {INewsDataTranslated} from "../importer/contracts";

export interface IMongoDbProvider {
    connect(): Promise<void>;
    uploadNews(newsData: INewsDataTranslated[]): Promise<void>
}
