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
    commands: ['dex', 'd'],
    aliases: ['d'],
    description: "Shows a PokeDex entry",
    minArgs: 1,
    expectedArgs: "<pokemon name or number>",
    callback: (message, arguments) => { 
   
        let command = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);
               
        const number = command

        const pokemon = Dex.species.all()

        var id_filter = number;

       poke = number.toLowerCase()

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
              
                 TYPE1 = '🐦 Bird'
                 TYPE2 = '⚪ Normal'

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
              .setFooter(`| Height: ${HT} m | Weight: ${WT} kg |`, `<insert image link here>`) //insert generic or custom pokedex image link here.

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
                        message.channel.send('Please Check for Spelling Errors.')
                         return

                    }
        
                    } else

               { poke4 = poke3.join("")
                
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
               return poke4.indexOf(item.id) !== -1 
                }); 
        } else { message.channel.send('Please Check for Spelling Errors.')
             return 
            }
        }

        let result = filtered.shift()

        //console.log(result)

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
        //let DESC = result.shortDesc // No Data available in Pokemon-Showdown API, will be adding via JSON
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
        .setAuthor(`No. ${NUM} - Species Info TBD`, `${icons}`) // I plan to add species info via JSON, omit for now
        .setTitle(`${name}`)
        .setColor('#ff0000')
        .setDescription('Descriptions coming soon!') // I will also be adding this info via JSON 
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
        .setFooter(`| Height: ${HT} m | Weight: ${WT} kg |`, `<insert image link here>`) //insert generic or custom pokedex image link here.

        message.channel.send(embed)

    }
}