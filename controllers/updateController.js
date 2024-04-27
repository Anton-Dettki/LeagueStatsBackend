const account = require('../models/account')
const { account_list } = require('../controllers/apiRouterController')

const functions = require('../controllerFunctions/updateControllerFunctions')

const asyncHandler = require('express-async-handler')
const axios = require("axios");


exports.updateAllAccounts = asyncHandler( async (req, res, next)  => {
    const temp = await functions.updateAllAccounts()
    res.status(200).json(temp)
} )