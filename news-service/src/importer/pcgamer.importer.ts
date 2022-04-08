import {INewsTitleData, INewsImporter, INewsData} from "./importer";
import axios from "axios";
import cheerio from "cheerio";

export class PCGamerImporter implements INewsImporter {
    private readonly link: string;

    constructor() {
        this.link = 'https://www.pcgamer.com/uk/news/';
    }

    async importLatestNews(): Promise<INewsData[]> {
        const newsTitleData = await this.fetchTitleData();
        return this.fetchContentData(newsTitleData);
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
                        titleImage: $(element).find('img').attr('data-original-mos')!
                    })
                )
                    .get()
                    .slice(1)
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