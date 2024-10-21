const functions = require('../controllerFunctions/apiRouterControllerFunctions')
const account = require('../models/account')

/**
 * @typedef {Object} SummonerData
 * @property {string} id
 * @property {string} accountId
 * @property {string} puuid
 * @property {number} profileIconId
 * @property {number} revisionDate
 * @property {number} summonerLevel
 */

const axios = require('axios')

async function updateAllAccounts(){

    const accountList = await functions.giveAllAccounts()

    for(let i = 0; i < accountList.length; i++){
        await updateWinLoss(accountList[i].summonerId, "RANKED_SOLO_5x5")
        await updateTotalKillsAndDeaths(accountList[i].puuid, "RANKED_SOLO_5x5")
        await updateProfileIconIdandLevel(accountList[i].puuid)
    }

    const accountListNew = await functions.giveAllAccounts()
    return accountListNew
}

//TODO Add sorting by queue
async function updateTotalKillsAndDeaths(puuid, queueId) {
    const now = new Date()
    const acc = await account.find({puuid: puuid})
    const lastUpdateTime = Math.floor(acc[0].lastUpdate / 1000)
    const newUpdateTime = Math.floor(now.getTime() / 1000)
    if (lastUpdateTime <= newUpdateTime) { //TODO
        const allMatches = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${lastUpdateTime}&start=0&count=100&api_key=${process.env.RIOT_KEY}`)
        if (allMatches.data !== null) {
            for (let i = 0; i < allMatches.data.length; i++) {
                setTimeout(() => 150)
                const match = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${allMatches.data[i]}/?api_key=${process.env.RIOT_KEY}`)
                if ( match === null ) return
                const accountMatchData = match.data.info.participants.filter((participant) => participant.summonerId == acc[0].summonerId)
                if(accountMatchData === null) return

                kills = accountMatchData[i].kills
                deaths = accountMatchData[i].deaths
                assists = accountMatchData[i].assists

                await account.updateOne({puuid: puuid}, {$inc:{
                        killsTotal: kills,
                        deathsTotal: deaths,
                        assistsTotal: assists,
                    },
                    lastUpdate: newUpdateTime * 1000} )
            }
        }
    }
}
async function updateWeeklyStats(){

}

async function updateProfileIconIdandLevel(puuid){
    const acc = await account.find({puuid: puuid})

    const summoner = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${acc[0].puuid}?api_key=${process.env.RIOT_KEY}`)

    await account.updateOne( { puuid: puuid }, {
        profileIconId: summoner.data.profileIconId,
        level: summoner.data.summonerLevel
    })
}

async function updateWinLoss(summonerId, queueType){

    const resp = await axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${process.env.RIOT_KEY}`)
    const data = resp.data

    for (let i = 0; i < data.length; i++){
        if(data[i].queueType == queueType){
            await account.updateOne({ summonerId: summonerId}, {$inc: {wins: data[i].wins, losses: data[i].losses}})
        }
    }

}




module.exports = {
    updateAllAccounts
}