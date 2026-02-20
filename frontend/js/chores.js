import { showToast } from "./toast.js";

const choreBoard = document.getElementById("chore-board");
const pagination = document.getElementById("pagination");
const createdBySelect = document.getElementById("chore-createdBy");
const choreForm = document.getElementById("chore-form");
const createdByHint = document.getElementById("created-by-hint");
const claimModal = document.getElementById("claim-modal");
const claimPersonSelect = document.getElementById("claim-person");

let currentPage = 1;
let people = [];
let claimChoreId = null;

async function fetchPeople() {
  try {
    const res = await fetch("/api/people");
    people = await res.json();
  } catch (err) {
    people = [];
    console.log(err);
  }
}

function populateCreatedBySelect() {
  // clear old options except the placeholder
  const existing = createdBySelect.querySelectorAll("option");
  for (let i = 1; i < existing.length; i++) existing[i].remove();

  people.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = p.name;
    createdBySelect.appendChild(opt);
  });

  if (createdByHint) {
    createdByHint.innerHTML = people.length
      ? ""
      : '<p class="form-hint">Add household members on the <a href="/people.html">People</a> page first.</p>';
  }

  const submitBtn = choreForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = !people.length;
}

function populateClaimModalSelect() {
  claimPersonSelect.innerHTML = '<option value="">Select person</option>';
  for (const p of people) {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = p.name;
    claimPersonSelect.appendChild(opt);
  }
}

function showClaimModal() {
  populateClaimModalSelect();
  claimModal.hidden = false;
}

function hideClaimModal() {
  claimModal.hidden = true;
  claimChoreId = null;
}

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
    console.log(err);
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

  let html = "";
  chores.forEach((chore, i) => {
    html += `
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
        ${chore.status === "pending" ? `<button class="btn btn-sm btn-primary" data-action="claim" data-id="${chore._id}">Claim</button>` : ""}
        ${chore.status === "claimed" ? `<button class="btn btn-sm btn-success" data-action="complete" data-id="${chore._id}">Complete</button>` : ""}
        <button class="btn btn-sm btn-danger" data-action="delete" data-id="${chore._id}">Delete</button>
      </div>
    </div>`;
  });
  choreBoard.innerHTML = html;

  // attach action listeners
  choreBoard.querySelectorAll("[data-action='claim']").forEach((btn) => {
    btn.addEventListener("click", () => claimChore(btn.dataset.id));
  });
  choreBoard.querySelectorAll("[data-action='complete']").forEach((btn) => {
    btn.addEventListener("click", () => completeChore(btn.dataset.id));
  });
  choreBoard.querySelectorAll("[data-action='delete']").forEach((btn) => {
    btn.addEventListener("click", () => removeChore(btn.dataset.id));
  });
}

function renderPagination(page, totalPages) {
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = "";
  if (page > 1)
    html += `<button class="btn btn-sm" data-page="${page - 1}">Prev</button>`;
  html += `<span class="page-info">Page ${page} of ${totalPages}</span>`;
  if (page < totalPages)
    html += `<button class="btn btn-sm" data-page="${page + 1}">Next</button>`;
  pagination.innerHTML = html;

  pagination.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => fetchChores(Number(btn.dataset.page)));
  });
}

choreForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fd = new FormData(choreForm);
  const choreData = {
    title: fd.get("title"),
    description: fd.get("description"),
    createdBy: fd.get("createdBy"),
    deadline: fd.get("deadline") || null,
  };

  try {
    const res = await fetch("/api/chores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(choreData),
    });
    if (!res.ok) {
      const errData = await res.json();
      showToast(errData.error || "Failed to create chore", "error");
      return;
    }
    choreForm.reset();
    showToast("Chore added successfully");
    fetchChores(1);
  } catch (err) {
    console.log(err);
    showToast("Failed to create chore", "error");
  }
});

function claimChore(id) {
  if (!people.length) {
    showToast("Add household members on the People page first", "error");
    return;
  }
  claimChoreId = id;
  showClaimModal();
}

async function confirmClaimChore() {
  const person = claimPersonSelect.value?.trim();
  if (!person) {
    showToast("Select a person", "error");
    return;
  }
  if (!claimChoreId) return;

  try {
    await fetch(`/api/chores/${claimChoreId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "claimed", assignedTo: person }),
    });
    showToast(`Chore claimed by ${person}`);
    hideClaimModal();
    fetchChores(currentPage);
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
    console.log(err);
    showToast("Failed to delete chore", "error");
  }
}

// filter and sort listeners
document
  .getElementById("filter-status")
  .addEventListener("change", () => fetchChores(1));
document
  .getElementById("sort-by")
  .addEventListener("change", () => fetchChores(1));

// modal listeners
document
  .getElementById("claim-modal-cancel")
  .addEventListener("click", hideClaimModal);
document
  .getElementById("claim-modal-confirm")
  .addEventListener("click", confirmClaimChore);
claimModal
  .querySelector(".claim-modal-overlay")
  .addEventListener("click", hideClaimModal);

// init
(async () => {
  await fetchPeople();
  populateCreatedBySelect();
  fetchChores();
})();
