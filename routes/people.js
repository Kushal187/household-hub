import { Router } from "express";
import {
  getAllPeople,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
} from "../db/peopleDB.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const people = await getAllPeople();
    res.json(people);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch people" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const person = await getPersonById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(person);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch person" });
  }
});

router.post("/", async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const person = await createPerson({ name });
    res.status(201).json(person);
  } catch (err) {
    console.error("Error creating person:", err);
    res.status(500).json({ error: "Failed to create person" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await updatePerson(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update person" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deletePerson(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Person not found" });

    // fix
    await db.collection("chores").updateMany(
      { createdBy: deleted.name },
      { $set: { createdBy: "Deleted User" } }
    );
    await db.collection("expenses").updateMany(
      { paidBy: deleted.name },
      { $set: { paidBy: "Deleted User" } }
    );
    
    res.json({ message: "Person deleted" });
  } catch (err) {
    console.log("delete person failed:", err.message);
    res.status(500).json({ error: "Failed to delete person" });
  }
});

export default router;
