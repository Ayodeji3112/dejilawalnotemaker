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
  noteList.innerHTML = '';  // Clears the current list

  jsonNotes.forEach((note) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    const noteText = document.createElement('span');
    noteText.classList.add('note-text-content');

    // Clean the title and text, making sure it's a string and trim it.
    const trimmedTitle = note.title && typeof note.title === 'string' ? note.title.trim() : '';
    const trimmedText = note.text && typeof note.text === 'string' ? note.text.trim() : '';

    // Set the text content only if both title and text are present
    if (trimmedTitle && trimmedText) {
      noteText.textContent = `${trimmedTitle} ${trimmedText}`;
    }

    // Append the note text to the list item only if we have set its text content
    if (noteText.textContent) {
      liEl.appendChild(noteText);

      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add('fas', 'fa-trash-alt', 'ml-auto', 'delete-note');
      delBtnEl.addEventListener('click', (e) => handleNoteDelete(e, note.id));
      liEl.appendChild(delBtnEl);

      noteList.appendChild(liEl);
    }
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


function updateSaveButtonVisibility() {
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('.save-note');


  document.addEventListener('DOMContentLoaded', () => {
    const noteTitle = document.querySelector('.note-title');
    const noteText = document.querySelector('.note-textarea');
  
    // Event listeners for input fields
    noteTitle.addEventListener('input', updateSaveButtonVisibility);
    noteText.addEventListener('input', updateSaveButtonVisibility);
  
    // Call the function on page load to set the initial state of the save button
    updateSaveButtonVisibility();
  });

  if (noteTitle.value.trim() || noteText.value.trim()) {
    show(saveNoteBtn);
  } else {
    saveNoteBtn.style.display = 'none'; // Hide if there's no input.
  }
}





document.addEventListener('DOMContentLoaded', function() {
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('.save-note');
  const newNoteBtn = document.querySelector('.new-note');
  const clearBtn = document.querySelector('.clear-btn');
  const clearNoteBtn = document.querySelector('.clear-note');


  noteTitle.addEventListener('keyup', checkSaveButtonVisibility);
  noteText.addEventListener('keyup', checkSaveButtonVisibility);
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', handleNewNoteView);

  getAndRenderNotes();
});





