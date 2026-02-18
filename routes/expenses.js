import { Router } from "express";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getBalanceSummary,
} from "../db/expensesDB.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await getAllExpenses(req.query);
    res.json(result);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

router.get("/balances", async (req, res) => {
  try {
    const balances = await getBalanceSummary();
    res.json(balances);
  } catch (err) {
    console.error("Error fetching balances:", err);
    res.status(500).json({ error: "Failed to fetch balances" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const expense = await getExpenseById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (err) {
    console.error("Error fetching expense:", err);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { description, amount, paidBy } = req.body;
    if (!description || !amount || !paidBy) {
      return res
        .status(400)
        .json({ error: "Description, amount, and paidBy are required" });
    }
    const expense = await createExpense(req.body);
    res.status(201).json(expense);
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await updateExpense(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteExpense(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

export default router;
