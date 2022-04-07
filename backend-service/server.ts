import express, {Request, Response, NextFunction} from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import cookieParser = require("cookie-parser");
import {logger} from "./logger";
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.APPLICATION_PORT;

export const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get('/version', (req: Request, res: Response, next: NextFunction) => {
   res.json('v1.0');
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {logger.info(`Server is running on ${port}`)});
}