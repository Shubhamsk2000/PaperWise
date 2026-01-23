import { Worker, Job } from 'bullmq';

import IORedis from 'ioredis';


const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

const worker = new Worker(
    'file-upload-queue',
    async job => {
        if (job.name !== 'ingest-pdf') return;



    },
    { connection }
);

