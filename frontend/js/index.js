const homeContainer = document.querySelector(".home-container");

async function loadDashboard() {
  try {
    const [choresRes, expensesRes, balancesRes] = await Promise.all([
      fetch("/api/chores?limit=5"),
      fetch("/api/expenses?limit=5"),
      fetch("/api/expenses/balances"),
    ]);

    const choresData = await choresRes.json();
    const expensesData = await expensesRes.json();
    const balances = await balancesRes.json();

    renderDashboard(choresData, expensesData, balances);
  } catch (err) {
    homeContainer.innerHTML += '<p class="error">Failed to load dashboard.</p>';
  }
}

function renderDashboard(choresData, expensesData, balances) {
  const balanceEntries = Object.entries(balances);

  const dashboardHTML = `
    <div class="dashboard-grid">
      <section class="dashboard-card">
        <h2>Recent Chores</h2>
        ${
          choresData.chores.length
            ? `<ul class="dashboard-list">
            ${choresData.chores
              .map(
                (c) =>
                  `<li>
                <span class="item-title">${c.title}</span>
                <span class="status-badge status-${c.status}">${c.status}</span>
              </li>`,
              )
              .join("")}
          </ul>`
            : "<p>No chores yet.</p>"
        }
        <a href="/chores.html" class="card-link">View all chores</a>
      </section>

      <section class="dashboard-card">
        <h2>Recent Expenses</h2>
        ${
          expensesData.expenses.length
            ? `<ul class="dashboard-list">
            ${expensesData.expenses
              .map(
                (e) =>
                  `<li>
                <span class="item-title">${e.description}</span>
                <span class="item-amount">$${e.amount.toFixed(2)}</span>
              </li>`,
              )
              .join("")}
          </ul>`
            : "<p>No expenses yet.</p>"
        }
        <a href="/expenses.html" class="card-link">View all expenses</a>
      </section>

      <section class="dashboard-card balance-overview">
        <h2>Balance Overview</h2>
        ${
          balanceEntries.length
            ? balanceEntries
                .map(([person, amount]) => {
                  const isPositive = amount >= 0;
                  return `<div class="balance-row ${isPositive ? "positive" : "negative"}">
                <span>${person}</span>
                <span class="balance-val">${isPositive ? "+" : ""}$${amount.toFixed(2)}</span>
              </div>`;
                })
                .join("")
            : "<p>No outstanding balances.</p>"
        }
      </section>
    </div>
  `;

  homeContainer.innerHTML += dashboardHTML;
}

loadDashboard();
