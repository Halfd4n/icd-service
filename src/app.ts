import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import icdRoutes from './routes/icdRoutes';

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins?.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS: Non-allowed origin'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('api/icd', (req, res, next) => {
  const authToken = req.headers.authorization?.split(' ')[1];
  if (!authToken) {
    return res.status(401).json({ error: 'Authentication required ' });
  }
  next();
});

app.use('/api/icd', icdRoutes);

export default app;
