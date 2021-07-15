const {Dex} = require('pokemon-showdown');
const SPRITE_URL = 'http://play.pokemonshowdown.com/sprites/';

module.exports = {
    commands: ['sprite', 'gif'],
    aliases: ['gif'],
    description: "GIF of a Pokémon. Uses PokemonShowdown's sprite library.",
    minArgs: 0,
    maxArgs: 3,
    expectedArgs: "<shiny> <afd, back, female noani> <pokemon name>",
    callback: (message, arguments) => { 

    if (message.content.toLowerCase() === '!sprite' || message.content.toLowerCase() === '!gif'){   //Manually update prefix if changed.
        message.channel.send("**__PokemonShowdown's Sprite Directory:__** \nhttp://play.pokemonshowdown.com/sprites/")      
      return;
    }

    const arg = arguments[0].toLowerCase()
    dc = ''

    function pcheck(poke) {
      const pokemon = Dex.species.all()
      str = `${spriteId}`
      poke = str.split("-");

      for (let i = 0; i < poke.length; i++) {
        poke[i] = poke[i][0].toUpperCase() + poke[i].substr(1);
      }
      pokeG = poke[1]
     // console.log(pokeG)
      poke2 = poke.join("-");

        var filtered = pokemon.filter(function(item) {
          return poke2.indexOf(item.name) !== -1 && item.name == `${poke2}`;
      });
      //console.log(filtered)
      let check = filtered.shift()

      if (check === undefined) {
        message.channel.send(`\`\`404 Error: Sprite does not exist.\`\``);
        dc = 'dnc'
        return dc
      }   
    }

    function pcheck2(poke) {
      str = `${spriteId}`
      poke = str.split("-");

      for (let i = 0; i < poke.length; i++) {
        poke[i] = poke[i][0].toUpperCase() + poke[i].substr(1);
      }
      pokeG = poke[1]
     
      if (pokeG === 'Galar' || pokeG === 'Gmax') {
        message.channel.send(`\`\`404 Error: Sprite does not exist.\`\``);
        dc = 'dnc'
        return dc
      }   
    }

    let ending = '.gif';
    
    if (arg === 'missingno') {
      dir = 'gen1';
      spriteId = arg
      ending = '.png'

    } else if (arg === 'missingno-aerodactyl') {
      dir = 'gen1';
      spriteId = arg
      ending = '.png'

    } else if (arg === 'missingno-kabutops') {
      dir = 'gen1';
      spriteId = arg
      ending = '.png'

    } else if (arg === 'missingno-ghost') {
      dir = 'gen1';
      spriteId = arg
      ending = '.png'

    } else if (arg === 'missingno-yellow') {
      dir = 'gen1';
      spriteId = arg
      ending = '.png'

    } else if (arg === 'back' || arg === 'b') {
      arg1 = arguments[1].toLowerCase()
      spriteId = arg1
      dir = 'ani-back';
      pcheck(spriteId) 
        if (dc === 'dnc') { return } 

    } else if (arg === 'shiny' || arg === 's') {
      arg1 = arguments[1].toLowerCase()

       if (arg1 === 'back' || arg1 === 'b') {
        arg2 = arguments[2].toLowerCase()
        spriteId = arg2
        dir = 'ani-back-shiny';
        pcheck(spriteId) 
          if (dc === 'dnc') { return } 

      } else if (arg1 === 'noani' || arg1 === 'na') {
        dir = 'dex-shiny';
        arg2 = arguments[2].toLowerCase()
        spriteId = arg2
        ending = '.png'
        pcheck(spriteId) 
        pcheck2(spriteId) 
          if (dc === 'dnc') { return } 

      } else if (arg1 === 'afd') {
        dir = 'afd-shiny';
        arg2 = arguments[2].toLowerCase()
        spriteId = arg2
        ending = '.png'
        pcheck(spriteId)  
          if (dc === 'dnc') { return }

      } else if (arg1 === 'female' || arg1 === 'f' ) {
          arg2 = arguments[2].toLowerCase()
          spriteId = arg2
          spriteId2 = (arg2 + '-f')
          dir = 'ani-shiny'
          pcheck(spriteId) 
         if (dc === 'dnc') { return } 
         message.channel.send(`${SPRITE_URL}${dir}/${spriteId2}${ending}`)
           return;

      } else if (arg1 === 'charizard-mega-x' || arg1 === 'charizard-mega-y') {
        spriteId = arg1
        dir = 'ani-shiny';
        pcheck(spriteId) 
          if (dc === 'dnc') { return } 
        if (spriteId === 'charizard-mega-x') { message.channel.send(`${SPRITE_URL}${dir}/charizard-megax${ending}`) 
        } else { message.channel.send(`${SPRITE_URL}${dir}/charizard-megay${ending}`) }
          return;

        } else if (arg1 === 'mewtwo-mega-x' || arg1 === 'mewtwo-mega-y') {
        spriteId = arg1
        dir = 'ani-shiny';
        pcheck(spriteId) 
          if (dc === 'dnc') { return } 
        if (spriteId === 'mewtwo-mega-x') { message.channel.send(`${SPRITE_URL}${dir}/mewtwo-megax${ending}`) 
        } else { message.channel.send(`${SPRITE_URL}${dir}/mewtwo-megay${ending}`) }
          return;

        } else {
      spriteId = arg1
      dir = 'ani-shiny';
      pcheck(spriteId) 
        if (dc === 'dnc') { return } 
      }
    } else if (arg === 'noani' || arg === 'na') {
      dir = 'dex';
      arg1 = arguments[1].toLowerCase()
      spriteId = arg1
      ending = '.png'
      pcheck(spriteId) 
      pcheck2(spriteId) 
        if (dc === 'dnc') { return } 

    } else if (arg === 'afd') {
      dir = 'afd';
      arg1 = arguments[1].toLowerCase()
      spriteId = arg1
      ending = '.png'
      pcheck(spriteId) 
        if (dc === 'dnc') { return } 

    } else if (arg === 'female' || arg === 'f' ) {
        arg1 = arguments[1].toLowerCase()
        spriteId = (arg1 + '-f')
        dir = 'ani'
        pcheck(spriteId) 
        if (dc === 'dnc') { return } 

    } else if (arg === 'charizard-mega-x' || arg === 'charizard-mega-y') {
      spriteId = arg
      dir = 'ani';
      pcheck(spriteId) 
        if (dc === 'dnc') { return } 

      if (spriteId === 'charizard-mega-x') { message.channel.send(`${SPRITE_URL}${dir}/charizard-megax${ending}`) 
      } else { message.channel.send(`${SPRITE_URL}${dir}/charizard-megay${ending}`) }
        return;

      } else if (arg === 'mewtow-mega-x' || arg === 'mewtwo-mega-y') {
        spriteId = arg
        dir = 'ani';
        pcheck(spriteId) 
          if (dc === 'dnc') { return } 
  
        if (spriteId === 'mewtwo-mega-x') { message.channel.send(`${SPRITE_URL}${dir}/mewtwo-megax${ending}`) 
        } else { message.channel.send(`${SPRITE_URL}${dir}/mewtwo-megay${ending}`) }
          return;
  
        } else {
        spriteId = arg
        dir = 'ani'
        pcheck(spriteId) 
        if (dc === 'dnc') { return } 
    }
     message.channel.send(`${SPRITE_URL}${dir}/${spriteId}${ending}`)
  }
}