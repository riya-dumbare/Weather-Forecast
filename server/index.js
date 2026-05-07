import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import './config/redis.js';
import './config/db.js';

import authRoutes from './routes/auth.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import locationRoutes from './routes/location.routes.js';
import alertRoutes from './routes/alert.routes.js';
import { startCronJob } from './services/cron.service.js';
const app = express();
const PORT = process.env.PORT||5000

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/', (req, res) => {
    res.json({Message : 'Weather Forecast API is running!'});
});

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
    startCronJob();
})