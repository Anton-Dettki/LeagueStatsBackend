const { Schema, model } = require('mongoose')
require('dotenv').config();


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
    lastUpdate: Date,
    assistsTotal: Number,
    assistsThisWeek: Number

})
const collection = process.env.COLLECTION
const Account = model(collection, AccountSchema) //Account

module.exports = Account