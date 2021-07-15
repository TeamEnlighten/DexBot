const loadCommands = require('./load-commands')
const Discord = require('discord.js');
//const { prefix } = require('../config.json')

module.exports = {
  commands: ['help', 'h'],
  aliases: ['h'],
  description: "describes all of this bot's commands",
  callback: (message) => {

    let reply = ''
    const commands = loadCommands()

    for (const command of commands) {
      // Check for permissions
      let permissions = command.permission

      if (permissions) {
        let hasPermission = true
        if (typeof permissions === 'string') {
          permissions = [permissions]
        }

        for (const permission of permissions) {
          if (!message.member.hasPermission(permission)) {
            hasPermission = false
            break
          }
        }

        if (!hasPermission) {
          continue
        }
      }

      // Format the text
      const mainCommand =
        typeof command.commands === 'string'
          ? command.commands
          : command.commands[0]
      const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
      const { description } = command
      const {aliases} = command


     reply += `**${mainCommand}${args}**\n ${description}\n [aliases: ${aliases}]\n\n` // ${prefix} can be added here
    }

    const embed = new Discord.MessageEmbed()
    .setTitle('Help Menu')
    .setColor('RANDOM')
    .setDescription(reply)

     //message.author.send(embed)
     message.channel.send(embed)
 
  },
}
