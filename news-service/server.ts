import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import cookieParser = require("cookie-parser");
import dotenv from 'dotenv';
import {logger} from "./logger";
import {Scheduler} from "./src/scheduler/scheduler";
import {MongoDbProvider} from "./src/providers/mongoDb.provider";

dotenv.config({path: '../.env'});

const port = process.env.APPLICATION_PORT;

export const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {logger.info(`Server is running on ${port}`)});

    const dbProvider = new MongoDbProvider();
    dbProvider.connect();
    const scheduler = new Scheduler(dbProvider);
    scheduler.start();
}