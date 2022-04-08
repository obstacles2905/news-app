import dotenv from 'dotenv';
import {Schema, model, connect} from 'mongoose';
import {logger} from "../../logger";
import {INewsDataTranslated} from "../importer/contracts";

dotenv.config({path: "../.env"});

export interface IMongoDbProvider {
    connect(): Promise<void>;
    uploadNews(newsData: INewsDataTranslated[]): Promise<void>
}

const newsSchema = new Schema<INewsDataTranslated>({
    title: {type: String, required: true, index: true},
    url: {type: String, required: true},
    date: {type: String, required: true},
    titleImage: {type: String, required: true},
    textByParagraphs: {type: [String], required: true},
    textTranslated: {type: [String], required: true},
    images: {type: [String]},
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
            for (const news of newsData) {
                const model = new NewsModel(news);
                await model.save();
            }
            logger.info(`Successfully added ${newsData.length} records`);
        } catch(err) {
            logger.error(`Failed to upload news data ${err}`);
            throw err;
        }
    }
}