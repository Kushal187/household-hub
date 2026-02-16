export const fetchChores = async (status = '') => {
  const query = status ? `?status=${status}` : '';
  const res = await fetch(`/api/chores${query}`);
  if (!res.ok) throw new Error('Failed to fetch chores');
  return res.json();
};

export const createChore = async (title, deadline) => {
  const res = await fetch('/api/chores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, deadline }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create chore');
  }
  return res.json();
};

export const updateChore = async (id, updates) => {
  const res = await fetch(`/api/chores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to update chore');
  }
  return res.json();
};

export const deleteChore = async (id) => {
  const res = await fetch(`/api/chores/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete chore');
  }
  return res.json();
};
