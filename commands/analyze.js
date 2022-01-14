const Discord = require('discord.js');
const axios = require("axios");
const utils = require("../utils");
const ReplayTracker = require("../tracker/ReplayTracker");

module.exports = {
    category: 'Other',
    description: "Analyzes Pokemon Showdown replays.",
    expectedArgs: '<Replay Link>',
    minArgs: 0,
    maxArgs: 1,
    slash: true,
    testOnly: false,
    ephemeral: false,
    options: [
        {
            name: 'link',
            description: 'Pokemon Showdown Replay Link',
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING  
        },
    ],

    callback: async ({interaction, args, channel}) => {
		let command = interaction.options.getString('link') 
		let test = command.slice(0, 35)
		let badlink = false
    
		if (test != "https://replay.pokemonshowdown.com/") {
			const embed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('🛑 Please send a Valid Replay Link! 🛑');
                return embed
		}

		for (let arg of args) {
			let link = arg + ".log";
			let response = await axios.get(link, {
				headers: { "User-Agent": "<FILL IN>" }, // Add something here
			}).catch(error => {
				badlink = true
			});

			if (badlink === true) {
                const embed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('🛑 404 error: Link not found. 🛑');
				return embed
			}

			let data = response.data;

			//Getting the rules
			let rulesId = await utils.findRulesId(channel.id);
			let rules = await utils.getRules(rulesId);

			let replayer = new ReplayTracker(arg, interaction, rules);
			await replayer.track(data);
		}

		interaction.reply({
			content: "Analyzing...",
			ephemeral: true,
			});
	},
};