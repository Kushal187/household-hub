import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import choresRouter from "./routes/chores.js";
import expensesRouter from "./routes/expenses.js";
import peopleRouter from "./routes/people.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

// api routes
app.use("/api/chores", choresRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/people", peopleRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
