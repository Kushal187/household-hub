import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getExpenses, insertExpense, updateExpense, deleteExpense } from '../db/myMongoDB.js';

const router = Router();

const isValidId = (id) => ObjectId.isValid(id) && new ObjectId(id).toString() === id;

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await getExpenses();
    res.json(expenses);
  } catch (err) {
    console.error('GET /api/expenses error:', err);
    res.status(500).json({ error: 'Failed to fetch expenses.' });
  }
});

// POST /api/expenses
router.post('/', async (req, res) => {
  try {
    const { description, amount, paidBy, splitBetween } = req.body;

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'Description is required.' });
    }
    if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }
    if (!paidBy || typeof paidBy !== 'string' || !paidBy.trim()) {
      return res.status(400).json({ error: 'paidBy is required.' });
    }
    if (!Array.isArray(splitBetween) || splitBetween.length === 0) {
      return res.status(400).json({ error: 'splitBetween must be a non-empty array of names.' });
    }

    const cleaned = splitBetween.map((s) => s.trim()).filter((s) => s.length > 0);
    if (cleaned.length === 0) {
      return res.status(400).json({ error: 'splitBetween must contain at least one name.' });
    }

    const expense = await insertExpense({
      description: description.trim(),
      amount,
      paidBy: paidBy.trim(),
      splitBetween: cleaned,
    });
    res.status(201).json(expense);
  } catch (err) {
    console.error('POST /api/expenses error:', err);
    res.status(500).json({ error: 'Failed to create expense.' });
  }
});

// PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid expense ID.' });
    }

    const allowed = ['description', 'amount', 'paidBy', 'splitBetween', 'isSettled'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (
      updates.amount !== undefined &&
      (typeof updates.amount !== 'number' || updates.amount <= 0)
    ) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update.' });
    }

    const updated = await updateExpense(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Expense not found.' });
    }
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/expenses/:id error:', err);
    res.status(500).json({ error: 'Failed to update expense.' });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid expense ID.' });
    }
    const count = await deleteExpense(id);
    if (count === 0) {
      return res.status(404).json({ error: 'Expense not found.' });
    }
    res.json({ message: 'Expense deleted.' });
  } catch (err) {
    console.error('DELETE /api/expenses/:id error:', err);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
});

export default router;
