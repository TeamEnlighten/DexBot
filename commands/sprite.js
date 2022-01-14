const {Dex} = require('pokemon-showdown');
const Discord = require('discord.js');
const SPRITE_URL = 'http://play.pokemonshowdown.com/sprites/';
const fem = ['']

module.exports = {
    category: 'Pokedex',
    description: "GIF of a Pokémon. Uses PokemonShowdown's sprite library.",
    minArgs: 0,
    maxArgs: 8,
    expectedArgs: "<pokemon name> <shiny> <back> <female> <ani/noani> <afd>",
    slash: true,
    testOnly: false,
    options: [
      {
        name: 'pokemon',
        description: 'Pokemon Name',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING  
      },
      {
        name: 'shiny',
        description: 'Shiny or Not',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.BOOLEAN
      },
      {
        name: 'ani',
        description: 'Animated or Not',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.BOOLEAN
      },
      {
        name: 'back',
        description: 'Back or Front',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.BOOLEAN
      },
      {
        name: 'female',
        description: 'Female or Not',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.BOOLEAN
      },
      {
        name: 'afd',
        description: 'April Fools Day',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.BOOLEAN
      },
    ],

    callback: async ({interaction, args}) => { 

      if (args.length === 0) {
        interaction.reply({
          content: `**__PokemonShowdown's Sprite Directory:__** \n${SPRITE_URL}`,
          ephemeral: true,
        })
      } else {

      const arg = interaction.options.getString('pokemon')
      const arg1 = interaction.options.getBoolean('shiny')
      const arg2 = interaction.options.getBoolean('ani')
      const arg3 = interaction.options.getBoolean('back')
      const arg4 = interaction.options.getBoolean('female')
      const arg5 = interaction.options.getBoolean('afd')
      let spriteId = arg 
      let dir = ''
      let dc = ''
      let ending = '.gif'

      function numConvert(numC) {
        const pokemon = Dex.species.all()
        numC = `${spriteId}`

        if (numC >= 1 && numC <= 898) {
          
          var convert = pokemon.filter(function(item) {
              return numC.indexOf(item.num) !== -1 && item.num == `${numC}`;
          });

          let result = convert.shift()
          let returned = result.name
          spriteId = returned.toLowerCase()
          
        }
        return spriteId
      } 

      numConvert(spriteId) 

      function pcheck(poke) {
        const pokemon = Dex.species.all()
          str = `${spriteId}`
          poke = str.split("-");
    
          for (let i = 0; i < poke.length; i++) {
            poke[i] = poke[i][0].toUpperCase() + poke[i].substr(1);
          }
          pokeG = poke[1]
          poke2 = poke.join("-");
    
            var filtered = pokemon.filter(function(item) {
              return poke2.indexOf(item.name) !== -1 && item.name == `${poke2}`;
          });

        let check = filtered.shift()
  
        if (check === undefined) {
          interaction.reply({
            content: `\`\`404 Error: Sprite cannot be found.\`\``
          });
          dc = 'dnc'
          return dc 
        }   
      }

  
      if (arg === 'missingno' || arg === '0') {
        dir = 'gen1';
        ending = '.png'
        spriteId = 'missingno'

        interaction.reply({
          content: `${SPRITE_URL}${dir}/${spriteId}${ending}`,
        })

        return
  
      } else if (arg === 'missingno-aerodactyl') {
        dir = 'gen1';
        ending = '.png'
        spriteId = 'missingno-aerodactyl'

        interaction.reply({
          content: `${SPRITE_URL}${dir}/${spriteId}${ending}`,
        })

        return
  
      } else if (arg === 'missingno-kabutops') {
        dir = 'gen1';
        ending = '.png'
        spriteId = 'missingno-kabutops'

        interaction.reply({
          content: `${SPRITE_URL}${dir}/${spriteId}${ending}`,
        })

        return
  
      } else if (arg === 'missingno-ghost') {
        dir = 'gen1';
        ending = '.png'
        spriteId = 'missingno-ghost'

        interaction.reply({
          content: `${SPRITE_URL}${dir}/${spriteId}${ending}`,
        })

        return
  
      } else if (arg === 'missingno-yellow') {
        dir = 'gen1';
        ending = '.png'
        spriteId = 'missingno-yellow'

        interaction.reply({
          content: `${SPRITE_URL}${dir}/${spriteId}${ending}`,
        })

        return
      } 

      pcheck(spriteId) 
          if (dc === 'dnc') { return } 

      if (arg1 === true) {
        dir = 'ani-shiny';
  
        if (arg2 === false) {
          dir = 'gen5-shiny';
          ending = '.png'

          if (arg3 === true) {
            dir = 'gen5-back-shiny'

            if (arg4 === true) {
              spriteId = (spriteId + '-f')

              if (arg5 === true) {
                dir = 'afd-back-shiny'
              }
            } else { 
                if (arg5 === true) {
                  dir = 'afd-back-shiny'
                }
            }
          }
        } 

        else if (arg3 === true) {
          dir = 'ani-back-shiny'

            if (arg4 === true) {
              spriteId = (spriteId + '-f')
            }
        }
        
        else if (arg5 === true) {
          dir = 'afd-shiny';
          ending = '.png'
        } 
      
      else if (arg4 === true) {
          spriteId = (spriteId + '-f')
          dir = 'ani-shiny'
      } 
      
      else if (arg === 'charizard-mega-x' || arg === 'charizard-mega-y') {
        dir = 'ani-shiny'; 
        dir = 'ani';
          if (spriteId === 'charizard-mega-x') { 
            spriteId = 'charizard-megax'
          } else { 
            spriteId = 'charizard-megay'
          }
      }
        
      else if (arg === 'mewtwo-mega-x' || arg === 'mewtwo-mega-y') {
        dir = 'ani-shiny';
          if (spriteId === 'mewtwo-mega-x') { 
            spriteId = 'mewtwo-megax'
          } else { 
            spriteId = 'mewtwo-megay'
        }
      } 
      } 
    
      else if (arg2 === false) {
      dir = 'gen5';
      ending = '.png'
  
      } else if (arg3 === true) {
        dir = 'ani-back'; 

      } else if (arg4 === true) {
        spriteId = (spriteId + '-f')
        dir = 'ani' 

    } else if (arg5 === true) {
        dir = 'afd';
        ending = '.png'
      } 
      
      else if (arg === 'charizard-mega-x' || arg === 'charizard-mega-y') {
        dir = 'ani';
          if (spriteId === 'charizard-mega-x') { 
            spriteId = 'charizard-megax'
          } else { 
            spriteId = 'charizard-megay'
          }
        } 
        
        else if (arg === 'mewtow-mega-x' || arg === 'mewtwo-mega-y') {
          dir = 'ani';
            if (spriteId === 'mewtwo-mega-x') { 
              spriteId = 'mewtwo-megax'
            } else { 
              spriteId = 'mewtwo-megay'
            }
          } 
          
          else {
          dir = 'ani'
      }
        interaction.reply({
          content: `${SPRITE_URL}${dir}/${spriteId}${ending}`,
        })
      }
   }
}