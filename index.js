var Discord = require('discord.js');
const Markov = require('markov-strings');
const asyncInterval = require('asyncinterval');

var bot = new Discord.Client();
let isReady = true;
let messageData = [];
const maxSize = 2000;
const chatGeral = '203151370029760512';
const cooldown = 1 * 60000;

function sendMarkov(messageData) {
    const markov = new Markov(messageData);
    markov.buildCorpusSync();
    const result = markov.generateSentenceSync();
    return result.string;
}

function autoMessage(){
    console.log("sending auto message")
    bot.channels.get(chatGeral).send(sendMarkov(messageData))
}

bot.on('ready', () => {
    console.log("READY!")
    bot.user.setGame("No máximo Gold");
    var channel = bot.channels.get(chatGeral)

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
        if(messageData.length > maxSize) {
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



    


bot.login('MzQ0Njg5NTExNjM0MTczOTY0.DGwY7A.CWhzXezDPCP7ZTsgQH_9pTelQgY');
