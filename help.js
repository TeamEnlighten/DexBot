module.exports = {
    callback: ({ instance }) => {
        instance.commandHandler.commands.forEach((command) =>{
        console.log(command)
        })
    }
}