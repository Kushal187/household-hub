import { ObjectId } from "mongodb";
import connectDB from "./connectDB.js";

async function getCollection() {
  const db = await connectDB();
  return db.collection("people");
}

export async function getAllPeople() {
  const collection = await getCollection();
  return collection.find({}).sort({ name: 1 }).toArray();
}

export async function getPersonById(id) {
  const collection = await getCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function createPerson(personData) {
  const collection = await getCollection();
  const person = {
    name: personData.name?.trim() || "",
    createdAt: new Date().toISOString(),
  };
  const result = await collection.insertOne(person);
  return { ...person, _id: result.insertedId };
}

export async function updatePerson(id, updates) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" },
  );
  return result;
}

export async function deletePerson(id) {
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
