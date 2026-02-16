# HouseholdHub

**Authors:** Sanjeev Kushal Pendekanti and Harsh Raj

**Class Link:** YOUR_CLASS_LINK_HERE

## Objective

HouseholdHub is a web app that helps roommates manage household chores and shared expenses. Keep track of who does what, split costs fairly, and see outstanding balances at a glance.

## Features

- **Chores Management** — Create, claim, complete, and delete household chores
- **Status Filtering** — Filter chores by open, claimed, or done
- **Expense Tracking** — Log shared expenses with flexible cost splitting
- **Settle/Unsettle** — Toggle expenses as settled when debts are paid
- **Balance Summary** — See who owes whom based on unsettled expenses
- **Seeded Data** — Seed script populates 1200+ chores and 1200+ expenses for demo purposes

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```
   MONGODB_URI=mongodb://localhost:27017/householdHub
   PORT=3000
   ```

3. (Optional) Seed the database:

   ```bash
   npm run seed
   ```

   To clear existing data and reseed:

   ```bash
   npm run seed:reset
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Chores Page (`/chores.html`)

- Fill in a title and deadline, then click **Add Chore**.
- Use the dropdown to filter chores by status.
- Click **Claim** on an open chore to assign it to yourself.
- Click **Done** on a claimed chore to mark it complete.
- Click **Delete** to remove a chore.

### Expenses Page (`/expenses.html`)

- Enter a description, amount, who paid, and a comma-separated list of names to split between.
- Click **Add Expense** to log it.
- Click **Settle** / **Unsettle** to toggle an expense's status.
- Click **Delete** to remove an expense.
- The **Balance Summary** panel shows each person's net balance from unsettled expenses.

## API Endpoints

| Method | Endpoint            | Description                           |
| ------ | ------------------- | ------------------------------------- |
| GET    | `/api/chores`       | List all chores (optional `?status=`) |
| POST   | `/api/chores`       | Create a new chore                    |
| PUT    | `/api/chores/:id`   | Update a chore                        |
| DELETE | `/api/chores/:id`   | Delete a chore                        |
| GET    | `/api/expenses`     | List all expenses                     |
| POST   | `/api/expenses`     | Create a new expense                  |
| PUT    | `/api/expenses/:id` | Update an expense                     |
| DELETE | `/api/expenses/:id` | Delete an expense                     |

## Deployment

Set the following environment variables on your hosting platform:

- `PORT` — The port number (defaults to 3000)
- `MONGODB_URI` — Your MongoDB connection string

Then run:

```bash
npm start
```

## Screenshot

![App Screenshot](./docs/screenshot.png)

> **Note:** Add a screenshot to `docs/screenshot.png` after running the app.

## License

MIT
