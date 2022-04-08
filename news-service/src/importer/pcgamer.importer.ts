import axios from "axios";
import cheerio from "cheerio";
import {INewsData, INewsImporter, INewsSources, INewsTitleData} from "./contracts";
import {IMongoDbProvider} from "../providers/contracts";

export class PCGamerImporter implements INewsImporter {
    private readonly link: string;
    private readonly dbProvider: IMongoDbProvider;

    constructor(dbProvider: IMongoDbProvider) {
        this.link = 'https://www.pcgamer.com/uk/news/';
        this.dbProvider = dbProvider;
    }

    async importLatestNews(): Promise<INewsData[]> {
        const newsTitleData = (await this.fetchTitleData()).slice(0, 3);
        const notProcessedNews = await this.dbProvider.findNotProcessedNews(newsTitleData);

        return this.fetchContentData(notProcessedNews);
    }

    async fetchTitleData(): Promise<INewsTitleData[]> {
        return axios.get(this.link)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);

                return $("div.listingResult.small").map((index, element) =>
                    ({
                        title: $(element).find('.article-name').text(),
                        url: $(element).find('a').attr('href')!,
                        date: $(element).find('time').attr('datetime')!,
                        titleImage: $(element).find('img').attr('data-original-mos')!,
                        source: INewsSources.PCGamer
                    })
                )
                    .get()
                    .slice(1) //first record is always undefined due to library specifications
            })
    }

    async fetchContentData(titleData: INewsTitleData[]): Promise<INewsData[]> {
        return Promise.all(titleData.map(async(news) => {
            const textByParagraphs = await axios.get(news.url)
                .then(response => {
                    const html = response.data;
                    const $ = cheerio.load(html);

                    return $("div#article-body > p")
                        .map((index, element) => $(element).text())
                        .get();
                });

            return Object.assign(news, {textByParagraphs})
        }));

    }
}