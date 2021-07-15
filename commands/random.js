const {Dex} = require('pokemon-showdown');
const Discord = require('discord.js')


// If you setup a bot server or insert custom emojis, fill this out with their id
// You can also omit this altogether.


const emojis = [{
    type: 'Rock', emoji: '🪨'}, 
    {type:'Psychic', emoji: '🔮'},
    {type:'Poison', emoji: '☠️'},
    {type:'Normal', emoji: '⚪'},
    {type:'Ice', emoji: '🧊'},
    {type:'Ground', emoji: '⛰️'},
    {type:'Grass', emoji: '🌿'},
    {type:'Ghost', emoji: '👻'},
    {type:'Flying', emoji: '🕊️'},
    {type:'Fire', emoji: '🔥'},
    {type:'Fighting', emoji: '🥊'},
    {type:'Fairy', emoji: '🧚'},
    {type:'Electric', emoji: '⚡'},
    {type:'Dragon', emoji: '🐉'},
    {type:'Dark', emoji: '⚫'},
    {type:'Bug', emoji: '🐛'},
    {type:'Water', emoji: '🌊'},
    {type: 'Bird', emoji: '🐦'},
    {type:'Steel', emoji: '⚙️'
}];


module.exports = {
    commands: ['random', 'rand', 'r'],
    aliases: ['rand', 'r'],
    description: "Selects a random pokemon",
    callback: (message, arguments) => { 

        var number = Math.floor(Math.random() * 898)

        var id_filter = `${number}`;

        let result = ''

        const pokemon = Dex.species.all()

              var filtered = pokemon.filter(function(item) {
                  return id_filter.indexOf(item.num) !== -1 && item.num === number;
              });

        //get random pokemon 

        msg = message.content
        
        check = msg.split(" ")

        let random = Math.floor(Math.random() * filtered.length)

        if (check.length > 1) { 

            tiers = arguments[0]

            var filtered2 = pokemon.filter(function(item) {
                return tiers.indexOf(item.tier) !== -1 
            });

            random = Math.floor(Math.random() * filtered2.length)
            result = filtered2[random]

        } else {result = filtered[random]}


        if (result === undefined) {
            message.channel.send('Tier not found. please try again.')
            return
        }

        let name = result.name
        let ID = result.spriteid
        let ID2 = result.name.toLowerCase()
        let NUM = result.num
        let HP = result.baseStats.hp
        let ATK = result.baseStats.atk
        let DEF = result.baseStats.def
        let SPA = result.baseStats.spa
        let SPD = result.baseStats.spd
        let SPE = result.baseStats.spe
        let TYPE = result.types
            str = `${TYPE}`
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

        let TIER = result.tier
        let ABILITY = result.abilities[0]
        let HT = result.heightm
        let WT = result.weightkg
        //let DESC = result.shortDesc // TBA
        let ABILITY1 = result.abilities[1]
        let ABILITYH = result.abilities['H']

        if (ABILITY1 === undefined && ABILITYH === undefined) {

            ability = ABILITY 

        } else if (ABILITYH === undefined) {

            ability = ABILITY + '\n' + ABILITY1 

           } else if (ABILITY1 === undefined) {

            ability = ABILITY + '\n' + ABILITYH + ' \`\`(H)\`\`'

            } else { 
               ability = ABILITY + '\n' + ABILITY1 + '\n' + ABILITYH + ' \`\`(H)\`\`'
              }

            image = `https://play.pokemonshowdown.com/sprites/ani/${ID}.gif`

        const embed = new Discord.MessageEmbed()
        .setTitle(`No. ${NUM} - ${name}`)
        .setColor('RANDOM')
        .setDescription('A Random Pokemon has Appeared!')
        .addFields(
            { name: 'Type', value: `${type}`, inline: true },
            { name: 'Abilities', value: ability, inline: true },
            { name: 'Tier', value: `${TIER}`, inline: true},
            { name: 'Base HP', value: `💖 ${HP}`, inline: true },
            { name: 'Base Attack', value: `⚔️ ${ATK}`, inline: true },
            { name: 'Base Defense', value: `🛡️ ${DEF}`, inline: true },
            { name: 'Base Sp.Atk', value: `💥 ${SPA}`, inline: true },
            { name: 'Base Sp.Def', value: `🔰 ${SPD}`, inline: true },
            { name: 'Base Speed', value: `⚡ ${SPE}`, inline: true },
        )
        .setImage(image)
        .setFooter(message.author.username, message.author.displayAvatarURL({ format: 'png', size: 256, dynamic: true }))
        .setTimestamp()

        message.channel.send(embed)

    }
}