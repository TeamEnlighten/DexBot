const Discord = require('discord.js')
const WOKCommands = require('wokcommands')
const path = require('path')
const config = require('./config.json')
const dotenv = require('dotenv')
dotenv.config()

const { Intents } = Discord

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ]
})

client.on('ready', async () => {
    console.log(`${client.user.tag} is ready to export Pokemon Data!`)

    const wok = new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        ignoreBots: true,
        showWarns: true,
        dbOptions: {
            keepAlive: true
        },
        mongoUri: process.env.MONGO_URI,
        testServers: ['<FILL IN>'],
        botOwners: ['<FILL IN>'],
        disabledDefaultCommands: [
            'help',
            'command',
            'language',
            'prefix',
            'slash',
            'requiredrole',
            'channelonly'
       ],
       debug: true
    })    
    
    .setDisplayName('RotomBot')
    .setCategorySettings([
        {
            name: 'Pokedex',
            emoji: '<:PokeDex:909330699650220052>' // This will not work if you use your own bot.
        },
        {
            name: 'Other',
            emoji: '🤖'
        },
        {
            name: 'Admin',
            emoji: '⚙️',
            hidden: true
        }
    ])

    wok.on('databaseConnected', async (connection, state, error) => {
        //const model = connection.models['wokcommands-slash-commands']
        //const results = await model.countDocuments()
        //console.log(`Registered slash commands: ${results}`)
        console.log(`The connection state is "${state}"`)
        console.log(`Error message: ${error}`)
    })


    if (config.activity.streaming == true) {
         client.user.setActivity(config.activity.game, {
             type:'WATCHING'
         });  
     } else { 
         client.user.setActivity(config.activity.game, {
             type: 3 
         }) //PLAYING (1), LISTENING (2), WATCHING (3)
          
     }

    
})


client.login(process.env.DISCORD_TOKEN)