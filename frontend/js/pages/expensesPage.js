import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../api/expensesApi.js';
import { $, showMessage } from '../utils/dom.js';

const expenseList = $('#expense-list');
const expenseForm = $('#expense-form');
const balanceList = $('#balance-list');
const messageEl = $('#expense-message');

const computeBalances = (expenses) => {
  const paid = {};
  const owed = {};

  for (const exp of expenses) {
    if (exp.isSettled) continue;
    const share = exp.amount / exp.splitBetween.length;
    paid[exp.paidBy] = (paid[exp.paidBy] || 0) + exp.amount;
    for (const person of exp.splitBetween) {
      owed[person] = (owed[person] || 0) + share;
    }
  }

  const allPeople = new Set([...Object.keys(paid), ...Object.keys(owed)]);
  const balances = {};
  for (const person of allPeople) {
    balances[person] = (paid[person] || 0) - (owed[person] || 0);
  }
  return balances;
};

const renderBalances = (expenses) => {
  const balances = computeBalances(expenses);
  balanceList.innerHTML = '';
  const names = Object.keys(balances).sort();

  if (names.length === 0) {
    balanceList.innerHTML = '<li class="list-group-item text-muted">No balance data yet.</li>';
    return;
  }

  for (const name of names) {
    const val = balances[name];
    let cls = 'balance-zero';
    if (val > 0.01) cls = 'balance-positive';
    else if (val < -0.01) cls = 'balance-negative';

    const sign = val >= 0 ? '+' : '';
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between';
    li.innerHTML = `<span>${name}</span><span class="${cls}">${sign}$${val.toFixed(2)}</span>`;
    balanceList.appendChild(li);
  }
};

const renderExpenses = (expenses) => {
  expenseList.innerHTML = '';
  if (expenses.length === 0) {
    expenseList.innerHTML =
      '<tr><td colspan="6" class="text-center text-muted">No expenses found.</td></tr>';
    return;
  }

  for (const exp of expenses) {
    const tr = document.createElement('tr');
    if (exp.isSettled) tr.classList.add('expense-settled');

    const settleLabel = exp.isSettled ? 'Unsettle' : 'Settle';
    const settleClass = exp.isSettled ? 'btn-outline-secondary' : 'btn-outline-info';

    tr.innerHTML = `
      <td>${exp.description}</td>
      <td>$${exp.amount.toFixed(2)}</td>
      <td>${exp.paidBy}</td>
      <td>${exp.splitBetween.join(', ')}</td>
      <td>${exp.isSettled ? 'Settled' : 'Unsettled'}</td>
      <td>
        <button class="btn btn-sm ${settleClass} btn-settle" data-id="${exp._id}" data-settled="${exp.isSettled}">${settleLabel}</button>
        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${exp._id}">Delete</button>
      </td>
    `;
    expenseList.appendChild(tr);
  }
};

let cachedExpenses = [];

const loadExpenses = async () => {
  try {
    cachedExpenses = await fetchExpenses();
    renderExpenses(cachedExpenses);
    renderBalances(cachedExpenses);
  } catch (err) {
    showMessage(messageEl, err.message);
  }
};

const handleCreate = async (e) => {
  e.preventDefault();
  const description = $('#expense-desc').value.trim();
  const amount = parseFloat($('#expense-amount').value);
  const paidBy = $('#expense-paid-by').value.trim();
  const splitRaw = $('#expense-split').value;

  const splitBetween = splitRaw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (!description || !amount || !paidBy || splitBetween.length === 0) {
    showMessage(messageEl, 'Please fill in all fields.');
    return;
  }

  try {
    await createExpense(description, amount, paidBy, splitBetween);
    expenseForm.reset();
    showMessage(messageEl, 'Expense added!', 'success');
    await loadExpenses();
  } catch (err) {
    showMessage(messageEl, err.message);
  }
};

const handleSettle = async (id, currentlySettled) => {
  try {
    await updateExpense(id, { isSettled: currentlySettled !== 'true' });
    await loadExpenses();
  } catch (err) {
    showMessage(messageEl, err.message);
  }
};

const handleDelete = async (id) => {
  if (!confirm('Delete this expense?')) return;
  try {
    await deleteExpense(id);
    showMessage(messageEl, 'Expense deleted.', 'warning');
    await loadExpenses();
  } catch (err) {
    showMessage(messageEl, err.message);
  }
};

const handleTableClick = (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.classList.contains('btn-settle')) {
    handleSettle(id, btn.dataset.settled);
  } else if (btn.classList.contains('btn-delete')) {
    handleDelete(id);
  }
};

expenseForm.addEventListener('submit', handleCreate);
expenseList.addEventListener('click', handleTableClick);

loadExpenses();
