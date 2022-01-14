const Discord = require('discord.js')

module.exports = {
    category: 'Other',
    description: "Displays all commands.",
    slash: true,
    testOnly: false,
    callback: ({interaction }) => {

        const embed = new Discord.MessageEmbed()
        .setTitle('Command Menu')
        .setColor('WHITE')
        .addFields(
            { name: '__Ability__', value: '**Description:** Shows info on a Pokemon Ability\n**Syntax:** <Pokemon Ability>', inline: false },
            { name: '__Analyze__', value: '**Description:** Analyzes Pokemon Showdown replays\n**Syntax:** <Replay Link>', inline: false },
            { name: '__Credits__', value: `**Description:** Provide list of Credits\n**Syntax:** N/A`, inline: false},
            { name: '__Dex__', value: `**Description:** Shows a PokeDex entry\n**Syntax:** <Pokemon Name or Number>`, inline: false },
            { name: '__Generate__', value: '**Description:** Generates a Random Team\n**Syntax:** N/A', inline: false },
            { name: '__Item__', value: `**Description:** Shows info on a Pokemon Items\n**Syntax:** <Pokemon Item>`, inline: false},
            { name: '__Move__', value: `**Description:** Shows info on a Pokemon Move\n**Syntax:** <Pokemon Move>`, inline: false },
            { name: '__Random__', value: '**Description:** Shows info on a random pokemon\n**Syntax:** N/A', inline: false },
            { name: '__Sprite__', value: `**Description:** Sprite image of a Pokémon\n**Syntax:** <pokemon name> <shiny> <back> <female> <ani/noani> <afd>`, inline: false},
            { name: '__Type__', value: `**Description:** Shows info on a Pokemon Weaknesses\n**Syntax:** <Type 1> <Type 2>`, inline: false },
            { name: '__Weakness__', value: '**Description:** Shows info on a Pokemon Weakness\n**Syntax:** <Type 1> <Type 2>', inline: false },
        )
        //.setDescription(reply)

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        }) 
    }
}