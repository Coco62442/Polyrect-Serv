const express = require('express');
const router = express.Router();
const MatCtrl = require('../controlers/matieres');

router.post('/', MatCtrl.createMat);
router.get('/:idProf', MatCtrl.getOneMat);
router.get('/', MatCtrl.getAllMats);
router.put('/:id', MatCtrl.putMat);
router.delete('/:id', MatCtrl.delMat);

module.exports = router;