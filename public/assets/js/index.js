document.addEventListener('DOMContentLoaded', function() {
  const show = (elem) => {
    elem.style.display = 'inline';
  };

  const hide = (elem) => {
    elem.style.display = 'none';
  };

  let noteForm = document.querySelector('.note-form');
  let noteTitle = document.querySelector('.note-title');
  let noteText = document.querySelector('.note-textarea');
  let saveNoteBtn = document.querySelector('.save-note');
  let newNoteBtn = document.querySelector('.new-note');
  let clearBtn = document.querySelector('.clear-btn');
  let noteList = document.querySelector('.list-container .list-group'); // Use single container

  const checkSaveButtonVisibility = () => {
    if (!noteTitle.value.trim() && !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  };

  checkSaveButtonVisibility();
  show(newNoteBtn);
  show(clearBtn);

  let activeNote = {};

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
    if (activeNote.id) {
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
    }
    checkSaveButtonVisibility();
  };

  const handleNoteSave = async () => {
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

  // Adjusted for event delegation
  noteList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-note')) {
      const noteId = e.target.parentElement.getAttribute('data-note-id');
      await deleteNote(noteId);
      await getAndRenderNotes();
    }
  });

  const handleNoteView = (e) => {
    e.preventDefault();
    const noteId = e.target.parentElement.getAttribute('data-note-id');
    const selectedNote = Array.from(noteList.children).find(note => note.getAttribute('data-note-id') === noteId);
    if (selectedNote) {
      activeNote = JSON.parse(selectedNote.getAttribute('data-note'));
      renderActiveNote();
    }
  };

  const handleNewNoteView = () => {
    activeNote = {};
    renderActiveNote();
  };

  noteTitle.addEventListener('keyup', checkSaveButtonVisibility);
  noteText.addEventListener('keyup', checkSaveButtonVisibility);

  const renderNoteList = async (notesResponse) => {
    let jsonNotes = await notesResponse.json();
    noteList.innerHTML = '';
    jsonNotes.forEach((note) => {
      const liEl = document.createElement('li');
      liEl.classList.add('list-group-item');
      liEl.setAttribute('data-note-id', note.id); // Important for deletion and viewing
      liEl.setAttribute('data-note', JSON.stringify(note)); // Storing entire note for easy retrieval

      const spanEl = document.createElement('span');
      spanEl.classList.add('list-item-title');
      spanEl.innerText = note.title;

      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');

      liEl.append(spanEl);
      liEl.append(delBtnEl);

      noteList.append(liEl);
    });
  };

  const getAndRenderNotes = () => getNotes().then(renderNoteList);

  if (window.location.pathname.includes('/notes')) {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    clearBtn.addEventListener('click', handleNewNoteView); // Consider adding specific functionality to clear the form
    getAndRenderNotes();
  }
});
