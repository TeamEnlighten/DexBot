const Discord = require("discord.js")

module.exports = {
    category: 'Other',
    description: 'Replies with Pong.',
    slash: true,
    testOnly: false,

    callback: ({interaction}) => {
        const embed = new Discord.MessageEmbed()
            .setDescription(`Pong! - ${Date.now() - interaction.createdTimestamp}ms.`)
            .setTitle('🏓 Ping! 🏓')
            .setColor('WHITE')
        return embed
    },
} 