import { MongoClient, ObjectId } from 'mongodb';

const DB_NAME = 'householdHub';
let client = null;

const getDb = async () => {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
};

// --- Chores ---

export const getChores = async (filter = {}) => {
  const db = await getDb();
  return db.collection('chores').find(filter).sort({ createdAt: -1 }).toArray();
};

export const insertChore = async (data) => {
  const db = await getDb();
  const doc = {
    title: data.title,
    deadline: data.deadline,
    assignedTo: data.assignedTo || null,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  const result = await db.collection('chores').insertOne(doc);
  return { ...doc, _id: result.insertedId };
};

export const updateChore = async (id, updates) => {
  const db = await getDb();
  const result = await db
    .collection('chores')
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updates }, { returnDocument: 'after' });
  return result;
};

export const deleteChore = async (id) => {
  const db = await getDb();
  const result = await db.collection('chores').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
};

// --- Expenses ---

export const getExpenses = async () => {
  const db = await getDb();
  return db.collection('expenses').find({}).sort({ createdAt: -1 }).toArray();
};

export const insertExpense = async (data) => {
  const db = await getDb();
  const doc = {
    description: data.description,
    amount: data.amount,
    paidBy: data.paidBy,
    splitBetween: data.splitBetween,
    isSettled: false,
    createdAt: new Date().toISOString(),
  };
  const result = await db.collection('expenses').insertOne(doc);
  return { ...doc, _id: result.insertedId };
};

export const updateExpense = async (id, updates) => {
  const db = await getDb();
  const result = await db
    .collection('expenses')
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updates }, { returnDocument: 'after' });
  return result;
};

export const deleteExpense = async (id) => {
  const db = await getDb();
  const result = await db.collection('expenses').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
};
