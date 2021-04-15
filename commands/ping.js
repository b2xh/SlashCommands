
const { Integration, Client } = require('discord.js')
const guildData = require('../models/guild');

/**
 * Discord application interaction
 * @param {Integration} interaction
 * Discord application client
 * @param {Client} client
 */


module.exports = {
    config: {
        name: "ping",
        description: "Indicates the delay time of the bot.",
        options: null
    },

    run: async (interaction, client) => {
        try {
            await sendMessage(interaction, `Pong **${client.ws.ping}ms**`)
        } catch (error) {
            console.log(error)
        }
    }
}