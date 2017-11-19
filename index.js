const Discord = require('discord.js')
const Markov = require('markov-strings')
const fs = require('fs')
const config = require("./config.json")

var bot = new Discord.Client()
let isReady = true
let messageData = []
const cooldown = 1 * 60000

function sendMarkov(messageData) {
    const markov = new Markov(messageData)
    markov.buildCorpusSync()
    const result = markov.generateSentenceSync()
    return result.string
}

function autoMessage(){
    console.log("sending auto message")
    bot.channels.get(config.defaultChannel).send(sendMarkov(messageData))
}

bot.on('ready', () => {
    console.log("READY!")
    bot.user.setGame("No máximo Gold")
    var channel = bot.channels.get(config.defaultChannel)

    channel.fetchMessages({ limit: 100 })
        .then(message => {
            messageData = message.array()
            messageData = message.map(message => message.content)
            setInterval(autoMessage, cooldown)
        })
        .catch(console.error)


})

bot.on('message', async message => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    if(message.author.bot) return
    
    if (message.content.charAt(0) != config.prefix) {
        var temp = message.content.replace(/ *\<[^)]*\> */g, " ").trim()
        messageData.push(temp)
        console.log('\x1Bc')
        console.log('message log size:' + messageData.length)
        if(messageData.length > config.logMaxSize) {
            messageData.shift()
            console.log('\x1Bc')
            console.log("max size reached: " + messageData)
        }
    }

    if (command === "markov") {
        console.log("Command Triggered")
        message.channel.send(sendMarkov(messageData))
    }

})

bot.login(config.token)
