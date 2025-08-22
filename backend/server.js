import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.js';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
