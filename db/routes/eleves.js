const express = require('express');
const router = express.Router();
const EleveCtrl = require('../controlers/eleves');

router.post('/', EleveCtrl.createEleve);
router.post('/login', EleveCtrl.loginEleve);
router.get('/:id', EleveCtrl.getOneEleve);
router.get('/', EleveCtrl.getAllEleves);
router.put('/:id', EleveCtrl.putEleve);
router.delete('/:id', EleveCtrl.delEleve);

module.exports = router;