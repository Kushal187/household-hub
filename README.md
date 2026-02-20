# HouseholdHub

A web app for roommates to manage household chores and split shared expenses without the awkward conversations.

## Authors

- **Harsh Raj** — Expense Tracking & Balance Management
- **Sanjeev Kushal Pendekanti** — Chore Management & Household Task Board

## Class Link

<!-- TODO: add your course/Canvas link here -->
[CS XXXX — Web Development](https://example.com)

## Project Objective

HouseholdHub helps people living together coordinate two of the biggest sources of friction in shared housing: chores and money. Roommates can post, claim, and complete household tasks on a shared chore board, and separately log shared expenses like groceries, utilities, and takeout. The app calculates who owes what so settling up is straightforward.

Each feature works independently — you can use just the chore board or just the expense tracker depending on what your household needs.

## Screenshot

<!-- TODO: add a screenshot of the app here -->
![HouseholdHub Dashboard](screenshot.png)

## Tech Stack

- **Backend:** Node.js, Express 5
- **Database:** MongoDB (native driver, no Mongoose)
- **Frontend:** Vanilla HTML5, CSS, JavaScript (client-side rendering)
- **Tooling:** ESLint, Prettier, Nodemon

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/Kushal187/household-hub.git
   cd household-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root (see `.env.example`):
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/
   PORT=3000
   ```

4. Seed the database with sample data (1000+ records per collection):
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server |
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm run seed` | Seed all collections with sample data |
| `npm run seed:chores` | Seed only chores |
| `npm run seed:expenses` | Seed only expenses |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Project Structure

```
household-hub/
├── index.js              # Express server entry point
├── db/
│   ├── connectDB.js      # MongoDB connection (shared)
│   ├── choresDB.js       # CRUD for chores collection
│   ├── expensesDB.js     # CRUD for expenses collection
│   └── peopleDB.js       # CRUD for people collection
├── routes/
│   ├── chores.js         # /api/chores endpoints
│   ├── expenses.js       # /api/expenses endpoints
│   └── people.js         # /api/people endpoints
├── frontend/
│   ├── index.html        # Landing page
│   ├── dashboard.html    # Dashboard with summary
│   ├── chores.html       # Chore board
│   ├── expenses.html     # Expense tracker
│   ├── people.html       # Household members
│   ├── js/               # Client-side JS (one per page)
│   └── css/              # Modular CSS (one per component)
└── scripts/              # Database seed scripts
```

## AI Disclosure

We used Claude (Anthropic) in a limited capacity during development:

- **Seed data generation** — helped write the seed scripts that produce 1000+ sample records for chores and expenses, since writing that much fake data by hand wasn't practical.
- **CSS layout debugging** — used it a couple times to troubleshoot flexbox/grid issues on the expense table and balance cards.
- **Express route order** — asked about why the `/balances` endpoint needed to come before `/:id` to avoid route conflicts.

All application logic, database queries, frontend rendering, and project architecture were written by us. We referenced the [MongoDB Node.js driver docs](https://www.mongodb.com/docs/drivers/node/current/) and [Express 5 docs](https://expressjs.com/) throughout.

## License

[MIT](https://opensource.org/licenses/MIT)
