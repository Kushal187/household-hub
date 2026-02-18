const peopleList = document.getElementById("people-list");
const personForm = document.getElementById("person-form");

async function loadPeople() {
  peopleList.innerHTML =
    '<div class="spinner-wrapper"><div class="spinner"></div></div>';

  try {
    const res = await fetch("/api/people");
    const people = await res.json();
    renderPeople(people);
  } catch (err) {
    peopleList.innerHTML = '<p class="error">Failed to load people.</p>';
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
          <span class="person-name">${escapeHtml(p.name)}</span>
        </li>
      `,
        )
        .join("")}
    </ul>
  `;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

personForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(personForm);
  const name = formData.get("name")?.trim();

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
      const err = await res.json();
      showToast(err.error || "Failed to add person", "error");
      return;
    }

    personForm.reset();
    showToast("Person added successfully");
    loadPeople();
  } catch (err) {
    showToast("Failed to add person", "error");
  }
});

loadPeople();
