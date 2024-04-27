const { Router } = require('express');
const apiRouterController = require('../controllers/apiRouterController')
const updateController = require("../controllers/updateController");

const router = Router();

try{
    router.get('/allAccounts', apiRouterController.account_list)
}catch (e) {
    console.log(e)
}

try {
    router.get('/update', updateController.updateAllAccounts)
}catch (e) {
    console.log(e)
}
module.exports = router