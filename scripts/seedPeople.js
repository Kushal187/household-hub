import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

const names = ["Harsh", "Kushal", "Alice", "Bob", "Charlie"];

async function seed() {
  try {
    await client.connect();
    const db = client.db("household-hub");
    const col = db.collection("people");

    const existing = await col.countDocuments();
    if (existing > 0) {
      console.log("People already seeded, skipping.");
      return;
    }

    const docs = names.map((name) => ({
      name,
      createdAt: new Date().toISOString(),
    }));

    await col.insertMany(docs);
    console.log("Seeded people:", names.join(", "));
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();
