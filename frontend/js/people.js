import { showToast } from "./toast.js";

const peopleList = document.getElementById("people-list");
const personForm = document.getElementById("person-form");

async function loadPeople() {
  peopleList.innerHTML =
    '<div class="spinner-wrapper"><div class="spinner"></div></div>';

  try {
    const res = await fetch("/api/people");
    const data = await res.json();
    renderPeople(data);
  } catch (err) {
    peopleList.innerHTML = '<p class="error">Failed to load people.</p>';
    console.log(err);
  }
}

function renderPeople(people) {
  if (!people.length) {
    peopleList.innerHTML = `
      <div class="empty-state">
        <p>No household members yet.</p>
        <span>Add someone using the form above.</span>
      </div>`;
    return;
  }

  peopleList.innerHTML = `
    <ul class="people-cards">
      ${people
        .map(
          (p) => `
        <li class="person-card">
          <span class="person-name">${p.name}</span>
          <button type="button" class="btn btn-sm btn-danger" data-id="${p._id}" data-action="delete">Delete</button>
        </li>`,
        )
        .join("")}
    </ul>`;

  peopleList.querySelectorAll("[data-action='delete']").forEach((btn) => {
    btn.addEventListener("click", () => deletePerson(btn.dataset.id));
  });
}

async function deletePerson(id) {
  if (!confirm("Remove this person from the household?")) return;

  try {
    const res = await fetch(`/api/people/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      showToast(err.error || "Failed to delete person", "error");
      return;
    }
    showToast("Person removed");
    loadPeople();
  } catch (err) {
    showToast("Failed to delete person", "error");
    console.log(err);
  }
}

personForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = new FormData(personForm).get("name")?.trim();

  if (!name) {
    showToast("Please enter a name", "error");
    return;
  }

  try {
    const res = await fetch("/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const errData = await res.json();
      showToast(errData.error || "Failed to add person", "error");
      return;
    }

    personForm.reset();
    showToast("Person added successfully");
    loadPeople();
  } catch (err) {
    showToast("Failed to add person", "error");
    console.log(err);
  }
});

loadPeople();
