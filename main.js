const booksKey = 'BOOKSHELF_APPS';
let books = [];

function saveBooks() {
  localStorage.setItem(booksKey, JSON.stringify(books));
}

function loadBooks() {
  const storedBooks = localStorage.getItem(booksKey);
  books = storedBooks ? JSON.parse(storedBooks) : [];
  books.sort((a, b) => b.id - a.id);
  renderBooks();
}

function renderBooks(filteredBooks = books) {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');
  
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';
  
  filteredBooks.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');
    bookElement.innerHTML = 
      `<h3 data-testid="bookItemTitle">${book.title}</h3>
       <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
       <p data-testid="bookItemYear">Tahun: ${book.year}</p>
       <div>
         <button data-testid="bookItemIsCompleteButton" onclick="toggleBookCompletion(${book.id})">
           ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
         </button>
         <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit Buku</button>
         <button data-testid="bookItemDeleteButton" onclick="confirmDeleteBook(${book.id})">Hapus Buku</button>
       </div>`;
    
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

function addBook(title, author, year, isComplete) {
  const book = {
    id: new Date().getTime(),
    title,
    author,
    year: Number(year),
    isComplete
  };
  books.push(book);
  saveBooks();
  renderBooks();
  
  Swal.fire({
    title: "Berhasil!",
    text: `Buku "${title}" telah ditambahkan.`,
    icon: "success",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK"
  });
}

function editBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  
  document.getElementById('editBookId').value = book.id;
  document.getElementById('editBookTitle').value = book.title;
  document.getElementById('editBookAuthor').value = book.author;
  document.getElementById('editBookYear').value = book.year;
  document.getElementById('editBookIsComplete').checked = book.isComplete;
  
  const editModal = new bootstrap.Modal(document.getElementById('editBookModal'));
  editModal.show();
}

document.getElementById('saveEditBook').addEventListener('click', function () {
  const bookId = Number(document.getElementById('editBookId').value);
  const updatedTitle = document.getElementById('editBookTitle').value;
  const updatedAuthor = document.getElementById('editBookAuthor').value;
  const updatedYear = Number(document.getElementById('editBookYear').value);
  const updatedIsComplete = document.getElementById('editBookIsComplete').checked;
  
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      title: updatedTitle,
      author: updatedAuthor,
      year: updatedYear,
      isComplete: updatedIsComplete,
    };
    
    saveBooks();
    renderBooks();
    
    const editModalElement = document.getElementById('editBookModal');
    const editModal = bootstrap.Modal.getInstance(editModalElement);
    editModal.hide();
    
    Swal.fire({
      title: "Berhasil!",
      text: `Buku "${updatedTitle}" telah diperbarui.`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK"
    });
  }
});

function toggleBookCompletion(bookId) {
  books = books.map(book => book.id === bookId ? { ...book, isComplete: !book.isComplete } : book);
  saveBooks();
  renderBooks();
}

function confirmDeleteBook(bookId) {
  const book = books.find(b => b.id === bookId);
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: `Buku "${book.title}" akan dihapus!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteBook(bookId);
      Swal.fire("Terhapus!", "Buku telah dihapus.", "success");
    }
  });
}

function deleteBook(bookId) {
  books = books.filter(book => book.id !== bookId);
  saveBooks();
  renderBooks();
}

function searchBooks() {
  const query = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
  renderBooks(filteredBooks);
}

const addBookSubmitHandler = function(event) {
  event.preventDefault();
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;
  addBook(title, author, year, isComplete);
  this.reset();
};

document.getElementById('bookForm').addEventListener('submit', addBookSubmitHandler);
document.getElementById('searchBookTitle').addEventListener('input', searchBooks);
document.addEventListener('DOMContentLoaded', loadBooks);