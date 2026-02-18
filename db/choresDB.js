import { ObjectId } from "mongodb";
import connectDB from "./connectDB.js";

async function getCollection() {
  const db = await connectDB();
  return db.collection("chores");
}

export async function getAllChores(query = {}) {
  const collection = await getCollection();

  const filter = {};
  if (query.status) {
    filter.status = query.status;
  }

  const sort = query.sortBy === "deadline" ? { deadline: 1 } : { createdAt: -1 };
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [chores, total] = await Promise.all([
    collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
    collection.countDocuments(filter),
  ]);

  return { chores, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getChoreById(id) {
  const collection = await getCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function createChore(choreData) {
  const collection = await getCollection();
  const chore = {
    title: choreData.title,
    description: choreData.description || "",
    assignedTo: choreData.assignedTo || "",
    createdBy: choreData.createdBy,
    status: "pending",
    deadline: choreData.deadline || null,
    createdAt: new Date().toISOString(),
  };
  const result = await collection.insertOne(chore);
  return { ...chore, _id: result.insertedId };
}

export async function updateChore(id, updates) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" },
  );
  return result;
}

export async function deleteChore(id) {
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
