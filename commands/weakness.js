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
    description: "Shows info on a Pokemon Weakness",
    minArgs: 1,
    expectedArgs: "<Type 1> <Type 2>",
    slash: true,
    testOnly: false,
    ephemeral: false,
    options: [
        {
            name: 'pokemon',
            description: 'Pokemon Name or Number',
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING  
        },
    ],

    callback: ({interaction}) => { 

        const command = interaction.options.getString('pokemon')
        const number = command
        let poke = number.toLowerCase()
        const pokemon = Dex.species.all()
        const dexAbility = Dex.abilities.all()
        var id_filter = number;

      
        if (id_filter >= 1 && id_filter <= 898) {
            no = `${number}`
            var filtered = pokemon.filter(function(item) {
                return no.indexOf(item.num) !== -1 && item.num == `${no}`;
            });

        } else if (id_filter < 1 || id_filter > 898) {
            interaction.reply({
                content: 'Please enter a valid Pokemon Number!',
                ephemeral: true,
            });
            return;

        } else if (!Number.isInteger(id_filter)) {
            str = `${poke}`
            let poke2 = str.split("-");
            let poke3 = poke.split(" ")
            
        if (poke3.length > 1) {

            str2 = `${poke3[1]}`
            let poke5 = str2.split("-")
            arr = poke5.concat(poke3[0])
            let test = arr.join("")
            testMime = 'mimegalarmr'

            if (arr.length > 2) {

                if (test === testMime) {

                    poke6 = 'Mr. Mime-Galar'
                
                    var filtered = pokemon.filter(function(item) {
                        return poke6.indexOf(item.name) !== -1 && item.name == 'Mr. Mime-Galar'
                    });
                } else {
                    interaction.reply({
                        content: 'Please Check for Spelling Errors and notify <@!471026063498018823>!',
                        ephemeral: true,
                    })
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
            } else { 
                interaction.reply({
                    content: 'Please Check for Spelling Errors and notify <@!471026063498018823>!',
                    ephemeral: true,
                })
             return 
            }
        }

        let result = filtered.shift()
            if (result === undefined) {
                interaction.reply({
                    content: 'Please enter a valid Pokemon!',
                    ephemeral: true,
                });
                return;
            }

        let name = result.name
        let ID = result.spriteid
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
                type = `${TYPE3} ${TYPE1}  ${TYPE4} ${TYPE2}`
              }

        let ABILITY = result.abilities[0]
        let ABILITY1 = result.abilities[1]
        let ABILITYH = result.abilities['H']

            if (ABILITY === 'As One (Spectrier)') {

                const newID = 'asonespectrier' 
                const newID2 = 'unnerve' 
       
                    var filteredA1 = dexAbility.filter(function(item) {
                        return newID.indexOf(item.id) !== -1 && item.id == `${newID}`;
                    });

                    var filteredA2 = dexAbility.filter(function(item) {
                        return newID2.indexOf(item.id) !== -1 && item.id == `${newID2}`;
                    });
                    
                    let resultA1 = filteredA1.shift()
                    let resultA2 = filteredA2.shift()
                    let descA1 = resultA1.desc
                    let descA2 = resultA2.desc

                ability = `**${ABILITY}**: ${descA1}\n**Unnerve**: ${descA2}\n**Grim Neigh**: This Pokemon's Special Attack is raised by 1 stage if it attacks and knocks out another Pokemon.`

            } else if (ABILITY === 'As One (Glastrier)') {

                const newID = 'asoneglastrier' 
                const newID2 = 'unnerve' 
       
                    var filteredA1 = dexAbility.filter(function(item) {
                        return newID.indexOf(item.id) !== -1 && item.id == `${newID}`;
                    });

                    var filteredA2 = dexAbility.filter(function(item) {
                        return newID2.indexOf(item.id) !== -1 && item.id == `${newID2}`;
                    });
                    
                    let resultA1 = filteredA1.shift()
                    let resultA2 = filteredA2.shift()
                    let descA1 = resultA1.desc
                    let descA2 = resultA2.desc

                ability = `**${ABILITY}**: ${descA1}\n**Unnerve**: ${descA2}\n**Chilling Neigh**: This Pokemon's Attack is raised by 1 stage if it attacks and knocks out another Pokemon.`

            } else if (ABILITY1 === undefined && ABILITYH === undefined) {
                let A1 = ABILITY.toLowerCase() 
                let strA1 = A1.split(" ")            
                const newID = strA1.join("")   
                var filteredA1 = dexAbility.filter(function(item) {
                    return newID.indexOf(item.id) !== -1 && item.id == `${newID}`;
                });
                let resultA1 = filteredA1.shift()
                let descA1 = resultA1.desc

                ability = `**${ABILITY}**: ${descA1}` 

            } else if (ABILITYH === undefined) {
                let A1 = ABILITY.toLowerCase()
                let A2 = ABILITY1.toLowerCase()  
                let strA1 = A1.split(" ")       
                let strA2 = A2.split(" ")       
                const newID = strA1.join("")  
                const newID2 = strA2.join("")
                var filteredA1 = dexAbility.filter(function(item) {
                    return newID.indexOf(item.id) !== -1 && item.id == `${newID}`;
                });
                var filteredA2 = dexAbility.filter(function(item) {
                    return newID2.indexOf(item.id) !== -1 && item.id == `${newID2}`;
                });
                let resultA1 = filteredA1.shift()
                let resultA2 = filteredA2.shift()
                let descA1 = resultA1.desc
                let descA2 = resultA2.desc

                ability = `**${ABILITY}**: ${descA1} \n**${ABILITY1}**: ${descA2}` 

            } else if (ABILITY1 === undefined) {
                let A1 = ABILITY.toLowerCase()
                let AH = ABILITYH.toLowerCase()  
                let strA1 = A1.split(" ")       
                let strA2 = AH.split(" ")       
                const newID = strA1.join("")  
                const newID2 = strA2.join("")
                var filteredA1 = dexAbility.filter(function(item) {
                    return newID.indexOf(item.id) !== -1 && item.id == `${newID}`;
                });
                var filteredA2 = dexAbility.filter(function(item) {
                    return newID2.indexOf(item.id) !== -1 && item.id == `${newID2}`;
                });
                let resultA1 = filteredA1.shift()
                let resultA2 = filteredA2.shift()
                let descA1 = resultA1.desc
                let descA2 = resultA2.desc
            ability = `**${ABILITY}:** ${descA1} \n**${ABILITYH}**\`\`(H)\`\`: ${descA2}`
            } else { 
                let A1 = ABILITY.toLowerCase()   
                let A2 = ABILITY1.toLowerCase()   
                let AH = ABILITYH.toLowerCase()   
                let strA1 = A1.split(" ")       
                let strA2 = A2.split(" ")
                let strAH = AH.split(" ")      
                const newID = strA1.join("")  
                const newID2 = strA2.join("")
                const newID3 = strAH.join("")     
       
                    var filteredA1 = dexAbility.filter(function(item) {
                        return newID.indexOf(item.id) !== -1 && item.id == `${newID}`;
                    });

                    var filteredA2 = dexAbility.filter(function(item) {
                        return newID2.indexOf(item.id) !== -1 && item.id == `${newID2}`;
                    });
                    
                    var filteredAH = dexAbility.filter(function(item) {
                        return newID3.indexOf(item.id) !== -1 && item.id == `${newID3}`;
                    });

                    let resultA1 = filteredA1.shift()
                    let resultA2 = filteredA2.shift()
                    let resultAH = filteredAH.shift()

                    let descA1 = resultA1.desc
                    let descA2 = resultA2.desc
                    let descAH = resultAH.desc

                ability = `**${ABILITY}**: ${descA1}\n**${ABILITY1}**: ${descA2}\n**${ABILITYH}**\`\`(H)\`\`: ${descAH}`
                }


                const type1 = TYPE1.toLowerCase()
                let type2 = ''
                if (TYPE2 !== undefined) {
                  type2 = TYPE2.toLowerCase() }
                const icon = 'https://cdn.discordapp.com/emojis/902838153671491604.png'   
        
                function capitalize(str) {
                    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
                  }
        
                let types = Object.keys(Dex.data.TypeChart);
                let targetTyping = []
        
                    if ( TYPE2 === undefined || type1 === type2) {
                        targetTyping = [`${type1}`]
                    } else { 
                        targetTyping = [`${type1}`, `${type2}`] 
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
                

          icons = `https://play.pokemonshowdown.com/sprites/gen5/${ID}.png`
          image = `https://play.pokemonshowdown.com/sprites/ani/${ID}.gif`
          const typeFinal = `${ability}\n\n**x0.00**: ${final1}\n**x0.25**: ${final2}\n**x0.50**: ${final3}\n**x1.00**: ${final4}\n**x2.00**: ${final5}\n**x4.00**: ${final6}\n`

          const weaknessEmbed = new Discord.MessageEmbed()
          .setAuthor(`${name}`, `${icon}`)
          .setTitle(`${type}`)
          .setThumbnail(`${image}`)
          .setColor('#ff0000')
          .setDescription(`${typeFinal}`)
          .setFooter(`Info missing? Please report to enlighten.`, `https://i.imgur.com/TSTyfLb.png`)

            interaction.reply({
                embeds: [weaknessEmbed],
            })
    }
}