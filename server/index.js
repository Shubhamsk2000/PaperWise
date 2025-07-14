const express = require('express');
const app = express();
const cors = require('cors');
const multer  = require('multer');
import { Queue } from 'bullmq';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '_' + file.originalname)
  }
})

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/upload/pdf', upload.single('pdf'), (req, res) => {
    return res.status(200).json({
        message: 'PDF file uploaded successfully',
    });
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});