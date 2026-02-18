import { Router } from "express";
import {
  getAllChores,
  getChoreById,
  createChore,
  updateChore,
  deleteChore,
} from "../db/choresDB.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await getAllChores(req.query);
    res.json(result);
  } catch (err) {
    console.error("Error fetching chores:", err);
    res.status(500).json({ error: "Failed to fetch chores" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const chore = await getChoreById(req.params.id);
    if (!chore) {
      return res.status(404).json({ error: "Chore not found" });
    }
    res.json(chore);
  } catch (err) {
    console.error("Error fetching chore:", err);
    res.status(500).json({ error: "Failed to fetch chore" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, createdBy } = req.body;
    if (!title || !createdBy) {
      return res.status(400).json({ error: "Title and createdBy are required" });
    }
    const chore = await createChore(req.body);
    res.status(201).json(chore);
  } catch (err) {
    console.error("Error creating chore:", err);
    res.status(500).json({ error: "Failed to create chore" });
  }
});



export default router;
