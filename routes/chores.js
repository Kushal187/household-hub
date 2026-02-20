import { Router } from "express";
import {
  getAllChores,
  getChoreById,
  createChore,
  updateChore,
  deleteChore,
} from "../db/choresDB.js";

const router = Router();

// list chores with optional query filters
router.get("/", async (req, res) => {
  try {
    const result = await getAllChores(req.query);
    res.json(result);
  } catch (err) {
    console.log("chores fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch chores" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const chore = await getChoreById(req.params.id);
    if (!chore) return res.status(404).json({ error: "Chore not found" });
    res.json(chore);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chore" });
  }
});

router.post("/", async (req, res) => {
  const { title, createdBy } = req.body;

  // both fields required
  if (!title || !createdBy) {
    return res.status(400).json({ error: "Title and createdBy are required" });
  }

  try {
    const chore = await createChore(req.body);
    res.status(201).json(chore);
  } catch (err) {
    console.log("Error creating chore:", err);
    res.status(500).json({ error: "Failed to create chore" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = await updateChore(req.params.id, req.body);
    if (!result) return res.status(404).json({ error: "Chore not found" });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update chore" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ok = await deleteChore(req.params.id);
    if (!ok) return res.status(404).json({ error: "Chore not found" });
    res.json({ message: "Chore deleted" });
  } catch (err) {
    console.log("delete failed", err.message);
    res.status(500).json({ error: "Failed to delete chore" });
  }
});

export default router;
