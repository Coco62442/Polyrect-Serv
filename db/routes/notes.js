const express = require('express');
const router = express.Router();
const NoteCtrl = require('../controlers/notes');

router.post('/', NoteCtrl.createNote);
router.get('/', NoteCtrl.getAllNote);
router.get('/:id', NoteCtrl.getOneNote);
router.get('/note/:idEleve/:idMat', NoteCtrl.getAllNotesEleveByMatiere);
router.put('/:id', NoteCtrl.putNote);
router.delete('/:id', NoteCtrl.delNote);

module.exports = router;