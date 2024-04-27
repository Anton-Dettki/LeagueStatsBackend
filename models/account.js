const { Schema, model } = require('mongoose')

const AccountSchema = new Schema({
    gameName: String,
    tagLine: String,
    KillsThisWeek: Number,
    killsTotal: Number,
    deathsThisWeek: Number,
    deathsTotal: Number,
    puuid: String,
    summonerId: String,
    profileIconId: Number,
    wins: Number,
    losses: Number,
    lastUpdate: Date

})

const Account = model('Account', AccountSchema)

module.exports = Account