import { ObjectId } from "mongodb";
import connectDB from "./connectDB.js";

async function getCollection() {
  const db = await connectDB();
  return db.collection("people");
}

export async function getAllPeople() {
  const col = await getCollection();
  return col.find({}).sort({ name: 1 }).toArray();
}

export async function getPersonById(id) {
  const col = await getCollection();
  return col.findOne({ _id: new ObjectId(id) });
}

export async function createPerson(personData) {
  const col = await getCollection();
  const person = {
    name: personData.name?.trim() || "",
    createdAt: new Date().toISOString(),
  };
  const result = await col.insertOne(person);
  return { ...person, _id: result.insertedId };
}

export async function updatePerson(id, updates) {
  const col = await getCollection();
  return col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" },
  );
}

export async function deletePerson(id) {
  const col = await getCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
