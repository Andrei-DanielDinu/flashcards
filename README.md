# Uomo Universale Flashcards 🧠

A lightweight, client-side **Knowledge Management System** designed for hierarchical learning. Unlike traditional flat-category flashcard apps, this tool uses a recursive tree structure (Areas → Subdomains → Cards) to mirror the interconnected nature of human knowledge.

Built with **Vanilla JavaScript**, it requires no backend, no build steps, and runs entirely in your browser using `localStorage`.

## 🌟 Key Features

*   **Hierarchical Organization:** Organize knowledge into deep, nested branches (e.g., `Physics > Mechanics > Kinematics`).
*   **3D Interactive Cards:** Flip cards with a smooth CSS 3D transform to reveal answers.
*   **Global Search:** Recursively search across all domains by question, answer, or tags.
*   **Data Portability:** 
    *   **Export:** Download your entire knowledge base as a `.json` file.
    *   **Import:** Merge external JSON files into your existing tree without losing data.
*   **Relative Path Creation:** Quickly add new branches using comma-separated paths (e.g., `Biology, Genetics, DNA`).
*   **Zero Dependencies:** Pure HTML5, CSS3, and ES6+ JavaScript. No frameworks, no tracking, no server required.

## 🚀 Live Demo & Usage

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/uomo-universale-flashcards.git
    cd uomo-universale-flashcards
    ```
2.  **Open in Browser:**
    Simply open `index.html` in any modern web browser. No installation or Node.js required.

### How to Use
*   **Navigate:** Click on **Areas** in the left sidebar or use the **Breadcrumb trail** at the top to move through your knowledge tree.
*   **Add Content:** 
    *   Use the **"Add Branch"** input to create new folders/subdomains.
    *   Use the **"Add Flashcard"** form on the right to create questions, answers, and tags.
*   **Study:** Click any card to flip it. Use the **Search Bar** in the header to find specific concepts globally.
*   **Backup:** Regularly use the **Export JSON** button to save your progress to your local machine.

## 🏗️ Technical Architecture

### Data Model
The application uses a recursive JSON object stored in `localStorage`:
```json
{
  "Physics": {
    "subdomains": {
      "Mechanics": {
        "subdomains": {},
        "cards": [
          { "question": "What is Newton's First Law?", "answer": "Inertia...", "tags": ["laws", "motion"] }
        ]
      }
    },
    "cards": []
  }
}
```

### Core Logic
*   **`getNodeNormalized(path)`:** A robust helper that traverses the tree, automatically initializing missing nodes (`subdomains` and `cards`) to prevent runtime errors during navigation.
*   **`mergeTrees(target, source)`:** A recursive function used during import to intelligently merge new data into the existing structure, avoiding duplicate cards based on question text.
*   **State Management:** The app maintains a `path` array to track the current location in the tree, re-rendering the UI (`renderAll()`) whenever the state changes.

## 🎨 Design Philosophy

*   **Physics-First:** The UI is minimal and functional, focusing on the data rather than decorative elements.
*   **Local-First:** Your data belongs to you. It never leaves your browser unless you explicitly export it.
*   **Responsive:** Uses CSS Flexbox and Grid to adapt to different screen sizes (with optimized views for desktop learning).

## 🛠️ Development & Contribution

This project is built for clarity and extensibility.

*   `index.html`: The structural skeleton.
*   `style.css`: Contains CSS variables for easy theming and 3D transform logic.
*   `scri.js`: The core logic engine handling state, rendering, and persistence.

### Potential Improvements
*   [ ] Add fuzzy search for better typo tolerance.
*   [ ] Implement an "Undo" stack for deleted branches.
*   [ ] Add mobile-specific navigation toggles for smaller screens.

## 📄 License

This project is open-source and available for personal and educational use. Feel free to fork, modify, and share.

---

> *"The universe is written in the language of mathematics."* — Galileo Galilei  
> Organize your understanding of that language, one card at a time.