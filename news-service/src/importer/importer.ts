import {PCGamerImporter} from "./pcgamer.importer";
import {TheGuardianImporter} from "./theguardian.importer";
import {INewsData, INewsImporterFactory} from "./contracts";
import {IMongoDbProvider} from "../providers/contracts";

export class NewsImporterFactory implements INewsImporterFactory {
    private readonly dbProvider: IMongoDbProvider;

    constructor(dbProvider: IMongoDbProvider) {
        this.dbProvider = dbProvider;
    }

    async importNewsFromAllSources(): Promise<INewsData[]> {
        const pcGamerImporter = new PCGamerImporter(this.dbProvider);
        const pcGamerNews = await pcGamerImporter.importLatestNews();

        const theGuardianImporter = new TheGuardianImporter(this.dbProvider);
        const theGuardianNews = await theGuardianImporter.importLatestNews();

        return pcGamerNews;
    }
}