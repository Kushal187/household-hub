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
    console.error("Error fetching people:", err);
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
    console.error("Error fetching person:", err);
    res.status(500).json({ error: "Failed to fetch person" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    const person = await createPerson(req.body);
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
    console.error("Error updating person:", err);
    res.status(500).json({ error: "Failed to update person" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deletePerson(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json({ message: "Person deleted" });
  } catch (err) {
    console.error("Error deleting person:", err);
    res.status(500).json({ error: "Failed to delete person" });
  }
});

export default router;
