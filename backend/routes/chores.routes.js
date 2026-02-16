import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getChores, insertChore, updateChore, deleteChore } from '../db/myMongoDB.js';

const router = Router();

const isValidId = (id) => ObjectId.isValid(id) && new ObjectId(id).toString() === id;

const VALID_STATUSES = ['open', 'claimed', 'done'];

// GET /api/chores?status=open|claimed|done
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      if (!VALID_STATUSES.includes(req.query.status)) {
        return res.status(400).json({ error: 'Invalid status. Must be open, claimed, or done.' });
      }
      filter.status = req.query.status;
    }
    const chores = await getChores(filter);
    res.json(chores);
  } catch (err) {
    console.error('GET /api/chores error:', err);
    res.status(500).json({ error: 'Failed to fetch chores.' });
  }
});

// POST /api/chores
router.post('/', async (req, res) => {
  try {
    const { title, deadline } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    if (!deadline || typeof deadline !== 'string') {
      return res.status(400).json({ error: 'Deadline is required.' });
    }
    const chore = await insertChore({ title: title.trim(), deadline });
    res.status(201).json(chore);
  } catch (err) {
    console.error('POST /api/chores error:', err);
    res.status(500).json({ error: 'Failed to create chore.' });
  }
});

// PUT /api/chores/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid chore ID.' });
    }

    const allowed = ['title', 'deadline', 'assignedTo', 'status'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.status && !VALID_STATUSES.includes(updates.status)) {
      return res.status(400).json({ error: 'Invalid status. Must be open, claimed, or done.' });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update.' });
    }

    const updated = await updateChore(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Chore not found.' });
    }
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/chores/:id error:', err);
    res.status(500).json({ error: 'Failed to update chore.' });
  }
});

// DELETE /api/chores/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid chore ID.' });
    }
    const count = await deleteChore(id);
    if (count === 0) {
      return res.status(404).json({ error: 'Chore not found.' });
    }
    res.json({ message: 'Chore deleted.' });
  } catch (err) {
    console.error('DELETE /api/chores/:id error:', err);
    res.status(500).json({ error: 'Failed to delete chore.' });
  }
});

export default router;
