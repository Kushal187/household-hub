import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

const expenseDescriptions = [
  "Groceries from Trader Joe's",
  "Costco bulk run",
  "Weekly produce haul",
  "Electricity bill",
  "Water bill",
  "Internet bill",
  "February rent",
  "March rent",
  "Pizza delivery",
  "Thai takeout",
  "Sushi dinner",
  "Coffee beans",
  "Cleaning supplies",
  "Toilet paper + paper towels",
  "Laundry detergent",
  "Light bulbs",
  "Kitchen sponges",
  "Trash bags",
  "Dish soap",
  "Gas bill",
  "Streaming subscription",
  "Uber Eats order",
  "DoorDash delivery",
  "Frozen meals restock",
  "Snacks and drinks",
];

const categories = ["groceries", "utilities", "rent", "food", "other"];
const people = ["Harsh", "Kushal", "Alice", "Bob", "Charlie"];

function randomDate(start, end) {
  const d = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return d.toISOString().split("T")[0];
}

// generate a reasonable amount based on what category it is
function amountForCategory(cat) {
  switch (cat) {
    case "rent":
      return 800 + Math.random() * 700;
    case "utilities":
      return 30 + Math.random() * 120;
    case "groceries":
      return 15 + Math.random() * 150;
    case "food":
      return 8 + Math.random() * 60;
    default:
      return 5 + Math.random() * 80;
  }
}

function generateExpenses(count) {
  const expenses = [];
  const startDate = new Date("2025-09-01");
  const endDate = new Date("2026-02-15");

  for (let i = 0; i < count; i++) {
    const descIdx = i % expenseDescriptions.length;
    const paidBy = people[Math.floor(Math.random() * people.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = randomDate(startDate, endDate);
    const amount = parseFloat(amountForCategory(category).toFixed(2));

    // most expenses get split between everyone
    const splitAll = Math.random() > 0.15;
    const splitBetween = splitAll ? [...people] : [paidBy];

    expenses.push({
      description: expenseDescriptions[descIdx],
      amount,
      paidBy,
      splitBetween,
      category,
      settled: Math.random() > 0.6,
      date,
      createdAt: new Date(date).toISOString(),
    });
  }

  return expenses;
}

async function seed() {
  try {
    await client.connect();
    const db = client.db("household-hub");
    const collection = db.collection("expenses");

    await collection.deleteMany({});
    console.log("Cleared expenses collection");

    const expenses = generateExpenses(1000);
    await collection.insertMany(expenses);
    console.log(`Inserted ${expenses.length} expenses`);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await client.close();
  }
}

seed();
