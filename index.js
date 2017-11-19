const Discord = require('discord.js');
const Markov = require('markov-strings');
const fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var bot = new Discord.Client();
let isReady = true;
let messageData = [];
const cooldown = 1 * 60000;

function sendMarkov(messageData) {
    const markov = new Markov(messageData);
    markov.buildCorpusSync();
    const result = markov.generateSentenceSync();
    return result.string;
}

function autoMessage(){
    console.log("sending auto message")
    bot.channels.get(config.defaultChannel).send(sendMarkov(messageData))
}

bot.on('ready', () => {
    console.log("READY!")
    bot.user.setGame("No máximo Gold");
    var channel = bot.channels.get(config.defaultChannel)

    channel.fetchMessages({ limit: 100 })
        .then(message => {
            messageData = message.array()
            messageData = message.map(message => message.content)
            setInterval(autoMessage, cooldown)
        })
        .catch(console.error);


});

bot.on('message', message => {
    if (message.author.bot === false && message.content.charAt(0) != "!") {
        var temp = message.content.replace(/ *\<[^)]*\> */g, " ").trim()
        messageData.push(temp);
        console.log('\x1Bc')
        console.log('message log size:' + messageData.length)
        if(messageData.length > config.logMaxSize) {
            messageData.shift();
            console.log('\x1Bc')
            console.log("max size reached: " + messageData);
        }
    }

    if (message.content === "!markov") {
        console.log("Command Triggered")
        message.channel.send(sendMarkov(messageData));
    }

});

bot.login(config.token);
