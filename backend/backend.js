import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import choresRoutes from './routes/chores.routes.js';
import expensesRoutes from './routes/expenses.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/chores', choresRoutes);
app.use('/api/expenses', expensesRoutes);

export default app;
