const {Dex} = require('pokemon-showdown');
const Discord = require('discord.js')

module.exports = {
    category: 'Pokedex',
    description: "Shows info on a Pokemon Ability",
    minArgs: 1,
    expectedArgs: "<Pokemon Ability>",
    slash: true,
    testOnly: false,
    ephemeral: false,
    options: [
        {
            name: 'ability',
            description: 'Pokemon Ability',
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING  
        },
    ],

    callback: ({interaction}) => { 

        let ability = interaction.options.getString('ability')    
        const dexAbility = Dex.abilities.all()

        if (ability >= 1 && ability <= 267) {
            let no = `${ability}`
            var filtered = dexAbility.filter(function(item) {
                return no.indexOf(item.num) !== -1 && item.num == `${no}`;
            });

        } else if (ability < 0 || ability > 267) {
            interaction.reply({
                content: 'Please enter a valid ability number!',
                ephemeral: true,
            });
            return;

        } else if (!Number.isInteger(ability)) {

            let convert = ''
            let str = ability.split("-") 
                if (str.length === 1) {
                    let str2 = ability.split(" ")
                    convert = str2
                } else {convert = str}
            const newID = convert.join("").toLowerCase()

            var filtered = dexAbility.filter(function(item) {
                return newID.indexOf(item.id) !== -1 && item.id == `${newID}`;
            });
        }

        let result = filtered.shift()

                if (result === undefined) {
                    interaction.reply({
                        content: 'please enter a valid ability!'
                    });

                    return;
                }

        let exists = result.exists

            if (exists === false) {
                interaction.reply({
                    content: 'This ability does not Exist!'
                });
            }

        let name = result.name
        let num = result.num
        let rating = result.rating
        let desc = result.desc
        let gen = result.gen

        const icon = 'https://cdn.discordapp.com/emojis/902838153671491604.png'

        const embed = new Discord.MessageEmbed()
            .setAuthor(`No. ${num}`, `${icon}`)
            .setTitle(`${name}`)
            .setColor('#ff0000')
            .setDescription(`${desc}`)
            .addFields(
                //{ name: 'No.', value: `#️⃣ ${num}`, inline: true },
                { name: 'Rating', value: `🏆 ${rating}`, inline: true },
                { name: 'Generation', value: `<:Pokeball:902821712490536970> ${gen}`, inline: true },
            )
            .setFooter(`Info missing? Please report to enlighten.`, `https://i.imgur.com/TSTyfLb.png`)

        interaction.reply({
            embeds: [embed],
            ephemeral: false,
        })  
    }
}