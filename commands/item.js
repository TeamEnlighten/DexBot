const {Dex} = require('pokemon-showdown');
const Discord = require('discord.js')

module.exports = {
    category: 'Pokedex',
    description: "Shows info on a Pokemon Items",
    minArgs: 1,
    expectedArgs: "<Pokemon Item>",
    slash: true,
    testOnly: false,
    ephemeral: false,
    options: [
        {
            name: 'item',
            description: 'Pokemon Item',
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING  
        },
    ],

    callback: ({interaction}) => { 

        let item = interaction.options.getString('item')    
        const dexItems = Dex.items.all()
        //console.log(dexItems)

        if (item >= 1 && item <= 1229) {
            let no = `${item}`
            var filtered = dexItems.filter(function(item) {
                return no.indexOf(item.num) !== -1 && item.num == `${no}`;
            });

        } else if (item < 0 || item > 1229) {
            interaction.reply({
                content: 'Please enter a valid item number!',
                ephemeral: true,
            });
            return;

        } else if (!Number.isInteger(item)) {

            let convert = ''
            let str = item.split("-") 
                if (str.length === 1) {
                    let str2 = item.split(" ")
                    convert = str2
                } else {convert = str}
            const newID = convert.join("").toLowerCase()
               
            var filtered = dexItems.filter(function(item) {
                return newID.indexOf(item.id) !== -1 && item.id == `${newID}`;
            });
        }

        let result = filtered.shift()

        //console.log(result)

                if (result === undefined) {
                    interaction.reply({
                        content: 'please enter a valid item!'
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
                let str = name.toLowerCase()
                let str2 = str.split(" ")
                let sprite = str2.join("-")

            let num = result.num
            let desc = result.desc
            let gen = result.gen
    
            let icon = `https://img.pokemondb.net/sprites/items/${sprite}.png` 
                if (name.slice(0, 2) === 'TR') {
                    icon = `https://img.pokemondb.net/sprites/items/tm-normal.png` 
                }
            const embed = new Discord.MessageEmbed()
                .setAuthor(`No. ${num}`, `${icon}`)
                .setTitle(`${name}`)
                .setColor('#ff0000')
                .setDescription(`${desc}`)
                .addFields(
                    //{ name: 'No.', value: `#️⃣ ${num}`, inline: true },
                    //{ name: 'Rating', value: `🏆 ${rating}`, inline: true },
                    { name: 'Generation', value: `<:Pokeball:902821712490536970> ${gen}`, inline: true },
                )
                .setFooter(`Info missing? Please report to enlighten.`, `https://i.imgur.com/TSTyfLb.png`)
    
            interaction.reply({
                embeds: [embed],
                ephemeral: false,
            })  
    }
}