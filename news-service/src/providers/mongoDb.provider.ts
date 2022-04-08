import dotenv from 'dotenv';
import {Schema, model, connect} from 'mongoose';
import {logger} from "../../logger";
import {INewsDataTranslated, INewsTitleData} from "../importer/contracts";
import {IMongoDbProvider} from "./contracts";

dotenv.config({path: "../.env"});

const newsSchema = new Schema<INewsDataTranslated>({
    title: {type: String, required: true, index: true},
    titleTranslated: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: String, required: true},
    titleImage: {type: String, required: true},
    textByParagraphs: {type: [String], required: true},
    textTranslated: {type: [String], required: true},
    images: {type: [String]},
    source: {type: String, required: true}
}, {timestamps: true});

const NewsModel = model<INewsDataTranslated>('News', newsSchema);

export class MongoDbProvider implements IMongoDbProvider{
    private readonly host: string;
    private readonly port: string;
    private readonly db: string;
    private readonly user: string;
    private readonly password: string;
    private readonly authSourceDb: string;

    constructor() {
        this.host = process.env.MONGODB_HOST!;
        this.port = process.env.MONGODB_PORT!;
        this.db = process.env.MONGODB_DATABASE!;
        this.user = process.env.MONGODB_USER!;
        this.password = process.env.MONGODB_PASSWORD!;
        this.authSourceDb = 'admin';
    }

    async connect() {
        try {
            await connect(`mongodb://${this.host}/${this.port}`,{
                dbName: this.db,
                user: this.user,
                pass: this.password,
                authSource: 'admin'
            });
        } catch(err) {
            logger.error(`Mongo connection wasn't established ${err}`);
            throw err;
        }
    }

    async uploadNews(newsData: INewsDataTranslated[]) {
        try {
            await NewsModel.insertMany(newsData)
                .then(() => {
                    logger.info(`Successfully added ${newsData.length} records`);
                })
        } catch(err) {
            logger.error(`Failed to upload news data ${err}`);
            throw err;
        }
    }

    async findNotProcessedNews(newsData: INewsTitleData[]): Promise<INewsTitleData[]> {
        const newsTitles = newsData.map(news => news.title);

        const result = await NewsModel.find({
            title: { $in: newsTitles}
        }, 'title');
        const newsPresentInDb = result.map(news => news.title);

        const notExistingNewsTitles = newsTitles.filter(news => !newsPresentInDb.includes(news));
        return newsData.filter(news => notExistingNewsTitles.includes(news.title));
    }
}