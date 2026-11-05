Excellent questions — you’re really getting to the essence of how HTML, CSS, and JavaScript work together.
Let’s go through everything **carefully and clearly**.

---

## 🧩 1. HTML Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

This line helps your website look good on **all screen sizes** (desktop, tablet, phone).

- `name="viewport"` → tells browsers how to control the page’s size and scale.
- `content="width=device-width"` → makes the webpage’s width match the screen’s width.
- `initial-scale=1.0` → sets the default zoom level (1.0 means 100%).

Without this, your site might look zoomed-out or broken on mobile devices.

---

## 🏗️ 2. HTML Structure Tags

### `<div class="container">`

A `<div>` is a **generic container** used to group elements together for layout or styling.

- `class="container"` → gives it a **class name** so CSS can style it (`.container { ... }` in CSS).
- Classes can be reused — many elements can have the same class.

---

### `<aside>`

The `<aside>` tag usually holds **secondary content** such as sidebars, navigation menus, or ads.
In this project, the `<aside>` contains the **menu of domains** (Web, Math, Physics, etc.).

---

### `<section class="form-section">`

The `<section>` tag defines a **distinct part of the page** — here, the form for adding flashcards.

- `class="form-section"` lets CSS style this section (background, padding, etc.).

---

## 🧱 3. Common HTML Attributes

| Attribute | Meaning                                    | Example                                    | Description                                                               |
| --------- | ------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------- |
| `id`      | Unique identifier                          | `<div id="main">`                          | Each ID must be unique on the page. Used in JavaScript & CSS (`#main {}`) |
| `class`   | Reusable style or behavior group           | `<div class="card">`                       | You can apply the same class to many elements                             |
| `type`    | Defines type of element (e.g., input type) | `<input type="text">`                      | Specifies what kind of input or link it is                                |
| `rel`     | Relationship (used in links)               | `<link rel="stylesheet" href="style.css">` | Tells the browser that this link is a stylesheet                          |
| `content` | Holds metadata info                        | `<meta name="viewport" content="...">`     | Provides additional information                                           |

---

## 🎨 4. CSS File Explained (line by line overview)

Let’s break down the **style.css** piece by piece.

```css
body {
  margin: 0;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
```

- Removes default margins.
- Uses `Arial` font.
- Makes the whole body a **flex container** (flexbox layout).
- Arranges children vertically (`flex-direction: column`).
- Sets height to 100% of the viewport (`100vh`).

---

```css
header {
  background-color: #333;
  color: white;
  padding: 10px 20px;
}
```

- The top bar’s background is dark gray (`#333`).
- Text is white.
- Adds padding for spacing.

---

```css
.container {
  display: flex;
  flex: 1;
}
```

- The main container holds the sidebar, main area, and form.
- Uses flexbox again to lay them side by side.

---

```css
aside {
  background: #f4f4f4;
  width: 200px;
  padding: 10px;
  border-right: 1px solid #ddd;
}
```

- Sidebar with light gray background.
- Fixed width: 200px.
- Small padding and a vertical border.

---

```css
.flashcard {
  width: 200px;
  height: 120px;
  perspective: 1000px;
  cursor: pointer;
}
```

- Each flashcard is a 3D element that can flip.
- `perspective: 1000px;` enables 3D rotation illusion.
- Cursor changes to a pointer (clickable).

---

```css
.flashcard.flip .flashcard-inner {
  transform: rotateY(180deg);
}
```

- When the flashcard is clicked (JS toggles `.flip`), the inner part rotates 180° to show the back.

---

And so on — the rest defines colors, borders, and layout for clean, minimal cards.

---

## ⚙️ 5. JavaScript Explained

### `document.getElementById('')`

This finds an HTML element by its **ID**.

Example:

```js
const form = document.getElementById("flashcardForm");
```

→ Finds the `<form id="flashcardForm">...</form>` element so you can use it in JS.

---

### `let currentDomain = 'web';`

This keeps track of **which subject (domain)** you are currently viewing (e.g. Web, Physics).
When you click another domain in the sidebar, this variable changes.
It decides which set of flashcards to load from storage.

---

### 🔍 Now let’s explain the JS script line by line

```js
const flashcardsContainer = document.getElementById("flashcards");
const form = document.getElementById("flashcardForm");
const domainList = document.getElementById("domainList");
let currentDomain = "web";
```

- Grabs main HTML elements by their IDs.
- Keeps track of current domain.

---

```js
function loadFlashcards() {
  flashcardsContainer.innerHTML = '';
  const allCards = JSON.parse(localStorage.getItem('flashcards')) || {};
  const cards = allCards[currentDomain] || [];
```

- Clears the screen.
- Loads all flashcards saved in browser storage (`localStorage`).
- Picks only those for the current domain.

---

```js
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('flashcard');
```

- For every card, creates a `<div>` to display it.

---

```js
cardElement.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">${card.question}</div>
        <div class="flashcard-back">${card.answer}</div>
      </div>`;
```

- Builds HTML inside the card: front (question) and back (answer).

---

```js
cardElement.addEventListener("click", () => {
  cardElement.classList.toggle("flip");
});
```

- Adds a click event so that when clicked, it flips the card.

---

```js
    flashcardsContainer.appendChild(cardElement);
  });
}
```

- Adds the card to the page.

---

```js
function saveFlashcard(question, answer) {
  const allCards = JSON.parse(localStorage.getItem("flashcards")) || {};
  if (!allCards[currentDomain]) allCards[currentDomain] = [];
  allCards[currentDomain].push({ question, answer });
  localStorage.setItem("flashcards", JSON.stringify(allCards));
  loadFlashcards();
}
```

- Reads all flashcards from local storage.
- Adds the new card to the current domain.
- Saves everything back (`JSON.stringify` turns the object into a string).
- Reloads the list to show the new card.

---

```js
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const question = document.getElementById("question").value;
  const answer = document.getElementById("answer").value;
  saveFlashcard(question, answer);
  form.reset();
});
```

- Runs when the form is submitted.
- Prevents page reload (`preventDefault()`).
- Gets text from the form.
- Saves the new flashcard.
- Clears the form.

---

```js
domainList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    document
      .querySelectorAll("aside li")
      .forEach((li) => li.classList.remove("active"));
    e.target.classList.add("active");
    currentDomain = e.target.dataset.domain;
    loadFlashcards();
  }
});
```

- Detects which domain you click in the sidebar.
- Highlights it with the `.active` class.
- Updates `currentDomain`.
- Reloads flashcards for that domain.

---

```js
document.querySelector('aside li[data-domain="web"]').classList.add("active");
loadFlashcards();
```

- On page load, makes “Web” the default active domain.
- Loads its flashcards.

---

## 💾 6. Where is the data stored?

👉 **All data is stored in the browser’s `localStorage`, not in a file.**
That means:

- The data stays even after refreshing or closing the page.
- But it’s only on **your browser** — not a real JSON file on disk.

If you want to export or store the data in an actual `.json` file later, we can add an **“Export / Import”** button that lets you:

- Download your flashcards as a JSON file.
- Upload it later to restore your notes.

Would you like me to show you how to add that export/import feature next?
