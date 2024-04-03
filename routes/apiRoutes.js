// dependencies
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid'); // npm package for unique ids

// routing
module.exports = (app) => {
  // GET /api/notes should read the db.json file and return all saved notes as JSON.
  app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../db/db.json'));
  });

  // POST /api/notes to save a new note
  app.post('/api/notes', (req, res) => {
    // Read and parse existing notes
    let db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json')));

    // Create a new note with a unique ID
    let userNote = {
      title: req.body.title,
      text: req.body.text,
      id: uniqid(),
    };

    // Add the new note and write back to db.json
    db.push(userNote);
    fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(db));

    // Return the new note
    res.json(userNote);
  });

  // DELETE /api/notes/:id to delete a note
  app.delete('/api/notes/:id', (req, res) => {
    let db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json')));
    let updatedNotes = db.filter(note => note.id !== req.params.id);
    fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(updatedNotes));
    res.json({ message: 'Note deleted' });
  });
};
