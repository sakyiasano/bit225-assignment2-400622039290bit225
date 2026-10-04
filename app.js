// BlueLib Catalogue - BIT225 Assignment 2
// The application uses a JavaScript array as the temporary book data store.
// The interface is rendered dynamically and responds to user actions.

const books = [
    {
        id: 1,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "IT",
        copies: 5
    },
    {
        id: 2,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "IT",
        copies: 3
    },
    {
        id: 3,
        title: "The Lean Startup",
        author: "Eric Ries",
        category: "Business",
        copies: 4
    },
    {
        id: 4,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Business",
        copies: 6
    },
    {
        id: 5,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        category: "Science",
        copies: 2
    },
    {
        id: 6,
        title: "The Story of Art",
        author: "E. H. Gombrich",
        category: "Arts",
        copies: 3
    }
];

const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const bookForm = document.getElementById("book-form");
const formMessage = document.getElementById("form-message");
const emptyMessage = document.getElementById("empty-message");
const bookCount = document.getElementById("book-count");

function renderBooks() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredBooks = books.filter((book) => {
        const matchesTitle = book.title.toLowerCase().includes(searchTerm);
        const matchesCategory =
            selectedCategory === "All" || book.category === selectedCategory;

        return matchesTitle && matchesCategory;
    });

    bookList.innerHTML = "";

    filteredBooks.forEach((book) => {
        const card = document.createElement("article");
        card.className = "book-card";

        const stockText = book.copies === 0
            ? '<span class="out-of-stock">Out of stock</span>'
            : `${book.copies} ${book.copies === 1 ? "copy" : "copies"}`;

        card.innerHTML = `
            <h3>${escapeHTML(book.title)}</h3>
            <p class="book-author">by ${escapeHTML(book.author)}</p>
            <div class="book-meta">
                <div class="meta-item">
                    <span class="meta-label">Category</span>
                    <span class="meta-value">${escapeHTML(book.category)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Copies</span>
                    <span class="meta-value">${stockText}</span>
                </div>
            </div>
            <button
                type="button"
                class="borrow-button"
                data-id="${book.id}"
                ${book.copies === 0 ? "disabled" : ""}
            >
                ${book.copies === 0 ? "Out of stock" : "Borrow"}
            </button>
        `;

        bookList.appendChild(card);
    });

    bookCount.textContent = `${filteredBooks.length} book${filteredBooks.length === 1 ? "" : "s"} shown`;
    emptyMessage.hidden = filteredBooks.length !== 0;
}

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

function validateBook(title, author, category, copies) {
    if (!title || !author || !category || copies === "") {
        return "Please fill in all fields.";
    }

    const copiesNumber = Number(copies);

    if (!Number.isInteger(copiesNumber) || copiesNumber < 0) {
        return "Copies Available must be a whole number of 0 or more.";
    }

    return "";
}

bookList.addEventListener("click", (event) => {
    const button = event.target.closest(".borrow-button");

    if (!button) {
        return;
    }

    const bookId = Number(button.dataset.id);
    const book = books.find((item) => item.id === bookId);

    if (!book || book.copies <= 0) {
        return;
    }

    book.copies -= 1;
    renderBooks();
});

searchInput.addEventListener("input", renderBooks);
categoryFilter.addEventListener("change", renderBooks);

bookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value;
    const copies = document.getElementById("copies").value.trim();

    const error = validateBook(title, author, category, copies);

    if (error) {
        showFormMessage(error, "error");
        return;
    }

    books.push({
        id: Date.now(),
        title,
        author,
        category,
        copies: Number(copies)
    });

    bookForm.reset();
    showFormMessage("Book added successfully.", "success");
    renderBooks();
});

// Initial page render.
renderBooks();
