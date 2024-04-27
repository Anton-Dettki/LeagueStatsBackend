const account = require('../models/account')

async function giveAllAccounts(){
    const accounts = await account.find()

    return accounts
}

module.exports = {
    giveAllAccounts
}