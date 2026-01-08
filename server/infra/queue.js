import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// 🔌 Redis connection using Upstash
export const connection = new IORedis(process.env.REDIS_URL,
    { maxRetriesPerRequest: null }
);

// 🛠️ BullMQ queue setup
export const uploadQueue = new Queue('file-upload-queue', { connection });