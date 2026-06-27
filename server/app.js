import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import routes from './routes/Routes.js';

const app = express();

const allowedOrign = process.env.EXPRESS_FRONTEND_URL;
app.use(cors({origin: allowedOrign, credentials: true}));

app.use(express.json());
app.use('/', routes);

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});

export default app;