// ------------------ Data model ------------------
const SAMPLE = {};
let knowledgeBase = JSON.parse(localStorage.getItem("knowledgeBase_v2")) || {};

let path = []; // current node path

const areasList = document.getElementById("areasList");
const foldersEl = document.getElementById("folders");
const cardsEl = document.getElementById("cards");
const breadcrumbEl = document.getElementById("breadcrumb");
const currentPathLabel = document.getElementById("currentPathLabel");

// ------------------ Tree helpers ------------------
function getNodeNormalized(p) {
  let node = knowledgeBase;
  for (const [i, part] of p.entries()) {
    if (i === 0) {
      if (!node[part]) node[part] = { subdomains: {}, cards: [] };
      node = node[part];
    } else {
      node.subdomains = node.subdomains || {};
      if (!node.subdomains[part])
        node.subdomains[part] = { subdomains: {}, cards: [] };
      node = node.subdomains[part];
    }
  }
  return node;
}

// ------------------ Rendering ------------------
function renderAreas() {
  areasList.innerHTML = "";
  Object.keys(knowledgeBase).forEach((area) => {
    const div = document.createElement("div");
    div.className = "area";
    if (path[0] === area) div.classList.add("active");
    div.textContent = area;
    div.addEventListener("click", () => {
      path = [area];
      renderAll();
    });
    areasList.appendChild(div);
  });
}

function renderBreadcrumb() {
  breadcrumbEl.innerHTML = "";
  path.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.textContent = p + (i < path.length - 1 ? " /" : "");
    btn.addEventListener("click", () => {
      path = path.slice(0, i + 1);
      renderAll();
    });
    breadcrumbEl.appendChild(btn);
  });
}

function renderFoldersAndCards() {
  foldersEl.innerHTML = "";
  cardsEl.innerHTML = "";
  const node = getNodeNormalized(path);
  currentPathLabel.textContent = path.join(" › ");
  const subs = Object.keys(node.subdomains || {});
  subs.forEach((name) => {
    const box = document.createElement("div");
    box.className = "folder";
    box.innerHTML = `<strong>${name}</strong><small>${
      Object.keys(node.subdomains[name].subdomains || {}).length
    } sub</small>`;

    // click to enter folder
    box.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") {
        path.push(name);
        renderAll();
      }
    });

    // delete folder button
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.style.marginLeft = "10px";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`Delete branch \"${name}\"?`)) {
        deleteBranch(path.concat([name]));
      }
    });
    box.appendChild(delBtn);

    foldersEl.appendChild(box);
  });

  // ------------------ Flashcards with edit/delete ------------------
  const cards = node.cards || [];
  cards.forEach((card, idx) => {
    const fc = document.createElement("div");
    fc.className = "flashcard";

    const inner = document.createElement("div");
    inner.className = "flashcard-inner";
    const front = document.createElement("div");
    front.className = "front";
    front.textContent = card.question;
    const back = document.createElement("div");
    back.className = "back";
    back.textContent = card.answer;
    inner.appendChild(front);
    inner.appendChild(back);

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    const delBtnCard = document.createElement("button");
    delBtnCard.textContent = "🗑️";

    // Edit flashcard
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("question").value = card.question;
      document.getElementById("answer").value = card.answer;
      document.getElementById("tags").value = (card.tags || []).join(", ");
      editIndex = idx;
      formTitle.textContent = "Edit Flashcard";
    });

    // Delete flashcard
    delBtnCard.addEventListener("click", (e) => {
      e.stopPropagation();
      node.cards.splice(idx, 1);
      renderAll();
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtnCard);
    fc.appendChild(inner);
    fc.appendChild(actions);

    fc.addEventListener("click", () => fc.classList.toggle("flip"));
    cardsEl.appendChild(fc);
  });
}

function renderAll() {
  renderAreas();
  renderBreadcrumb();
  renderFoldersAndCards();
  localStorage.setItem("knowledgeBase_v2", JSON.stringify(knowledgeBase));
}

// ------------------ Add Branch (relative path) ------------------
document.getElementById("addTreeBtn").addEventListener("click", () => {
  const val = document.getElementById("treePathInput").value.trim();
  if (!val) return;
  const parts = val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return;

  let node = knowledgeBase;
  let startIndex = 0;
  const first = parts[0];
  for (let i = 0; i < path.length; i++) {
    const pNode = getNodeNormalized(path.slice(0, i + 1));
    if (pNode.subdomains && pNode.subdomains[first]) {
      node = pNode;
      startIndex = i + 1;
      break;
    }
  }

  const finalPath =
    node === knowledgeBase ? parts : path.slice(0, startIndex).concat(parts);
  getNodeNormalized(finalPath);
  document.getElementById("treePathInput").value = "";
  renderAll();
});

// ------------------ Delete Branch ------------------
function deleteBranch(targetPath) {
  if (!targetPath || targetPath.length === 0) return;
  let node = knowledgeBase;
  for (let i = 0; i < targetPath.length - 1; i++) {
    if (
      !node[targetPath[i]] &&
      node.subdomains &&
      node.subdomains[targetPath[i]]
    ) {
      node = node.subdomains[targetPath[i]];
    } else {
      node = node[targetPath[i]];
    }
  }
  const lastKey = targetPath[targetPath.length - 1];
  if (node.subdomains && node.subdomains[lastKey])
    delete node.subdomains[lastKey];
  else if (node[lastKey]) delete node[lastKey];
  renderAll();
}

// ------------------ Flashcard form ------------------
const nodeForm = document.getElementById("nodeForm");
let editIndex = null;
nodeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const question = document.getElementById("question").value.trim();
  const answer = document.getElementById("answer").value.trim();
  const tags = document
    .getElementById("tags")
    .value.split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (!question || !answer) return;
  const node = getNodeNormalized(path);
  node.cards = node.cards || [];

  if (editIndex !== null) {
    node.cards[editIndex] = { question, answer, tags };
    editIndex = null;
    formTitle.textContent = "Add Flashcard";
  } else {
    node.cards.push({ question, answer, tags });
  }
  nodeForm.reset();
  renderAll();
});

// ------------------ Search ------------------
document.getElementById("searchBar").addEventListener("input", () => {
  const text = document.getElementById("searchBar").value.trim().toLowerCase();
  if (!text) {
    renderAll();
    return;
  }
  const results = [];
  function recurse(base, p) {
    for (const key of Object.keys(base)) {
      const node = base[key];
      const newPath = p.concat([key]);
      if (node.cards) {
        node.cards.forEach((c) => {
          if (
            c.question.toLowerCase().includes(text) ||
            c.answer.toLowerCase().includes(text) ||
            (c.tags || []).some((t) => t.toLowerCase().includes(text))
          ) {
            results.push({ card: c, path: newPath });
          }
        });
      }
      if (node.subdomains) recurse(node.subdomains, newPath);
    }
  }
  recurse(knowledgeBase, []);
  foldersEl.innerHTML = "";
  cardsEl.innerHTML = "";
  breadcrumbEl.innerHTML = "";
  currentPathLabel.textContent = "Search results";
  results.forEach((r) => {
    const fc = document.createElement("div");
    fc.className = "flashcard";
    const inner = document.createElement("div");
    inner.className = "flashcard-inner";
    const front = document.createElement("div");
    front.className = "front";
    front.textContent = r.card.question + " — " + r.path.join(" › ");
    const back = document.createElement("div");
    back.className = "back";
    back.textContent = r.card.answer;
    inner.appendChild(front);
    inner.appendChild(back);
    fc.appendChild(inner);
    fc.addEventListener("click", () => fc.classList.toggle("flip"));
    cardsEl.appendChild(fc);
  });
});

function mergeTrees(target, source) {
  for (const key in source) {
    if (!target[key]) {
      // If the branch doesn’t exist, copy it entirely
      target[key] = source[key];
    } else {
      // Merge subdomains recursively
      if (source[key].subdomains) {
        target[key].subdomains = target[key].subdomains || {};
        mergeTrees(target[key].subdomains, source[key].subdomains);
      }
      // Merge cards, avoid duplicates (optional)
      target[key].cards = target[key].cards || [];
      if (source[key].cards) {
        source[key].cards.forEach((c) => {
          // simple duplicate check by question text
          if (!target[key].cards.some((tc) => tc.question === c.question)) {
            target[key].cards.push(c);
          }
        });
      }
    }
  }
}

// Export the full knowledge base as JSON
exportBtn.addEventListener("click", () => {
  const data = knowledgeBase; // use the nested structure
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "knowledge_tree.json";
  a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener("click", () => importFile.click());

importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);
      mergeTrees(knowledgeBase, importedData); // merge instead of replace
      renderAll();
      alert("Knowledge tree merged successfully!");
    } catch (err) {
      alert("Invalid JSON file.");
      console.error(err);
    }
  };
  reader.readAsText(file);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("searchBar").value = "";
    renderAll();
  }
});

// ------------------ Initial render ------------------
if (Object.keys(knowledgeBase).length === 0) knowledgeBase = SAMPLE;
renderAll();
