
const functions = require('../controllerFunctions/apiRouterControllerFunctions')
const asyncHandler = require('express-async-handler')


exports.account_list = asyncHandler( async (req, res, next) => {
    const temp = await functions.giveAllAccounts()
    res.status(200).json(temp)
})