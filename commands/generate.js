const {Teams} = require('pokemon-showdown');

module.exports = {
    category: 'Other',
    description: "Generates a Random Team",
    slash: true,
    testOnly: false,
    ephemeral: false,

    callback: ({interaction}) => {

      const team = Teams.generate()
      const final = Teams.export(team)
        interaction.reply({
          content: `${final}`,
        })
    },
  }