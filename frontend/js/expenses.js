const expenseList = document.getElementById("expense-list");
const balancesDiv = document.getElementById("balances");
const pagination = document.getElementById("pagination");
let currentPage = 1;

async function fetchExpenses(page = 1) {
  const category = document.getElementById("filter-category").value;
  const paidBy = document.getElementById("filter-paidBy").value;

  expenseList.innerHTML =
    '<div class="spinner-wrapper"><div class="spinner"></div></div>';

  const params = new URLSearchParams({ page, limit: 20 });
  if (category) params.set("category", category);
  if (paidBy) params.set("paidBy", paidBy);

  try {
    const res = await fetch(`/api/expenses?${params}`);
    const data = await res.json();
    renderExpenses(data.expenses);
    renderPagination(data.page, data.totalPages);
    currentPage = data.page;
  } catch (err) {
    expenseList.innerHTML = '<p class="error">Failed to load expenses.</p>';
  }
}

async function fetchBalances() {
  try {
    const res = await fetch("/api/expenses/balances");
    const balances = await res.json();
    renderBalances(balances);
  } catch (err) {
    balancesDiv.innerHTML = '<p class="error">Failed to load balances.</p>';
  }
}

function renderExpenses(expenses) {
  if (!expenses.length) {
    expenseList.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <p>No expenses found</p>
        <span>Add a new expense using the form above.</span>
      </div>`;
    return;
  }

  const tableHTML = `
    <table class="expense-table fade-in">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Paid By</th>
          <th>Category</th>
          <th>Split</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${expenses
          .map(
            (e, i) => `
          <tr class="${e.settled ? "settled" : ""} fade-in" style="animation-delay: ${i * 0.03}s">
            <td>${e.date}</td>
            <td>${e.description}</td>
            <td>$${e.amount.toFixed(2)}</td>
            <td>${e.paidBy}</td>
            <td><span class="category-badge category-${e.category}">${e.category}</span></td>
            <td>${e.splitBetween.join(", ")}</td>
            <td><span class="status-badge status-${e.settled ? "settled" : "unsettled"}">${e.settled ? "Settled" : "Unsettled"}</span></td>
            <td class="action-cell">
              ${!e.settled ? `<button class="btn btn-sm btn-success" onclick="settleExpense('${e._id}')">Settle</button>` : ""}
              <button class="btn btn-sm btn-danger" onclick="removeExpense('${e._id}')">Delete</button>
            </td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;
  expenseList.innerHTML = tableHTML;
}

function renderBalances(balances) {
  const entries = Object.entries(balances);
  if (!entries.length) {
    balancesDiv.innerHTML = "<p>No outstanding balances.</p>";
    return;
  }

  balancesDiv.innerHTML = entries
    .map(([person, amount]) => {
      const isPositive = amount >= 0;
      return `
      <div class="balance-card ${isPositive ? "positive" : "negative"} fade-in">
        <span class="balance-name">${person}</span>
        <span class="balance-amount">${isPositive ? "+" : ""}$${amount.toFixed(2)}</span>
        <span class="balance-label">${isPositive ? "is owed" : "owes"}</span>
      </div>
    `;
    })
    .join("");
}

function renderPagination(page, totalPages) {
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = "";
  if (page > 1) {
    html += `<button class="btn btn-sm" onclick="goToPage(${page - 1})">Prev</button>`;
  }
  html += `<span class="page-info">Page ${page} of ${totalPages}</span>`;
  if (page < totalPages) {
    html += `<button class="btn btn-sm" onclick="goToPage(${page + 1})">Next</button>`;
  }
  pagination.innerHTML = html;
}

function goToPage(page) {
  fetchExpenses(page);
}

const expenseForm = document.getElementById("expense-form");

expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(expenseForm);
  const splitCheckboxes = document.querySelectorAll(
    'input[name="splitBetween"]:checked',
  );
  const splitBetween = Array.from(splitCheckboxes).map((cb) => cb.value);

  if (!splitBetween.length) {
    showToast("Select at least one person to split with", "error");
    return;
  }

  const expenseData = {
    description: formData.get("description"),
    amount: parseFloat(formData.get("amount")),
    paidBy: formData.get("paidBy"),
    category: formData.get("category"),
    date: formData.get("date") || new Date().toISOString().split("T")[0],
    splitBetween,
  };

  try {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseData),
    });

    if (!res.ok) {
      const err = await res.json();
      showToast(err.error || "Failed to create expense", "error");
      return;
    }

    expenseForm.reset();
    document
      .querySelectorAll('input[name="splitBetween"]')
      .forEach((cb) => (cb.checked = true));
    showToast("Expense added successfully");
    fetchExpenses(1);
    fetchBalances();
  } catch (err) {
    showToast("Failed to create expense", "error");
  }
});

async function settleExpense(id) {
  if (!confirm("Mark this expense as settled?")) return;

  try {
    await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settled: true }),
    });
    showToast("Expense marked as settled");
    fetchExpenses(currentPage);
    fetchBalances();
  } catch (err) {
    showToast("Failed to settle expense", "error");
  }
}

async function removeExpense(id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  try {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    showToast("Expense deleted");
    fetchExpenses(currentPage);
    fetchBalances();
  } catch (err) {
    showToast("Failed to delete expense", "error");
  }
}

document.getElementById("filter-category").addEventListener("change", () => {
  fetchExpenses(1);
});

document.getElementById("filter-paidBy").addEventListener("change", () => {
  fetchExpenses(1);
});

fetchExpenses();
fetchBalances();
