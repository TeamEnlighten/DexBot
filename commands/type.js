const {Dex} = require('pokemon-showdown');
const Discord = require('discord.js')

module.exports = {
    category: 'Pokedex',
    description: "Shows info on a Pokemon Weaknesses",
    minArgs: 1,
    expectedArgs: "<Type 1> <Type 2>",
    slash: true,
    testOnly: false,
    ephemeral: false,
    options: [
        {
            name: 'type1',
            description: 'Pokemon Mono Type',
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                {value: 'bug', name: 'Bug'}, 
                {value: 'dragon', name: 'Dragon'},
                {value: 'electric', name: 'Electric'},
                {value: 'flying', name: 'Flying'},
                {value: 'fire', name: 'Fire'},
                {value: 'grass', name: 'Grass'},
                {value: 'fighting', name: 'Fighting'},
                {value: 'ghost', name: 'Ghost'},
                {value: 'ground', name: 'Ground'},
                {value: 'poison', name: 'Poison'},
                {value: 'psychic', name: 'Psychic'},
                {value: 'steel', name: 'Steel'},
                {value: 'dark', name: 'Dark'},
                {value: 'water', name: 'Water'},
                {value: 'fairy', name: 'Fairy'},
                {value: 'normal', name: 'Normal'},
                {value: 'rock', name: 'Rock'},
                {value: 'ice', name: 'Ice'},
            ]  
        },
        {
            name: 'type2',
            description: 'Pokemon Dual Type',
            required: false,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                {value: 'bug', name: 'Bug'}, 
                {value: 'dragon', name: 'Dragon'},
                {value: 'electric', name: 'Electric'},
                {value: 'flying', name: 'Flying'},
                {value: 'fire', name: 'Fire'},
                {value: 'grass', name: 'Grass'},
                {value: 'fighting', name: 'Fighting'},
                {value: 'ghost', name: 'Ghost'},
                {value: 'ground', name: 'Ground'},
                {value: 'poison', name: 'Poison'},
                {value: 'psychic', name: 'Psychic'},
                {value: 'steel', name: 'Steel'},
                {value: 'dark', name: 'Dark'},
                {value: 'water', name: 'Water'},
                {value: 'fairy', name: 'Fairy'},
                {value: 'normal', name: 'Normal'},
                {value: 'rock', name: 'Rock'},
                {value: 'ice', name: 'Ice'},
            ]  
        },
    ],

    callback: ({interaction}) => { 

        const type1 = interaction.options.getString('type1')   
        const type2 = interaction.options.getString('type2')  
        const icon = 'https://cdn.discordapp.com/emojis/902838153671491604.png'   

        function capitalize(str) {
            return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
          }

        let types = Object.keys(Dex.data.TypeChart);
        let targetTyping = []
        let targetTypes = ''

            if ( type2 === null || type1 === type2) {
                targetTyping = [`${type1}`]
                let name = capitalize(type1)
                targetTypes = `${name}`
            } else { 
                targetTyping = [`${type1}`, `${type2}`] 
                let name = capitalize(type1)
                let name2 = capitalize(type2)
                targetTypes = `${name} / ${name2}` 
            }

        let sendMsg = []
        let effective = {};
        const typeChartToModifierMap = [0, 1, -1, -9];  //x1, x2, x1/2, x0
        
            for (let i = 0; i < types.length; i++) {
            effective[types[i]] = 0;
        
            for (let j = 0; j < targetTyping.length; j++) {
                let targetKey = targetTyping[j].toLowerCase();
                let attackKey = capitalize(types[i]);
                let typeChartValue = Dex.data.TypeChart[targetKey].damageTaken[attackKey];
                effective[types[i]] += typeChartToModifierMap[typeChartValue];
            }
            effective[types[i]] = Math.max(-3, effective[types[i]]);
            sendMsg[effective[types[i]] + 4] += `\n${capitalize(types[i])}`;
            }

        let test1 = sendMsg[1]
        let split1 = ''
        let final1 = ''
          if (test1 === undefined) { final1 = ''}
            else { 
                split1 = test1.split("\n") 
                split1.shift()
                final1 = split1.join(", ")
            }

        let test2 = sendMsg[2]
        let split2 = ''
        let final2 = ''
            if (test2 === undefined) { final2 = ''}
                else { 
                    split2 = test2.split("\n") 
                    split2.shift()
                    final2 = split2.join(", ")
                }

        let test3 = sendMsg[3]
        let split3 = ''
        let final3 = ''
            if (test3 === undefined) { final3 = ''}
                else { 
                    split3 = test3.split("\n") 
                    split3.shift()
                    final3 = split3.join(", ")
                }

        let test4 = sendMsg[4]
        let split4 = ''
        let final4 = ''
            if (test4 === undefined) { final4 = ''}
                else { 
                    split4 = test4.split("\n") 
                    split4.shift()
                    final4 = split4.join(", ")
                }

        let test5 = sendMsg[5]
        let split5 = ''
        let final5 = ''
            if (test5 === undefined) { final5 = ''}
                else { 
                    split5 = test5.split("\n") 
                    split5.shift()
                    final5 = split5.join(", ")
                }

        let test6 = sendMsg[6]
        let split6 = ''
        let final6 = ''
            if (test6 === undefined) { final6 = ''}
                else { 
                    split6 = test6.split("\n") 
                    split6.shift()
                    final6 = split6.join(", ")
                }
        
        const typeFinal = `**x0.00**: ${final1}\n**x0.25**: ${final2}\n**x0.50**: ${final3}\n**x1.00**: ${final4}\n**x2.00**: ${final5}\n**x4.00**: ${final6}\n`

          const typeEmbed = new Discord.MessageEmbed()
          .setAuthor(`${targetTypes}`, `${icon}`)
          .setTitle(`Weakness List`)
          .setColor('#ff0000')
          .setDescription(`${typeFinal}`)
          .setFooter(`Info missing? Please report to enlighten.`, `https://i.imgur.com/TSTyfLb.png`)

      interaction.reply({
          embeds: [typeEmbed],
      })
    }
}