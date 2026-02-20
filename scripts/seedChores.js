import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

const choreTitles = [
  "Clean kitchen",
  "Vacuum living room",
  "Take out trash",
  "Do laundry",
  "Wash dishes",
  "Mop floors",
  "Clean bathroom",
  "Wipe counters",
  "Organize pantry",
  "Water plants",
  "Dust shelves",
  "Clean fridge",
  "Scrub toilet",
  "Change bed sheets",
  "Clean windows",
  "Sweep porch",
  "Declutter closet",
  "Clean oven",
  "Wipe mirrors",
  "Empty dishwasher",
  "Sort recycling",
  "Clean microwave",
  "Tidy living room",
  "Organize garage",
  "Clean stovetop",
];

const choreDescriptions = [
  "Wipe counters, do dishes, mop floor",
  "Use vacuum on all carpeted areas",
  "Take all bins to the curb",
  "Wash, dry, and fold clothes",
  "Load and run dishwasher",
  "Mop kitchen and bathroom floors",
  "Scrub shower, sink, and toilet",
  "Clean all kitchen countertops",
  "Sort items and check expiration dates",
  "Water all indoor and outdoor plants",
  "Dust all shelving units",
  "Remove expired items and wipe shelves",
  "Deep clean the toilet bowl and seat",
  "Replace sheets on all beds",
  "Clean interior and exterior windows",
  "Sweep leaves and debris from porch",
  "Remove unused items from closet",
  "Use oven cleaner and wipe down",
  "Clean all mirrors in the house",
  "Put away clean dishes from dishwasher",
  "Separate recyclables from trash",
  "Wipe interior of microwave",
  "Pick up items, fluff pillows",
  "Organize tools and storage",
  "Clean burners and stovetop surface",
];

const people = ["Harsh", "Kushal", "Alice", "Bob", "Charlie"];
const statuses = ["pending", "claimed", "completed"];

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateChores(n) {
  const chores = [];
  for (let i = 0; i < n; i++) {
    const idx = i % choreTitles.length;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdBy = people[Math.floor(Math.random() * people.length)];
    const created = randomDate(new Date("2025-09-01"), new Date("2026-02-15"));

    // only give a deadline sometimes
    let deadline = null;
    if (Math.random() > 0.3) {
      deadline = randomDate(new Date("2026-01-01"), new Date("2026-03-31"))
        .toISOString()
        .split("T")[0];
    }

    chores.push({
      title: choreTitles[idx],
      description: choreDescriptions[idx],
      assignedTo:
        status !== "pending"
          ? people[Math.floor(Math.random() * people.length)]
          : "",
      createdBy,
      status,
      deadline,
      createdAt: created.toISOString(),
    });
  }
  return chores;
}

async function seed() {
  try {
    await client.connect();
    const db = client.db("household-hub");
    const collection = db.collection("chores");

    await collection.deleteMany({});
    console.log("Cleared chores collection");

    const chores = generateChores(1000);
    await collection.insertMany(chores);
    console.log("Inserted", chores.length, "chores");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();
