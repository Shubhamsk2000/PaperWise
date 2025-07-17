
import './worker.js'; 

import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Worker is running...');
});

app.listen(3000, () => {
  console.log('📡 Dummy worker web service is running.');
});
