import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT||5000

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({Message : 'Weather Forecast API is running!'});
});

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})