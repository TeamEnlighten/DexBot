const {Dex} = require('pokemon-showdown');
const Discord = require('discord.js')
const test2 = require('../dex.json')
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
    commands: ['dex', 'd'],
    aliases: ['d'],
    description: "Shows a PokeDex entry",
    minArgs: 1,
    expectedArgs: "<pokemon name or number>",
    callback: (message) => { 

        let command = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);
               
        const number = command
        poke = number.toLowerCase()
        const pokemon = Dex.species.all()
        var id_filter = number;

       if (poke === 'missingno' || poke === 'missing no' || poke === 'missing no.' || poke === 'missingno.' || poke === '0') {

        poke2 = 'missingno'
        
                var filtered = pokemon.filter(function(item) {
                  return poke2.indexOf(item.id) !== -1 
              });

              let result = filtered.shift()

              if (result === undefined) {
                  message.reply('please enter a valid dex entry!');
      
                  return;
              }
      
              let name = result.name
              let NUM = result.num
              let HP = result.baseStats.hp
              let ATK = result.baseStats.atk
              let DEF = result.baseStats.def
              let SPA = result.baseStats.spa
              let SPD = result.baseStats.spd
              let SPE = result.baseStats.spe
              let TIER = result.tier
              
                 TYPE1 = '🐦'
                 TYPE2 = '<:Normal:862271574526132234>'

                type = TYPE1 + '\n' + TYPE2

              let HT = result.heightm
              let WT = result.weightkg
              let ability = 'None' 

              const mnoembed = new Discord.MessageEmbed()
              .setAuthor(`No. ${NUM} - Glitch Pokémon`, `http://play.pokemonshowdown.com/sprites/gen1/missingno.png`)
              .setTitle(`${name}`)
              .setDescription('**???**')
              .setColor('#ff0000')
              //.setDescription('Here is the Dex entry you requested!')
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
              .setImage(`http://play.pokemonshowdown.com/sprites/gen1/missingno.png`)
              .setFooter(`| Height: ${HT} m | Weight: ${WT} kg |`, `https://i.imgur.com/TSTyfLb.png`)

              message.channel.send(mnoembed)      

        return

        } else if (id_filter >= 1 && id_filter <= 898) {
            no = `${number}`

            var filtered = pokemon.filter(function(item) {
                return no.indexOf(item.num) !== -1 && item.num == `${no}`;
            });

        } else if (id_filter < 0 || id_filter >= 899) {
            message.reply('please enter a valid dex entry!');

            return;

        } else if (!Number.isInteger(id_filter)) {
            str = `${poke}`
            poke2 = str.split("-");
            poke3 = poke.split(" ")
            
        if (poke3.length > 1) {

            str2 = `${poke3[1]}`
            poke5 = str2.split("-")
            arr = poke5.concat(poke3[0])
            test = arr.join("")
            test1 = 'mimegalarmr'

            if (arr.length > 2) {

                if (test === test1) {

                    poke6 = 'Mr. Mime-Galar'
                
                    var filtered = pokemon.filter(function(item) {
                        return poke6.indexOf(item.name) !== -1 && item.name == 'Mr. Mime-Galar'
                    });
                } else {
                    message.channel.send('Please Check for Spelling Errors. <@!471026063498018823> has been notified.')
                        return
                }
            } else { 
                
                poke4 = poke3.join("")

                var filtered = pokemon.filter(function(item) {
               return poke4.indexOf(item.id) !== -1 
                }); 
            }
        } else if (poke2.length > 1) {
            for (let i = 0; i < poke2.length; i++) {
            poke2[i] = poke2[i][0].toUpperCase() + poke2[i].substr(1);
             }
      
            poke1 = poke2.join("-");
            
                var filtered = pokemon.filter(function(item) {
                  return poke1.indexOf(item.name) !== -1 && item.name == `${poke1}`;
              });

            }  else if (poke3.length = 1) {

                poke4 = poke3.join("")
                
                var filtered = pokemon.filter(function(item) {
               return poke4.indexOf(item.id) !== -1 && item.id === `${poke4}`
                }); 
            } else { message.channel.send('Please Check for Spelling Errors or Report to enlighten1self.')
            return 
            }
        }

        let result = filtered.shift()

        if (result === undefined) {
            message.reply('please enter a valid dex entry!');
            return;
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

        var filter2 = test2.filter(function(item) {
            return ID2.indexOf(item.name) !== -1 
             })

        let DESC = ''
        let SPECIES = ''
    
             if (filter2[0] === undefined) {
                 DESC = 'Description Coming Soon!'
                 SPECIES = 'Species TBD'
             } else {
                DESC = filter2[0]['desc']
                SPECIES = filter2[0]['species']
             }
    
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

        icons = `https://play.pokemonshowdown.com/sprites/gen5/${ID}.png`
        image = `https://play.pokemonshowdown.com/sprites/ani/${ID}.gif`

        const embed = new Discord.MessageEmbed()
        .setAuthor(`No. ${NUM} - ${SPECIES}`, `${icons}`)
        .setTitle(`${name}`)
        .setColor('#ff0000')
        .setDescription(`${DESC}`)
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
        .setFooter(`| Height: ${HT} m | Weight: ${WT} kg |`, `https://i.imgur.com/TSTyfLb.png`)

        message.channel.send(embed)

    }
}