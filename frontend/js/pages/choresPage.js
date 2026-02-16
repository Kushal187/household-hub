import { fetchChores, createChore, updateChore, deleteChore } from '../api/choresApi.js';
import { $, showMessage } from '../utils/dom.js';

const choreList = $('#chore-list');
const choreForm = $('#chore-form');
const statusFilter = $('#status-filter');
const messageEl = $('#chore-message');

const formatDate = (iso) => new Date(iso).toLocaleDateString();

const renderChores = (chores) => {
  choreList.innerHTML = '';
  if (chores.length === 0) {
    choreList.innerHTML =
      '<tr><td colspan="5" class="text-center text-muted">No chores found.</td></tr>';
    return;
  }
  for (const chore of chores) {
    const tr = document.createElement('tr');
    const isOpen = chore.status === 'open';
    const isClaimed = chore.status === 'claimed';

    tr.innerHTML = `
      <td>${chore.title}</td>
      <td>${formatDate(chore.deadline)}</td>
      <td>${chore.assignedTo || '—'}</td>
      <td><span class="status-${chore.status}">${chore.status}</span></td>
      <td>
        ${isOpen ? `<button class="btn btn-sm btn-outline-primary btn-claim" data-id="${chore._id}">Claim</button>` : ''}
        ${isClaimed ? `<button class="btn btn-sm btn-outline-success btn-done" data-id="${chore._id}">Done</button>` : ''}
        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${chore._id}">Delete</button>
      </td>
    `;
    choreList.appendChild(tr);
  }
};

const loadChores = async () => {
  try {
    const status = statusFilter.value;
    const chores = await fetchChores(status);
    renderChores(chores);
  } catch (err) {
    showMessage(messageEl, err.message);
  }
};

const handleCreate = async (e) => {
  e.preventDefault();
  const title = $('#chore-title').value.trim();
  const deadline = $('#chore-deadline').value;
  if (!title || !deadline) return;

  try {
    await createChore(title, deadline);
    choreForm.reset();
    showMessage(messageEl, 'Chore added!', 'success');
    await loadChores();
  } catch (err) {
    showMessage(messageEl, err.message);
  }
};

const handleClaim = async (id) => {
  const name = prompt('Enter your name to claim this chore:');
  if (!name || !name.trim()) return;
  try {
    await updateChore(id, { assignedTo: name.trim(), status: 'claimed' });
    await loadChores();
  } catch (err) {
    showMessage(messageEl, err.message);
  }
};

const handleDone = async (id) => {
  try {
    await updateChore(id, { status: 'done' });
    await loadChores();
  } catch (err) {
    showMessage(messageEl, err.message);
  }
};

const handleDelete = async (id) => {
  if (!confirm('Delete this chore?')) return;
  try {
    await deleteChore(id);
    showMessage(messageEl, 'Chore deleted.', 'warning');
    await loadChores();
  } catch (err) {
    showMessage(messageEl, err.message);
  }
};

const handleTableClick = (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.classList.contains('btn-claim')) handleClaim(id);
  else if (btn.classList.contains('btn-done')) handleDone(id);
  else if (btn.classList.contains('btn-delete')) handleDelete(id);
};

choreForm.addEventListener('submit', handleCreate);
statusFilter.addEventListener('change', loadChores);
choreList.addEventListener('click', handleTableClick);

loadChores();
