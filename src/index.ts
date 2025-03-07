import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`The server running on http://localhost:${PORT}`);
});
