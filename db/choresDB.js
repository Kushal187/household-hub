import { ObjectId } from "mongodb";
import connectDB from "./connectDB.js";

async function getCollection() {
  const db = await connectDB();
  return db.collection("chores");
}

export async function getAllChores(query = {}) {
  const col = await getCollection();

  const filter = {};
  if (query.status) filter.status = query.status;

  // sort by deadline if requested, otherwise newest first
  let sort = { createdAt: -1 };
  if (query.sortBy === "deadline") sort = { deadline: 1 };

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const chores = await col
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
  const total = await col.countDocuments(filter);

  return { chores, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getChoreById(id) {
  const col = await getCollection();
  return col.findOne({ _id: new ObjectId(id) });
}

export async function createChore(data) {
  const col = await getCollection();
  const chore = {
    title: data.title,
    description: data.description || "",
    assignedTo: data.assignedTo || "",
    createdBy: data.createdBy,
    status: "pending",
    deadline: data.deadline || null,
    createdAt: new Date().toISOString(),
  };
  const result = await col.insertOne(chore);
  return { ...chore, _id: result.insertedId };
}

export async function updateChore(id, updates) {
  const col = await getCollection();
  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" },
  );
  return result;
}

export async function deleteChore(id) {
  const col = await getCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
