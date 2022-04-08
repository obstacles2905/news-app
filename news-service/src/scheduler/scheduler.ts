import {CronJob} from "cron";
import {logger} from "../../logger";
import {NewsImporterFactory} from "../importer/importer";
import {Translator} from "../translator/translator";
import {MongoDbProvider} from "../providers/mongoDb.provider";

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
                    .catch((error: any) => {
                        logger.error(error);
                        onTickRunning = false;
                    });
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

        const translator = new Translator({});
        const translatedNews = translator.translate(news);

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