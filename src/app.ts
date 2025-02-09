// file location: src/app.ts

import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import imageToTextRoutes from "./routes/imageToText.js";

import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

const PORT: number = Number(process.env.PORT) || 3210;
const URL: string = process.env.BACKEND_URL || `http://localhost:${PORT}`;


app.use(cors({
  origin: ['https://your-url-with-domain.com', '*'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use('/api', imageToTextRoutes);
app.get('/', (req, res) => {
  res.send('welcome to base app');
});

const uri = process.env.MONGODB_URI || `mongodb://localhost:27017/ProjectInit`;

const startServer = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Database connected successfully');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on ${URL}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();

export default app;