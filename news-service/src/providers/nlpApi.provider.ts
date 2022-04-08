import axios, {Method} from 'axios';
import dotenv from 'dotenv';
import {INewsData, INewsDataTranslated} from "../importer/contracts";
import {logger} from "../../logger";

dotenv.config({path: '../../.env'});

export interface INLPApiProvider {
    translate(data: any): Promise<any>;
}

export interface INLPApiResponse {
    status: number;
    from: string;
    to: string;
    original_text: string;
    translated_text: {
        uk: string;
    };
}

export interface ITranslateOutputDTO {
    titleTranslated: string;
    textTranslated: string[];
}

export class NLPApiProvider implements INLPApiProvider {
    private readonly url: string | undefined;
    private readonly token: string | undefined;
    private readonly hostHeader: string;

    private readonly symbolsLimit: number;
    private readonly paragraphsDelimiter: string;

    constructor() {
        this.url = process.env.NLP_API_URL;
        this.token = process.env.NLP_API_TOKEN;
        this.hostHeader = 'nlp-translation.p.rapidapi.com';

        this.symbolsLimit = 900;
        this.paragraphsDelimiter = '~';

        if (!this.url) {
            throw new Error('A NLP url is not provided in the .env file');
        }

        if (!this.token) {
            throw new Error('A NLP token is not provided in the .env file');
        }
    }

    async translate(data: INewsData): Promise<INewsDataTranslated> {
        const textParsed = data.textByParagraphs
            .join(this.paragraphsDelimiter)
            .slice(0, this.symbolsLimit);

        const options = {
            method: <Method>'GET',
            url: this.url!,
            headers: {
                'X-RapidAPI-Host': this.hostHeader!,
                'X-RapidAPI-Key': this.token!
            },
            params: {
                text: `${data.title} ${this.paragraphsDelimiter} ${textParsed}`,
                from: 'en',
                to: 'uk'
            }
        };

        let response;
        try {
            response = await axios.request(options);
        } catch(err) {
            logger.warning('NLP Api error: ', err);
            throw err;
        }
        const translatedData = this.mapDataToOutputDTO(response.data);

        return Object.assign(data, translatedData);
    }

    mapDataToOutputDTO(data: INLPApiResponse): ITranslateOutputDTO {
        return {
            titleTranslated: data.translated_text.uk.split(this.paragraphsDelimiter).shift()!,
            textTranslated: data.translated_text.uk.split(this.paragraphsDelimiter).slice(1),
        }
    }
}