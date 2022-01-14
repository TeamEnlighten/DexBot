const Discord = require('discord.js')


module.exports = {
    category: 'Other',
    description: "Provide list of Credits.",
    slash: true,
    testOnly: false,
    ephemeral: false,

    callback: ({interaction}) => {

        const embed = new Discord.MessageEmbed()
        .setTitle(`Credits`)
        .setColor('#FF80ED')
        .setDescription('Want to support the server? Visit: <#770333546593517610>')
        .addFields(
            { name: '__Coders__', value: `<@!471026063498018823>, \n<@!178451615139889153>`, inline: true },
            { name: '__Data Entry__', value: '<@484262143584239617>, \n<@478389565485219841>, \n<@795751946623385670> , \n<@!730101595550908587>,', inline: true },
            { name: '__Data Entry__', value: `\n<@!576148045314523138>, \n<@!210983971608068096>, \n<@274646385071226880>`, inline: true},
            { name: '\u200B', value: '\u200B' }
        )
        .addFields({ name: '__Font - MineCrafter__', value: `[TheLouster115](https://www.dafont.com/pokemon-classic.font)`, inline: true },
            { name: '__Worn Off Keys__', value: `[Coding Tutorials](https://github.com/AlexzanderFlores/Worn-Off-Keys-Discord-Js)`, inline: true },
            { name: '__PorygonBot__', value: `[Analyze](https://github.com/PorygonBot/bot-js)`, inline: true },
          
        )
       //.setImage(image)
        .setFooter('Thanks to everyone who helped make this bot!')
       
       interaction.reply({
           embeds: [embed],
       })
    },
}
