const mongodb = require('mongoose')


const guildData = new mongodb.Schema({
    guildID: String,
})

module.exports = mongodb.model("guild", guildData)