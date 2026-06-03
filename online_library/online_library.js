const title = document.getElementById('title');
const author = document.getElementById('author');
const year = document.getElementById('year');
const language = document.getElementById('language');
const genre = document.getElementById('genre');
const bookList = document.getElementById('book-list');
const btn = document.querySelector('.btn');

let editingRow = null;

btn.addEventListener("click", function (e) {
    e.preventDefault();

    if (title.value == "" && author.value == "" && year.value == "" && language.value == "" && genre.value == "") {
        alert("Fill the form");
        return;
    }

    if (editingRow) {
        // UPDATE
        const divs = editingRow.querySelectorAll('div.cell');
        divs[0].textContent = title.value;
        divs[1].textContent = author.value;
        divs[2].textContent = year.value;
        divs[3].textContent = language.value;
        divs[4].textContent = genre.value;

        editingRow = null;
        btn.textContent = "Add Book";
        saveBooks();
        clearForm();

    } else {
        // CREATE

        const newRow = createRow(title.value, author.value, year.value, language.value, genre.value);
        bookList.appendChild(newRow);
        saveBooks();
        clearForm();

    }
});

function createRow(t, a, y, l, g) {
    const newRow = document.createElement('section');

    const fields = [t, a, y, l, g];
    fields.forEach(val => {
        const div = document.createElement('div');
        div.classList.add('cell');
        div.textContent = val;
        newRow.appendChild(div);
    });

    const actions = document.createElement('div');
    actions.classList.add('actions');


    // READ checkbox
    const readLabel = document.createElement('label');
    readLabel.classList.add('read-label');

        const readCheckbox = document.createElement('input');
    readCheckbox.type = 'checkbox';
    readCheckbox.classList.add('read-checkbox');

    const toggleTrack = document.createElement('div');
    toggleTrack.classList.add('toggle-track');

    const readText = document.createElement('span');
    readText.textContent = 'Read';

    readCheckbox.addEventListener('change', () => {
    newRow.classList.toggle('row-read', readCheckbox.checked);
    saveBooks();
});

readLabel.appendChild(readCheckbox);
readLabel.appendChild(toggleTrack);
readLabel.appendChild(readText);


    // EDIT button
    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.classList.add('action-btn', 'edit-btn');
    editBtn.addEventListener('click', () => {
        const divs = newRow.querySelectorAll('div.cell');
        title.value    = divs[0].textContent;
        author.value   = divs[1].textContent;
        year.value     = divs[2].textContent;
        language.value = divs[3].textContent;
        genre.value    = divs[4].textContent;

        editingRow = newRow;
        btn.textContent = "Update Book";
    });

    // DELETE button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add('action-btn', 'delete-btn');
    deleteBtn.addEventListener('click', () => {

        if (confirm("Delete this book?")) {
            newRow.remove();
            saveBooks();

            if (editingRow === newRow) {
                editingRow = null;
                btn.textContent = "Add Book";
                clearForm();
            }
        }
    });

    actions.appendChild(readLabel);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    newRow.appendChild(actions);

    return newRow;
}

function clearForm() {
    title.value = "";
    author.value = "";
    year.value = "";
    language.value = "";
    genre.value = "";
}

// Close modal
document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

function saveBooks() {
    const rows = bookList.querySelectorAll('section');
    const books = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll('.cell');
        books.push({
            title:    cells[0].textContent,
            author:   cells[1].textContent,
            year:     cells[2].textContent,
            language: cells[3].textContent,
            genre:    cells[4].textContent,
            read:     row.classList.contains('row-read')
        });
    });
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooks() {
    const saved = localStorage.getItem('books');
    if (!saved) return;
    const books = JSON.parse(saved);
    books.forEach(book => {
        const row = createRow(book.title, book.author, book.year, book.language, book.genre);
        if (book.read) {
            row.classList.add('row-read');
            row.querySelector('.read-checkbox').checked = true;
        }
        bookList.appendChild(row);
    });
}

loadBooks();