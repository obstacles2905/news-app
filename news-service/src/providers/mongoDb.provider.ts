import dotenv from 'dotenv';
dotenv.config({path: "../.env"});

export interface IMongoDbProvider {
    connect(): Promise<any>;
}

export class MongoDbProvider implements IMongoDbProvider{
    private readonly host: string;
    private readonly port: string;
    private readonly collection: string;
    private readonly user: string;
    private readonly password: string;

    constructor() {
        this.host = process.env.MONGODB_HOST!;
        this.port = process.env.MONGODB_PORT!;
        this.collection = process.env.MONGODB_DATABASE!;
        this.user = process.env.MONGODB_USER!;
        this.password = process.env.MONGODB_PASSWORD!;
    }

    async connect() {

    }
}