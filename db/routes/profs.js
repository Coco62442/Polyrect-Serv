const express = require('express');
const router = express.Router();
const ProfCtrl = require('../controlers/profs');

router.post('/', ProfCtrl.createProf);
router.post('/login', ProfCtrl.loginProf);
router.get('/:id', ProfCtrl.getOneProf);
router.get('/', ProfCtrl.getAllProfs);
router.put('/:id', ProfCtrl.putProf);
router.delete('/:id', ProfCtrl.delProf);

module.exports = router;