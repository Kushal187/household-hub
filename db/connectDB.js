import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db = null;

async function connectDB() {
  if (!db) {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("household-hub");
  }
  return db;
}

export default connectDB;
