import { ObjectId } from "mongodb";
import connectDB from "./connectDB.js";

async function getCollection() {
  const db = await connectDB();
  return db.collection("expenses");
}

export async function getAllExpenses(query = {}) {
  const collection = await getCollection();

  const filter = {};
  if (query.category) {
    filter.category = query.category;
  }
  if (query.paidBy) {
    filter.paidBy = query.paidBy;
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [expenses, total] = await Promise.all([
    collection
      .find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  return { expenses, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getExpenseById(id) {
  const collection = await getCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function createExpense(expenseData) {
  const collection = await getCollection();
  const expense = {
    description: expenseData.description,
    amount: parseFloat(expenseData.amount),
    paidBy: expenseData.paidBy,
    splitBetween: expenseData.splitBetween || [],
    category: expenseData.category || "other",
    settled: false,
    date: expenseData.date || new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };
  const result = await collection.insertOne(expense);
  return { ...expense, _id: result.insertedId };
}

export async function updateExpense(id, updates) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" },
  );
  return result;
}

export async function deleteExpense(id) {
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function getBalanceSummary() {
  const collection = await getCollection();
  const expenses = await collection.find({ settled: false }).toArray();

  const balances = {};
  for (const expense of expenses) {
    const share = expense.amount / expense.splitBetween.length;
    for (const person of expense.splitBetween) {
      if (!balances[person]) balances[person] = 0;
      if (person === expense.paidBy) {
        balances[person] += expense.amount - share;
      } else {
        balances[person] -= share;
      }
    }
  }

  return balances;
}
