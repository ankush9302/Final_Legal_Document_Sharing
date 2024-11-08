const express = require('express');
const router = express.Router();
const subadminController = require('../controllers/subadminController');

router.get('/all', subadminController.getAllSubadmins);
router.get('/unverified', subadminController.getUnverifiedSubadmins);
router.put('/:id/approve', subadminController.approveSubadmin);
router.delete('/:id', subadminController.deleteSubadmin);
router.put('/:id/cities', subadminController.updateSubadminCities);

module.exports = router;
