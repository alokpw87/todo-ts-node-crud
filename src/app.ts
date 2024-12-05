import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import router from './route/routes';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/v1/api',router);

connectDB();
connectRedis();

export default app;