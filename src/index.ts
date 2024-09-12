import express from 'express';
import 'dotenv/config';
import './db';
import path from 'path';
import authRouter from './routes/auth';
import courseRouter from './routes/course';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from "public" directory

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Ensure this is the correct path to your HTML file
});

app.use('/auth', authRouter);
app.use('/course', courseRouter);

app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
