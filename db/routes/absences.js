const express = require('express');
const router = express.Router();
const AbsenceCtrl = require('../controlers/absences');

router.post('/', AbsenceCtrl.createAbsence);
// router.get('/:id', AbsenceCtrl.getOneAbsence);
router.get('/:idEleve', AbsenceCtrl.getAbsencesEleve);
router.get('/', AbsenceCtrl.getAllAbsences);
router.put('/:id', AbsenceCtrl.putAbsence);
router.delete('/:id', AbsenceCtrl.delAbsence);

module.exports = router;