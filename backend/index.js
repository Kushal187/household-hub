import 'dotenv/config';
import app from './backend.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HouseholdHub running on http://localhost:${PORT}`);
});
