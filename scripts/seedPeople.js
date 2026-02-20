import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

const defaultPeople = [
  { name: "Harsh", createdAt: new Date().toISOString() },
  { name: "Kushal", createdAt: new Date().toISOString() },
  { name: "Alice", createdAt: new Date().toISOString() },
  { name: "Bob", createdAt: new Date().toISOString() },
  { name: "Charlie", createdAt: new Date().toISOString() },
];

async function seed() {
  try {
    await client.connect();
    const db = client.db("household-hub");
    const collection = db.collection("people");

    const count = await collection.countDocuments();
    if (count > 0) {
      console.log("People collection already has data. Skipping seed.");
      return;
    }

    await collection.insertMany(defaultPeople);
    console.log(
      `Seeded ${defaultPeople.length} people: ${defaultPeople.map((p) => p.name).join(", ")}`,
    );
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();
