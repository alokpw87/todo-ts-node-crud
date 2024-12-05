import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!)
    }
}) 

redisClient.on('error',(err)=> console.log('Redis client error', err));

export const connectRedis = async ()=>{
    await redisClient.connect();
    console.log('Redis connected');
}

export default redisClient;