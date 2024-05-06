import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import icdRoutes from './routes/icdRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/icd', icdRoutes);

export default app;
