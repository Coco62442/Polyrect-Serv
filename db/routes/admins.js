const express = require('express');
const router = express.Router();
const AdminCtrl = require('../controlers/admins');

router.post('/creer/:id', AdminCtrl.createAdmin);
router.post('/login', AdminCtrl.loginAdmin);
// router.get('/:id', AdminCtrl.getOneAdmin);
router.get('/', AdminCtrl.getAllAdmins);
router.put('/:id', AdminCtrl.putAdmin);
router.delete('/:id/:admin', AdminCtrl.delAdmin);

module.exports = router;