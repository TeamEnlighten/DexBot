const {Dex} = require('pokemon-showdown');
const Discord = require('discord.js')
const emojis = [{
    type: 'Rock', emoji: '<:Rock:862271572387430411>'}, 
    {type:'Psychic', emoji: '<:Psychic:862271574430187560>'},
    {type:'Poison', emoji: '<:Poison:862271574492315648>'},
    {type:'Normal', emoji: '<:Normal:862271574526132234>'},
    {type:'Ice', emoji: '<:Ice:862271573191557140>'},
    {type:'Ground', emoji: '<:Ground:862271572899135508>'},
    {type:'Grass', emoji: '<:Grass:862271574497558578>'},
    {type:'Ghost', emoji: '<:Ghost:862271574484189215>'},
    {type:'Flying', emoji: '<:Flying:862271574580133888>'},
    {type:'Fire', emoji: '<:Fire:862271574689579048>'},
    {type:'Fighting', emoji: '<:Fighting:862271574417080341>'},
    {type:'Fairy', emoji: '<:Fairy:862271574686040074>'},
    {type:'Electric', emoji: '<:Electric:862271574647373854>'},
    {type:'Dragon', emoji: '<:Dragon:862271574816063508>'},
    {type:'Dark', emoji: '<:Dark:862271127014604800>'},
    {type:'Bug', emoji: '<:Bug:862271574660874260>'},
    {type:'Water', emoji: '<:Water:862271572201701406>'},
    {type: 'Bird', emoji: '🐦'},
    {type:'Steel', emoji: '<:Steel:862271572470923274>'
}];

module.exports = {
    category: 'Pokedex',
    description: "Shows info on a Pokemon Move",
    minArgs: 1,
    expectedArgs: "<Pokemon Move>",
    slash: true,
    testOnly: false,
    ephemeral: false,
    options: [
        {
            name: 'move',
            description: 'Pokemon Move',
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING  
        },
    ],

    callback: ({interaction}) => { 

        let move = interaction.options.getString('move')    
        const dexMoves = Dex.moves.all()

        if (move >= 1 && move <= 1000) {
            let no = `${move}`
            var filtered = dexMoves.filter(function(item) {
                return no.indexOf(item.num) !== -1 && item.num == `${no}`;
            });

        } else if (move < 0 || move >= 1001) {
            interaction.reply({
                content: 'Please enter a valid move number!',
                ephemeral: true,
            });
            return;

        } else if (!Number.isInteger(move)) {

            let convert = ''
            let str = move.split("-") 
                if (str.length === 1) {
                    let str2 = move.split(" ")
                    convert = str2
                } else {convert = str}
            const newID = convert.join("").toLowerCase()

            //console.log(newID)
               
            var filtered = dexMoves.filter(function(item) {
                return newID.indexOf(item.id) !== -1 && item.id == `${newID}`;
            });
        }

        let result = filtered.shift()

                if (result === undefined) {
                    interaction.reply({
                        content: 'please enter a valid move!'
                    });

                    return;
                }

        //console.log(result)

        let exists = result.exists

            if (exists === false) {
                interaction.reply({
                    content: 'This move does not Exist!'
                });
            }

        let name = result.name
        let num = result.num
        let acc = result.accuracy
            if (!Number.isInteger(acc)) {
                acc = 'N/A'
            }
        let bp = result.basePower
        let category = result.category
            if (category === 'Special') {
                cat = 'https://cdn.discordapp.com/emojis/902815022240104459.png' //<:Special:902815022240104459>'
            } else if (category === 'Physical') {
                cat = 'https://cdn.discordapp.com/emojis/902814986731155506.png' //'<:Physical:902814986731155506>'
            } else {
                cat = 'https://cdn.discordapp.com/emojis/902815057543577640.png' //'<:Status:902815057543577640>'
            }

        let pp = result.pp
        let prior = result.priority
        let desc = result.desc
        let type = result.type
            str = `${type}`
            pokeT = str.split(",");
            TYPE1 = pokeT[0]
            TYPE2 = pokeT[1]

            var res1 = []
                emojis.filter((obj) => {
                    Object.keys(obj).forEach((key) => {
                        if (obj[key].toString().indexOf(`${TYPE1}`) !== -1 ) {
                        res1.push(obj)
                        }
                    })
                })

            let res2 = res1.shift()
            let TYPE3 = res2.emoji

            if (TYPE2 === undefined) {
            type = (TYPE3 + ' ' + TYPE1)
            } else { 
            var res3 = []
                emojis.filter((obj) => {
                    Object.keys(obj).forEach((key) => {
                        if (obj[key].toString().indexOf(`${TYPE2}`) !== -1 ) {
                    res3.push(obj)
                        }
                    })
                })

            let res4 = res3.shift()
            let TYPE4 = res4.emoji
            type = (TYPE3 + ' ' + TYPE1 + '\n' + TYPE4 + ' ' + TYPE2)
          }

        let gen = result.gen

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${category} - No. ${num}`, `${cat}`)
            .setTitle(`${name}`)
            .setColor('#ff0000')
            .setDescription(`${desc}`)
            .addFields(
                { name: 'Type', value: `${type}`, inline: true },
                { name: 'Accuracy', value: `🎯 ${acc}`, inline: true },
                { name: 'PP', value: `<:PPup:902822909301641268> ${pp}`, inline: true},
                { name: 'Base Power', value: `💥 ${bp}`, inline: true },
                { name: 'Priority', value: `🔰 ${prior}`, inline: true },
                { name: 'Generation', value: `<:Pokeball:902821712490536970> ${gen}`, inline: true },
            )
            .setFooter(`Info missing? Please report to enlighten.`, `https://i.imgur.com/TSTyfLb.png`)

        interaction.reply({
            embeds: [embed],
            ephemeral: false,
        })  
    }
}