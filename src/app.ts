import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import icdRoutes from './routes/icdRoutes';

dotenv.config();

const app = express();

app.get('/', (req, res) => res.send('Express on Vercel'));

app.use(
  cors({
    origin: 'https://icd-frontend.vercel.app',
  })
);
app.use(express.json());
app.use('/api/icd', icdRoutes);

export default app;
