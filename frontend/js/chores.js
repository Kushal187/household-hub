const choreBoard = document.getElementById("chore-board");
const pagination = document.getElementById("pagination");
let currentPage = 1;

async function fetchChores(page = 1) {
  const status = document.getElementById("filter-status").value;
  const sortBy = document.getElementById("sort-by").value;

  choreBoard.innerHTML =
    '<div class="spinner-wrapper"><div class="spinner"></div></div>';

  const params = new URLSearchParams({ page, limit: 20 });
  if (status) params.set("status", status);
  if (sortBy) params.set("sortBy", sortBy);

  try {
    const res = await fetch(`/api/chores?${params}`);
    const data = await res.json();
    renderChores(data.chores);
    renderPagination(data.page, data.totalPages);
    currentPage = data.page;
  } catch (err) {
    choreBoard.innerHTML = '<p class="error">Failed to load chores.</p>';
  }
}

function renderChores(chores) {
  if (!chores.length) {
    choreBoard.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
        </svg>
        <p>No chores found</p>
        <span>Add a new chore using the form above.</span>
      </div>`;
    return;
  }

  choreBoard.innerHTML = chores
    .map(
      (chore, i) => `
    <div class="chore-card fade-in" style="animation-delay: ${i * 0.05}s" data-id="${chore._id}">
      <div class="chore-header">
        <h3 class="chore-title">${chore.title}</h3>
        <span class="status-badge status-${chore.status}">${chore.status}</span>
      </div>
      ${chore.description ? `<p class="chore-desc">${chore.description}</p>` : ""}
      <div class="chore-meta">
        <span>Created by: ${chore.createdBy}</span>
        ${chore.assignedTo ? `<span>Assigned to: ${chore.assignedTo}</span>` : ""}
        ${chore.deadline ? `<span>Due: ${chore.deadline}</span>` : ""}
      </div>
      <div class="chore-actions">
        ${chore.status === "pending" ? `<button class="btn btn-sm btn-primary" onclick="claimChore('${chore._id}')">Claim</button>` : ""}
        ${chore.status === "claimed" ? `<button class="btn btn-sm btn-success" onclick="completeChore('${chore._id}')">Complete</button>` : ""}
        <button class="btn btn-sm btn-danger" onclick="removeChore('${chore._id}')">Delete</button>
      </div>
    </div>
  `,
    )
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
  fetchChores(page);
}

const choreForm = document.getElementById("chore-form");

choreForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(choreForm);
  const choreData = {
    title: formData.get("title"),
    description: formData.get("description"),
    createdBy: formData.get("createdBy"),
    deadline: formData.get("deadline") || null,
  };

  try {
    const res = await fetch("/api/chores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(choreData),
    });

    if (!res.ok) {
      const err = await res.json();
      showToast(err.error || "Failed to create chore", "error");
      return;
    }

    choreForm.reset();
    showToast("Chore added successfully");
    fetchChores(1);
  } catch (err) {
    showToast("Failed to create chore", "error");
  }
});

async function claimChore(id) {
  const person = prompt("Who is claiming this chore?", "Harsh");
  if (!person) return;

  try {
    await fetch(`/api/chores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "claimed", assignedTo: person }),
    });
    showToast(`Chore claimed by ${person}`);
    fetchChores(currentPage);
  } catch (err) {
    showToast("Failed to claim chore", "error");
  }
}

async function completeChore(id) {
  try {
    await fetch(`/api/chores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    showToast("Chore marked as completed");
    fetchChores(currentPage);
  } catch (err) {
    showToast("Failed to complete chore", "error");
  }
}

async function removeChore(id) {
  if (!confirm("Are you sure you want to delete this chore?")) return;

  try {
    await fetch(`/api/chores/${id}`, { method: "DELETE" });
    showToast("Chore deleted");
    fetchChores(currentPage);
  } catch (err) {
    showToast("Failed to delete chore", "error");
  }
}

document.getElementById("filter-status").addEventListener("change", () => {
  fetchChores(1);
});

document.getElementById("sort-by").addEventListener("change", () => {
  fetchChores(1);
});

fetchChores();
