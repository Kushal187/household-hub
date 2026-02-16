import 'dotenv/config';
import { MongoClient } from 'mongodb';

const DB_NAME = 'householdHub';
const CHORE_COUNT = 1200;
const EXPENSE_COUNT = 1200;

const roommates = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];

const choreTitles = [
  'Wash dishes',
  'Vacuum living room',
  'Mop kitchen floor',
  'Clean bathroom',
  'Take out trash',
  'Do laundry',
  'Wipe counters',
  'Organize pantry',
  'Scrub bathtub',
  'Clean windows',
  'Dust furniture',
  'Water plants',
  'Sweep porch',
  'Clean fridge',
  'Mow lawn',
  'Rake leaves',
  'Clean oven',
  'Tidy bedrooms',
  'Empty dishwasher',
  'Wipe mirrors',
  'Disinfect doorknobs',
  'Organize closet',
  'Clean microwave',
  'Wash towels',
  'Vacuum stairs',
  'Scrub sink',
  'Clean garage',
  'Sort recycling',
  'Wash car',
  'Sweep driveway',
];

const expenseDescriptions = [
  'Groceries',
  'Electric bill',
  'Water bill',
  'Internet bill',
  'Cleaning supplies',
  'Toilet paper',
  'Paper towels',
  'Dish soap',
  'Takeout dinner',
  'Pizza night',
  'Streaming subscription',
  'Gas bill',
  'Laundry detergent',
  'Light bulbs',
  'Trash bags',
  'Sponges',
  'Hand soap',
  'Shampoo',
  'Air freshener',
  'Coffee filters',
  'Snacks',
  'Beverages',
  'Pet food',
  'Rent deposit',
  'Parking fee',
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomSubset = (arr) => {
  const count = randomInt(1, arr.length);
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const statuses = ['open', 'claimed', 'done'];

const buildChores = () => {
  const chores = [];
  for (let i = 0; i < CHORE_COUNT; i++) {
    const status = statuses[i % 3];
    const daysOffset = randomInt(-30, 60);
    const deadline = new Date(Date.now() + daysOffset * 86400000).toISOString();
    const createdAt = new Date(Date.now() - randomInt(0, 90) * 86400000).toISOString();
    chores.push({
      title: choreTitles[i % choreTitles.length],
      deadline,
      assignedTo: status === 'open' ? null : pick(roommates),
      status,
      createdAt,
    });
  }
  return chores;
};

const buildExpenses = () => {
  const expenses = [];
  for (let i = 0; i < EXPENSE_COUNT; i++) {
    const paidBy = pick(roommates);
    const amount = parseFloat((Math.random() * 200 + 5).toFixed(2));
    const createdAt = new Date(Date.now() - randomInt(0, 90) * 86400000).toISOString();
    expenses.push({
      description: expenseDescriptions[i % expenseDescriptions.length],
      amount,
      paidBy,
      splitBetween: randomSubset(roommates),
      isSettled: Math.random() < 0.3,
      createdAt,
    });
  }
  return expenses;
};

const seed = async () => {
  const reset = process.argv.includes('--reset');
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    if (reset) {
      console.log('Resetting collections...');
      await db.collection('chores').deleteMany({});
      await db.collection('expenses').deleteMany({});
      console.log('Collections cleared.');
    }

    const chores = buildChores();
    const expenses = buildExpenses();

    await db.collection('chores').insertMany(chores);
    console.log(`Inserted ${chores.length} chores.`);

    await db.collection('expenses').insertMany(expenses);
    console.log(`Inserted ${expenses.length} expenses.`);

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
};

seed();
