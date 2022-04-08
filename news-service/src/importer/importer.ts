import {PCGamerImporter} from "./pcgamer.importer";
import {TheGuardianImporter} from "./theguardian.importer";
import {INewsData, INewsImporterFactory} from "./contracts";

export class NewsImporterFactory implements INewsImporterFactory {
    async importNewsFromAllSources(): Promise<INewsData[]> {
        const pcGamerImporter = new PCGamerImporter();
        const pcGamerNews = await pcGamerImporter.importLatestNews();

        const theGuardianImporter = new TheGuardianImporter();
        const theGuardianNews = await theGuardianImporter.importLatestNews();

        return pcGamerNews.concat(theGuardianNews);
    }
}