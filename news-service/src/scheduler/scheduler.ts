import {CronJob} from "cron";
import {logger} from "../../logger";
import {NewsImporterFactory} from "../importer/importer";
import {Translator} from "../translator/translator";

export interface IScheduler {
  start(): void;
  terminate(): Promise<void>;
}

let onTickRunning = false;
export class Scheduler implements IScheduler {
  private cronJob: CronJob;

  constructor() {
    const onTick = (): void => {
      if (!onTickRunning) {
        onTickRunning = true;
        this.schedule()
          .then(() => {
            logger.info(`done`);
            onTickRunning = false;
          })
          .catch((error: any) => {
            logger.exception(error);
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
  }

    private async schedule() {
        const importer = new NewsImporterFactory();
        const news = await importer.importNewsFromAllSources();

        const translator = new Translator({});
        const translatedNews = translator.translate(news);

        console.log("////////////", translatedNews);
        //TODO
        // 1. добавить компонент Translator (deepl api)
        // 2. сохранять данные в Монгу (хранить оригинальный текст, перевод на ру и укр)
    }

  public start() {
    this.cronJob.start();
  }

  public async terminate(): Promise<void> {
    logger.info('Cron stopped');
    this.cronJob.stop();
  }
}