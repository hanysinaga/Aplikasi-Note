const apiUrl = 'https://note-app-backend-wjo32sl6la-et.a.run.app/notes';
let notes = [];  // Tambahkan variabel global untuk menyimpan catatan

// Fetch and display all notes
const fetchNotes = async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();
    notes = data.data.notes;
    console.log(notes);  // Simpan catatan yang diambil dalam variabel global
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';

    if (notes.length === 0) {
        const emptyNote1 = document.createElement('div');
        emptyNote1.classList.add('no-note');
        emptyNote1.innerHTML = `
            <div class="no-notes-img"></div>
            <div class="no-note-title">
                <H1>No Notes</H1>
            </div>
        `;
        notesContainer.appendChild(emptyNote1);
    } else {
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.innerHTML = `
                <div class="note-left">
                    <div class="note-title">${note.title}</div>
                    <div class="note-body">${note.body}</div>
                    <div class="note-tags">Tags: ${note.tags.join(', ')}</div>
                </div>
                <div class="note-right">    
                    <div class="btn-edit">   
                        <button class="edit" onclick="editNoteForm('${note.id}')">Edit</button>
                    </div>
                    <div class="btn-edit">
                        <button class="delete" onclick="deleteNote('${note.id}')">Delete</button>
                    </div>
                </div>
            `;
            notesContainer.appendChild(noteElement);
        });
    }

};

// Add or update a note
const addOrUpdateNote = async (event) => {
    event.preventDefault();

    const id = document.getElementById('note-form').dataset.id;
    const title = document.getElementById('title').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
    const body = document.getElementById('body').value;

    let response;

    if (id) {
        // Update note
        response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                tags,
                body,
            }),
        });
    } else {
        // Add new note
        response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                tags,
                body,
            }),
        });
    }

    if (response.ok) {
        document.getElementById('title').value = '';
        document.getElementById('tags').value = '';
        document.getElementById('body').value = '';
        document.getElementById('note-form').dataset.id = '';
        document.getElementById('submit-button').textContent = 'Add Note';
        document.getElementById('cancel-edit-button').style.display = 'none';
        fetchNotes();
    } else {
        alert(id ? 'Failed to update note' : 'Failed to add note');
    }
};

// Delete a note
const deleteNote = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        fetchNotes();
    } else {
        alert('Failed to delete note');
    }
};

// Edit a note form
const editNoteForm = (id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
        document.getElementById('title').value = note.title;
        document.getElementById('tags').value = note.tags.join(', ');
        document.getElementById('body').value = note.body;
        document.getElementById('note-form').dataset.id = id;
        document.getElementById('submit-button').textContent = 'Update Note';
        document.getElementById('cancel-edit-button').style.display = 'inline';
    }
};

// Cancel edit
document.getElementById('cancel-edit-button').addEventListener('click', () => {
    document.getElementById('title').value = '';
    document.getElementById('tags').value = '';
    document.getElementById('body').value = '';
    document.getElementById('note-form').dataset.id = '';
    document.getElementById('submit-button').textContent = 'Add Note';
    document.getElementById('cancel-edit-button').style.display = 'none';
});

// Event listener untuk form submission
document.getElementById('note-form').addEventListener('submit', addOrUpdateNote);

// Initial fetch of notes
fetchNotes();
