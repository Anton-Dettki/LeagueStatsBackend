const functions = require('../controllerFunctions/apiRouterControllerFunctions')
const account = require('../models/account')


const axios = require('axios')

async function updateAllAccounts(){

    const accountList = await functions.giveAllAccounts()

    for(let i = 0; i < accountList.length; i++){

        await updateWinLoss(accountList[i].summonerId, "RANKED_SOLO_5x5")
        await updateTotalKillsAndDeaths(accountList[i].puuid, "RANKED_SOLO_5x5")
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

    if (lastUpdateTime <= newUpdateTime){ //TODO

        let cumKills = acc[0].killsTotal
        let cumDeaths = acc[0].deathsTotal

        const allMatches = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${lastUpdateTime}&start=0&count=100&api_key=${process.env.RIOT_KEY}`)

        if(allMatches.data) {
            for (let i = 0; i < allMatches.data.length; i++) {
                const match = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${allMatches.data[i]}/?api_key=${process.env.RIOT_KEY}`)
                const accountMatchData = match.data.info.participants.filter((participant) => participant.summonerId == acc[0].summonerId)

                for (let j = 0; j < accountMatchData.length; j++) {
                    cumKills += accountMatchData[j].kills
                    cumDeaths += accountMatchData[j].deaths
                }
            }

            await account.updateOne({puuid: puuid}, {
                killsTotal: cumKills,
                deathsTotal: cumDeaths,
                lastUpdate: newUpdateTime * 1000
            })
        }
    }
    else{
        console.log("Youre Updating too fast")
    }
}
async function updateWeeklyStats(){

}

async function updateProfileIconId(){

}

async function updateWinLoss(summonerId, queueType){

    const resp = await axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${process.env.RIOT_KEY}`)
    const data = resp.data

    for (let i = 0; i < data.length; i++){
        if(data[i].queueType == queueType){
            await account.updateOne({ summonerId: summonerId}, { wins: data[i].wins, losses: data[i].losses})
        }
    }

}




module.exports = {
    updateAllAccounts
}