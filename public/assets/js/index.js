let activeNote = {};

const show = (elem) => {
  elem.style.display = 'inline';
};

const hide = (elem) => {
  elem.style.display = 'none';
};

const getNotes = () => fetch('/api/notes', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

const saveNote = (note) => fetch('/api/notes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(note),
});

const deleteNote = (id) => fetch(`/api/notes/${id}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
});

const renderActiveNote = () => {
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('.save-note');
  const newNoteBtn = document.querySelector('.new-note');
  const clearBtn = document.querySelector('.clear-btn');

  hide(saveNoteBtn);
  hide(clearBtn);
  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
    show(newNoteBtn);
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
    hide(newNoteBtn);
  }
};

const handleNoteSave = async () => {
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  const response = await saveNote(newNote);
  if (response.ok) {
    await getAndRenderNotes();
    renderActiveNote();
  } else {
    console.error('Failed to save the note.');
  }
};

const handleNoteView = (e) => {
  const parentLi = e.target.closest('.list-group-item');
  if (parentLi) {
    activeNote = JSON.parse(parentLi.dataset.note);
    renderActiveNote();
  }
};

const handleNoteDelete = async (e, id) => {
  e.stopPropagation();
  await deleteNote(id);
  await getAndRenderNotes();
};

const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

const renderNoteList = async (notesResponse) => {
  const noteList = document.querySelector('.list-container .list-group');
  let jsonNotes = await notesResponse.json();
  noteList.innerHTML = '';
  jsonNotes.forEach((note) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.dataset.note = JSON.stringify(note);
    liEl.dataset.noteId = note.id;

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = note.title; // Display only the note title in the list
    liEl.appendChild(spanEl);

    const delBtnEl = document.createElement('i');
    delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
    delBtnEl.addEventListener('click', (e) => handleNoteDelete(e, note.id));
    liEl.appendChild(delBtnEl);

    noteList.appendChild(liEl);
  });
};

const getAndRenderNotes = () => getNotes().then(renderNoteList);

const checkSaveButtonVisibility = () => {
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('.save-note');
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('.save-note');
  const newNoteBtn = document.querySelector('.new-note');
  const clearBtn = document.querySelector('.clear-btn');

  noteTitle.addEventListener('keyup', checkSaveButtonVisibility);
  noteText.addEventListener('keyup', checkSaveButtonVisibility);

  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', handleNewNoteView);

  getAndRenderNotes();
});
