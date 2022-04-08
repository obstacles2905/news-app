import {CronJob} from "cron";
import {logger} from "../../logger";
import {NewsImporterFactory} from "../importer/importer";
import {MongoDbProvider} from "../providers/mongoDb.provider";
import {NLPApiProvider} from "../providers/nlpApi.provider";
import {INewsDataTranslated, INewsSources} from "../importer/contracts";

export interface IScheduler {
  start(): void;
  terminate(): Promise<void>;
}

let onTickRunning = false;
export class Scheduler implements IScheduler {
    private cronJob: CronJob;
    private dbProvider: MongoDbProvider;

    constructor(dbProvider: MongoDbProvider) {
        const onTick = (): void => {
            if (!onTickRunning) {
                onTickRunning = true;
                this.schedule()
                    .then(() => {
                        logger.info(`done`);
                        onTickRunning = false;
                    })
      }
    };
        const onComplete = undefined;
        const start = false;
        const timezone = '';
        const runOnInit = false;
        const schedulerCronExpression = process.env.CRON_EXPRESSION!;
        this.cronJob = new CronJob(schedulerCronExpression, onTick, onComplete, start, timezone, this, runOnInit);
        this.dbProvider = dbProvider;
    }

    private async schedule() {
        const importer = new NewsImporterFactory();
        const news = await importer.importNewsFromAllSources();

        const translator = new NLPApiProvider();

        const translatedNews: INewsDataTranslated[] = [];
        for (const n of news) {
            const translation = await translator.translate(n);
            translatedNews.push(translation);
        }

        await this.dbProvider.uploadNews(translatedNews);
    }

    public start() {
        this.cronJob.start();
    }

    public async terminate(): Promise<void> {
        logger.info('Cron stopped');
        this.cronJob.stop();
    }
}

export const newsMock = {
    title: 'Ms. Pac-Man is being written-out of Pac-Man history',
    url: 'https://www.pcgamer.com/uk/ms-pac-man-is-being-written-out-of-pac-man-history/',
    date: '2022-04-08T14:15:51Z',
    titleImage: 'https://cdn.mos.cms.futurecdn.net/Ez7XdF8Bo78ko4EmN7eYvm.jpg',
    source: INewsSources.PCGamer,
    textByParagraphs: ['paragraph 1 car and apple', 'paragraph 2 boy and girl', `paragraph 3 what's with Andy?`]
};