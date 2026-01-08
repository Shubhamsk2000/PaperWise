import express from 'express';
import cors from 'cors';
import routesFile from './routes/uploads.route.js';
import authRoutes from './routes/auth.route.js';
import workspaceRoutes from './routes/workspaces.route.js';
import pdfRoutes from './routes/pdf.route.js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import connectDb from './infra/db/mongodb.js';
// import "./worker.js";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// user signup login routes
app.use('/auth', authRoutes);

app.use('/api', routesFile);
app.use('/workspaces', workspaceRoutes);
app.use('/workspace/:workspaceId/pdfs', pdfRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Server Working!');
});

connectDb();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});