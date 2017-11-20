const Discord = require('discord.js')
const Markov = require('markov-strings')
const fs = require('fs')

const {token, defaultChannel, logMaxSize, prefix, defaultCooldown} = require("./config.json");

var bot = new Discord.Client();
let isReady = true;
let messageData = [];
let minutes = defaultCooldown;
let cooldown = minutes * 60000;

function sendMarkov(messageData) {
    const markov = new Markov(messageData)
    markov.buildCorpusSync()
    const result = markov.generateSentenceSync()
    return result.string
}

function autoMessage(){
    console.log("sending auto message")
    bot.channels.get(defaultChannel).send(sendMarkov(messageData))
}

console.log(defaultChannel)

bot.on('ready', () => {
    console.log("READY!")
    bot.user.setGame("No máximo Gold")
    var channel = bot.channels.get(defaultChannel)

    channel.fetchMessages({ limit: 100 })
        .then(message => {
            messageData = message.array()
            messageData = message.map(message => message.content)
            setInterval(autoMessage, cooldown)
        })
        .catch(console.error)
})

bot.on('message', async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    const modRole = message.guild.roles.find("name", "MOD")

    if (message.author.bot) return;

    if (message.content.charAt(0) != prefix) {
        var temp = message.content.replace(/ *\<[^)]*\> */g, " ").trim()
        messageData.push(temp)
        console.log('\x1Bc')
        console.log('message log size:' + messageData.length)
        if(messageData.length > logMaxSize) {
            messageData.shift();
            console.log('\x1Bc')
            console.log("max size reached: " + messageData)
        }
    }

    if (command === "markov") {
        console.log("Command Triggered")
        message.channel.send(sendMarkov(messageData))
    }

    if(command === "changecd") {
        if (!modRole) {
            return console.log("não existe role de mod aqui não pasero")
        }
        if (!message.member.roles.has(modRole.id)) {
            return message.reply("Esse comando é só pra carraixco, saí daí minha vítima");
        } else {
            if (!isNaN(args[0])) {
                minutes = parseInt(args[0]);
                message.channel.send(`Cooldown agora é de ${minutes} minuto(s)`)
                console.log(`Cooldown changed to ${minutes} minutes`)
            } else {
                message.channel.send("Essa porra não é número não pasero")
            }
        }
    }

})

bot.login(token)