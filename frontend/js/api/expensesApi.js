export const fetchExpenses = async () => {
  const res = await fetch('/api/expenses');
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
};

export const createExpense = async (description, amount, paidBy, splitBetween) => {
  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, amount, paidBy, splitBetween }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create expense');
  }
  return res.json();
};

export const updateExpense = async (id, updates) => {
  const res = await fetch(`/api/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to update expense');
  }
  return res.json();
};

export const deleteExpense = async (id) => {
  const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete expense');
  }
  return res.json();
};
