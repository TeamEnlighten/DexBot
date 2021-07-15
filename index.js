const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const loadCommands = require('./commands/load-commands')

//Enable this if you are getting an Emitter Warning.
/*
const EventEmitter = require('events') 
EventEmitter.defaultMaxListeners = 50
*/

client.on('ready', async () => {
    console.log(`${client.user.tag} is sleeping on the job again...`)

    loadCommands(client)  

    client.user.setActivity('over the Pokedex Data!', { // Change the message that appears in sidebar
       type: 'WATCHING' // Set to WATCHING, LISTENING, or etc.
     })  

})

client.login(config.token)