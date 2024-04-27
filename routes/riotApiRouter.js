const { Router } = require('express');
const updateController = require('../controllers/updateController')

const router = Router();

router.get('/allAccounts', updateController.updateAllAccounts)

module.exports = router