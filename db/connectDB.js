import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectDB() {
  await client.connect();
  console.log("Connected to MongoDB");
  return client.db("household-hub");
}

export default connectDB;
