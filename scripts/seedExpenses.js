import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

const descriptions = [
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
const people = ["Harsh", "Kushal"];

function randomDate(start, end) {
  const d = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return d.toISOString().split("T")[0];
}

function generateExpenses(count) {
  const expenses = [];
  const startDate = new Date("2025-09-01");
  const endDate = new Date("2026-02-15");

  for (let i = 0; i < count; i++) {
    const descIndex = i % descriptions.length;
    const paidBy = people[Math.floor(Math.random() * people.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = randomDate(startDate, endDate);

    let amount;
    if (category === "rent") {
      amount = parseFloat((800 + Math.random() * 700).toFixed(2));
    } else if (category === "utilities") {
      amount = parseFloat((30 + Math.random() * 120).toFixed(2));
    } else if (category === "groceries") {
      amount = parseFloat((15 + Math.random() * 150).toFixed(2));
    } else if (category === "food") {
      amount = parseFloat((8 + Math.random() * 60).toFixed(2));
    } else {
      amount = parseFloat((5 + Math.random() * 80).toFixed(2));
    }

    const splitBoth = Math.random() > 0.15;
    const splitBetween = splitBoth ? ["Harsh", "Kushal"] : [paidBy];

    const expense = {
      description: descriptions[descIndex],
      amount,
      paidBy,
      splitBetween,
      category,
      settled: Math.random() > 0.6,
      date,
      createdAt: new Date(date).toISOString(),
    };

    expenses.push(expense);
  }

  return expenses;
}

async function seed() {
  try {
    await client.connect();
    const db = client.db("household-hub");
    const collection = db.collection("expenses");

    await collection.deleteMany({});
    console.log("Cleared existing expenses");

    const expenses = generateExpenses(1000);
    await collection.insertMany(expenses);
    console.log(`Seeded ${expenses.length} expense records`);
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();
